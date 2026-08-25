/**
 * Seleção da implementação de armazenamento da lista de espera.
 *
 * PARA TROCAR DE BACKEND: importe outra implementação de `WaitlistStorage`
 * e retorne-a aqui. Nada além deste arquivo precisa mudar.
 */

import { sqliteWaitlistStorage } from "./storage.sqlite";
import type { WaitlistStorage } from "./storage";

export function getWaitlistStorage(): WaitlistStorage {
  return sqliteWaitlistStorage;
}

export type { SubscribeResult, WaitlistEntry, WaitlistStorage } from "./storage";
export { isValidEmail, normalizeEmail, sanitizeOptional } from "./storage";
