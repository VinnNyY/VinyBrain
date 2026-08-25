/**
 * API da lista de espera do Legacy Doc — Cloudflare Worker + D1.
 *
 * A landing é servida como site estático pela StayCloud, que não executa
 * código no servidor. Esta função cobre a parte dinâmica: gravar inscrições e
 * devolver a contagem real.
 *
 *   GET  /          → { count, goal }
 *   POST /          → { status: "created" | "duplicate", count, goal }
 *   GET  /export    → CSV das inscrições (exige Bearer ADMIN_TOKEN)
 *
 * PRIVACIDADE — os e-mails são dados pessoais reais:
 * - nada de e-mail em log, nem em caminho de erro;
 * - o IP nunca é armazenado em claro: só um hash com salt, usado para rate
 *   limit, e descartado após a janela;
 * - o CSV existe para o titular dos dados ser atendido e para operação, e é
 *   protegido por token; o conteúdo nunca vai para o repositório ou vault.
 */

export interface Env {
  DB: D1Database;
  /** Origens autorizadas, separadas por vírgula. Sem curinga. */
  ALLOWED_ORIGINS: string;
  /** Meta de inscrições. Deve espelhar WAITLIST_GOAL no front. */
  WAITLIST_GOAL?: string;
  /** Segredo para `GET /export`. Definir com `wrangler secret put`. */
  ADMIN_TOKEN: string;
  /** Salt do hash de IP. Definir com `wrangler secret put`. */
  IP_HASH_SALT: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Máximo de envios aceitos por IP dentro da janela. */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_SECONDS = 3600;

/** Corpo maior que isso é recusado antes de qualquer parsing. */
const MAX_BODY_BYTES = 2048;

const CODEBASE_SIZES = new Set([
  "Menos de 10 mil linhas",
  "10 mil a 100 mil linhas",
  "100 mil a 1 milhão de linhas",
  "Mais de 1 milhão de linhas",
]);

function corsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get("Origin") ?? "";
  const allowed = env.ALLOWED_ORIGINS.split(",").map((value) => value.trim());
  const isAllowed = allowed.includes(origin);

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : allowed[0] ?? "",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(data: unknown, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

/** Hash com salt: permite contar tentativas sem guardar o IP em claro. */
async function hashIp(ip: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function countRows(env: Env): Promise<number> {
  const row = await env.DB.prepare("SELECT COUNT(*) AS total FROM waitlist").first<{
    total: number;
  }>();
  return row?.total ?? 0;
}

/** true = pode seguir; false = estourou o limite. Limpa registros vencidos. */
async function checkRateLimit(env: Env, ipHash: string): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - RATE_LIMIT_WINDOW_SECONDS;

  await env.DB.prepare("DELETE FROM rate_limit WHERE ts < ?").bind(windowStart).run();

  const row = await env.DB.prepare(
    "SELECT COUNT(*) AS total FROM rate_limit WHERE ip_hash = ? AND ts >= ?",
  )
    .bind(ipHash, windowStart)
    .first<{ total: number }>();

  if ((row?.total ?? 0) >= RATE_LIMIT_MAX) return false;

  await env.DB.prepare("INSERT INTO rate_limit (ip_hash, ts) VALUES (?, ?)")
    .bind(ipHash, now)
    .run();

  return true;
}

/** Aceita apenas valores de uma lista fechada. Texto livre não entra no banco. */
function pickFromSet(value: unknown, allowed: Set<string>): string | null {
  return typeof value === "string" && allowed.has(value) ? value : null;
}

/** Linguagem: texto curto, apenas letras, números e separadores simples. */
function sanitizeLanguage(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, 40);
  if (!trimmed) return null;
  return /^[\p{L}\p{N} .,+#/-]+$/u.test(trimmed) ? trimmed : null;
}

function csvCell(value: string | null): string {
  const text = value ?? "";
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

async function handleExport(request: Request, env: Env): Promise<Response> {
  const expected = env.ADMIN_TOKEN;

  // FALHA FECHADA. Se o secret não estiver configurado, o endpoint não abre em
  // hipótese alguma — nem cai em comparação de dois valores vazios, que é como
  // esse tipo de checagem costuma vazar. Recusa antes de olhar o header.
  if (typeof expected !== "string" || expected.length < 16) {
    return new Response("export_disabled", { status: 503 });
  }

  const auth = request.headers.get("Authorization") ?? "";
  if (!auth.startsWith("Bearer ")) {
    return new Response("unauthorized", { status: 401 });
  }
  const provided = auth.slice(7);

  // Comparação de tamanho constante para não vazar o segredo por timing.
  const encoder = new TextEncoder();
  const a = encoder.encode(provided);
  const b = encoder.encode(expected);
  let equal = a.length === b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] !== b[i]) equal = false;
  }

