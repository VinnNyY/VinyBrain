import { WAITLIST_GOAL } from "@/lib/mvp-config";
import {
  getWaitlistStorage,
  isValidEmail,
  normalizeEmail,
  sanitizeOptional,
} from "@/lib/waitlist";

/** Acessa o banco a cada request: nunca deve ser prerenderizada. */
export const dynamic = "force-dynamic";

/** Retorna a contagem REAL de inscritos. Nunca estimada, nunca inflada. */
export async function GET() {
  try {
    const count = await getWaitlistStorage().count();
    return Response.json({ count, goal: WAITLIST_GOAL });
  } catch {
    // Sem fonte de dados, a UI esconde o contador em vez de mostrar número falso.
    return Response.json({ count: null, goal: WAITLIST_GOAL }, { status: 503 });
  }
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  if (typeof payload !== "object" || payload === null) {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  const body = payload as Record<string, unknown>;

  // Honeypot, igual ao worker: responde sucesso plausível sem gravar nada.
  const honeypot = body.website;
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    const count = await getWaitlistStorage().count();
    return Response.json({ status: "created", count, goal: WAITLIST_GOAL }, { status: 201 });
  }

  const rawEmail = typeof body.email === "string" ? body.email : "";
  const email = normalizeEmail(rawEmail);

  if (!isValidEmail(email)) {
    return Response.json({ error: "invalid_email" }, { status: 422 });
  }

  try {
    const result = await getWaitlistStorage().subscribe({
      email,
      codebaseSize: sanitizeOptional(body.codebaseSize),
      language: sanitizeOptional(body.language, 40),
    });

    return Response.json(
      { status: result.status, count: result.count, goal: WAITLIST_GOAL },
      { status: result.status === "created" ? 201 : 200 },
    );
  } catch {
    // Erro de storage não expõe detalhe interno nem o e-mail enviado.
    return Response.json({ error: "storage_unavailable" }, { status: 503 });
  }
}
