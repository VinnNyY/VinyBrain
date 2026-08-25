/**
 * Tipagem mínima de `node:sqlite`.
 *
 * O módulo existe no runtime (Node 22.22 deste ambiente), mas o projeto usa
 * `@types/node@20`, que ainda não o declara. Optamos por declarar apenas a
 * superfície usada em `src/lib/waitlist/storage.sqlite.ts`, em vez de subir a
 * versão de `@types/node` e arriscar mudanças de tipo em todo o projeto.
 *
 * Remover este arquivo quando `@types/node` for atualizado para 22+.
 */
declare module "node:sqlite" {
  type SQLiteValue = string | number | bigint | null | Uint8Array;

  class StatementSync {
    get(...params: SQLiteValue[]): unknown;
    run(...params: SQLiteValue[]): { changes: number; lastInsertRowid: number | bigint };
    all(...params: SQLiteValue[]): unknown[];
  }

  export class DatabaseSync {
    constructor(path: string, options?: { open?: boolean; readOnly?: boolean });
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
    close(): void;
  }
}
