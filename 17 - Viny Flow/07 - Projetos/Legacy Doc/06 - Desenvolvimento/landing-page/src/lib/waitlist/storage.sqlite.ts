/**
 * Implementação de `WaitlistStorage` sobre o SQLite embutido do Node
 * (`node:sqlite`, disponível a partir do Node 22.5). Escolhido para não
 * adicionar dependência ao projeto.
 *
 * Limitação conhecida: grava em arquivo no disco local. Funciona em `next dev`
 * e `next start` em servidor próprio. NÃO sobrevive a deploy serverless — nesse
 * cenário, trocar por outra implementação do contrato (ver `storage.ts`).
 *
 * Privacidade: e-mails são dado pessoal. Nada aqui é logado em stdout.
 */

import { DatabaseSync } from "node:sqlite";
import { chmodSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

import type { SubscribeResult, WaitlistEntry, WaitlistStorage } from "./storage";

/**
 * O banco fica FORA do repositório e FORA do vault Obsidian.
 *
 * E-mails são dados pessoais reais: gravar em `./data` colocaria o arquivo
 * dentro do vault, que é sincronizado e indexado. O padrão aponta para o
 * diretório de dados do usuário, com permissão restrita.
 */
const DB_PATH =
  process.env.WAITLIST_DB_PATH ??
  join(homedir(), ".local", "share", "legacy-doc", "waitlist.db");

let db: DatabaseSync | null = null;

function getDb(): DatabaseSync {
  if (db) return db;

  mkdirSync(dirname(DB_PATH), { recursive: true, mode: 0o700 });
  const database = new DatabaseSync(DB_PATH);
  try {
    chmodSync(DB_PATH, 0o600);
  } catch {
    // sistema de arquivos sem suporte a permissão POSIX: segue sem falhar
  }

  database.exec(`
    CREATE TABLE IF NOT EXISTS waitlist (
      email TEXT PRIMARY KEY,
      codebase_size TEXT,
      language TEXT,
      created_at TEXT NOT NULL
    )
  `);

  db = database;
  return database;
}

export const sqliteWaitlistStorage: WaitlistStorage = {
  async subscribe(entry: WaitlistEntry): Promise<SubscribeResult> {
    const database = getDb();

    const existing = database
      .prepare("SELECT 1 FROM waitlist WHERE email = ?")
      .get(entry.email);

    if (existing) {
      return { status: "duplicate", count: await this.count() };
    }

    database
      .prepare(
        `INSERT INTO waitlist (email, codebase_size, language, created_at)
         VALUES (?, ?, ?, ?)`,
      )
      .run(
        entry.email,
        entry.codebaseSize ?? null,
        entry.language ?? null,
        new Date().toISOString(),
      );

    return { status: "created", count: await this.count() };
  },

  async count(): Promise<number> {
    const row = getDb().prepare("SELECT COUNT(*) AS total FROM waitlist").get() as
      | { total: number }
      | undefined;
    return row?.total ?? 0;
  },
};
