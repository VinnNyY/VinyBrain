-- Lista de espera do Legacy Doc.
--
-- Minimizacao de dados: guardamos apenas o necessario para a finalidade
-- declarada (avisar sobre acesso antecipado e priorizar o roadmap).
-- Nome, empresa e cargo foram removidos por serem identificaveis sem serem
-- acionaveis para essa finalidade.
CREATE TABLE IF NOT EXISTS waitlist (
  email         TEXT PRIMARY KEY,
  codebase_size TEXT,
  language      TEXT,
  created_at    TEXT NOT NULL
);

-- Controle de abuso por IP.
--
-- O IP NUNCA e gravado em claro: apenas SHA-256 com salt, o que permite
-- contar tentativas sem identificar a pessoa. Registros fora da janela sao
-- apagados a cada requisicao.
CREATE TABLE IF NOT EXISTS rate_limit (
  ip_hash TEXT NOT NULL,
  ts      INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_lookup ON rate_limit (ip_hash, ts);