  if (!equal) {
    return new Response("unauthorized", { status: 401 });
  }

  const { results } = await env.DB.prepare(
    "SELECT email, codebase_size, language, created_at FROM waitlist ORDER BY created_at ASC",
  ).all<{
    email: string;
    codebase_size: string | null;
    language: string | null;
    created_at: string;
  }>();

  const header = "email,tamanho_base,linguagem,inscrito_em";
  const lines = (results ?? []).map((row) =>
    [
      csvCell(row.email),
      csvCell(row.codebase_size),
      csvCell(row.language),
      csvCell(row.created_at),
    ].join(","),
  );

  return new Response([header, ...lines].join("\n") + "\n", {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="legacy-doc-lista-de-espera.csv"',
      "Cache-Control": "no-store",
    },
  });
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cors = corsHeaders(request, env);
    const goal = Number(env.WAITLIST_GOAL ?? 100);
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    // Export não recebe CORS: é uso operacional, não do navegador público.
    if (url.pathname === "/export") {
      if (request.method !== "GET") {
        return new Response("method_not_allowed", { status: 405 });
      }
      try {
        return await handleExport(request, env);
      } catch {
        return new Response("storage_unavailable", { status: 503 });
      }
    }

    if (request.method === "GET") {
      try {
        return json({ count: await countRows(env), goal }, 200, cors);
      } catch {
        return json({ count: null, goal }, 503, cors);
      }
    }

    if (request.method !== "POST") {
      return json({ error: "method_not_allowed" }, 405, cors);
    }

    const declaredLength = Number(request.headers.get("Content-Length") ?? "0");
    if (declaredLength > MAX_BODY_BYTES) {
      return json({ error: "payload_too_large" }, 413, cors);
    }

    let raw: string;
    try {
      raw = await request.text();
    } catch {
      return json({ error: "invalid_payload" }, 400, cors);
    }

    if (raw.length > MAX_BODY_BYTES) {
      return json({ error: "payload_too_large" }, 413, cors);
    }

    let payload: unknown;
    try {
      payload = JSON.parse(raw);
    } catch {
      return json({ error: "invalid_payload" }, 400, cors);
    }

    if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
      return json({ error: "invalid_payload" }, 400, cors);
    }

    const body = payload as Record<string, unknown>;

    // Honeypot: campo escondido que pessoa nenhuma preenche. Se veio com
    // conteúdo, é bot. Devolvemos uma resposta de sucesso plausível, sem
    // gravar nada e sem alterar a contagem — não vale ensinar o bot a acertar.
    const honeypot = body.website;
    if (typeof honeypot === "string" && honeypot.trim() !== "") {
      try {
        return json({ status: "created", count: await countRows(env), goal }, 201, cors);
      } catch {
        return json({ status: "created", count: null, goal }, 201, cors);
      }
    }

    const email = (typeof body.email === "string" ? body.email : "").trim().toLowerCase();
    if (!EMAIL_PATTERN.test(email) || email.length > 254) {
      return json({ error: "invalid_email" }, 422, cors);
    }

    const ip = request.headers.get("CF-Connecting-IP") ?? "";
    try {
      if (ip) {
        const allowed = await checkRateLimit(env, await hashIp(ip, env.IP_HASH_SALT));
        if (!allowed) {
          return json({ error: "rate_limited" }, 429, { ...cors, "Retry-After": "3600" });
        }
      }

      const existing = await env.DB.prepare("SELECT 1 FROM waitlist WHERE email = ?")
        .bind(email)
        .first();

      if (existing) {
        return json({ status: "duplicate", count: await countRows(env), goal }, 200, cors);
      }

      await env.DB.prepare(
        `INSERT INTO waitlist (email, codebase_size, language, created_at)
         VALUES (?, ?, ?, ?)`,
      )
        .bind(
          email,
          pickFromSet(body.codebaseSize, CODEBASE_SIZES),
          sanitizeLanguage(body.language),
          new Date().toISOString(),
        )
        .run();

      return json({ status: "created", count: await countRows(env), goal }, 201, cors);
    } catch {
      return json({ error: "storage_unavailable" }, 503, cors);
    }
  },
};

export default worker;
