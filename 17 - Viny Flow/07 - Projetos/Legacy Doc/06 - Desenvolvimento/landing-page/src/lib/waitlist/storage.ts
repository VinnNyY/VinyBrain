/**
 * Contrato de armazenamento da lista de espera.
 *
 * ESTE É O ÚNICO PONTO DE TROCA. Para migrar de SQLite local para um serviço
 * externo (Supabase, Resend, planilha, CRM), basta escrever outra implementação
 * de `WaitlistStorage` e apontar `getWaitlistStorage()` em `index.ts` para ela.
 * Nenhum componente ou rota importa a implementação diretamente.
 */

/**
 * Minimização de dados: só o que serve à finalidade declarada — avisar sobre
 * o acesso antecipado e priorizar o roadmap. Nome, empresa e cargo foram
 * removidos por serem identificáveis sem serem acionáveis.
 */
export type WaitlistEntry = {
  /** Único campo obrigatório. Já normalizado (trim + lowercase). */
  email: string;
  codebaseSize?: string;
  language?: string;
};

export type SubscribeResult =
  | { status: "created"; count: number }
  | { status: "duplicate"; count: number };

export interface WaitlistStorage {
  /** Grava a inscrição. E-mail repetido não gera erro nem duplicata. */
  subscribe(entry: WaitlistEntry): Promise<SubscribeResult>;
  /** Número real de inscritos. Nunca estimado, nunca inflado. */
  count(): Promise<number>;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value) && value.length <= 254;
}

/** Campos opcionais têm limite de tamanho para evitar payload abusivo. */
export function sanitizeOptional(value: unknown, maxLength = 120): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, maxLength);
}
