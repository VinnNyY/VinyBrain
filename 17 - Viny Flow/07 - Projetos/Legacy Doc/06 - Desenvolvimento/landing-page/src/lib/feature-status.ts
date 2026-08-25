/**
 * FONTE ÚNICA de status por funcionalidade.
 *
 * Regra de honestidade do projeto: nada recebe `available` sem confirmação no
 * código real do produto. Não temos acesso a esse código — só ao material
 * oficial e a capturas de tela. Captura de tela prova que a interface existe,
 * não que a funcionalidade opera de ponta a ponta.
 *
 * Por isso, nesta fase:
 * - `in-progress` → aparece na interface real do produto (evidência visual);
 * - `planned`     → citado como proposta, sem evidência de implementação.
 *
 * Nenhum item está como `available`. Assim que houver confirmação técnica no
 * repositório do produto, promover item a item — e só então.
 */

import type { FeatureStatus } from "@/lib/mvp-config";

export type FeatureKey =
  // vistos na interface do material oficial
  | "analise-repositorio"
  | "relatorio-tecnico"
  | "historico"
  | "tema-claro-escuro"
  // propostos, sem evidência de implementação
  | "varredura-automatica"
  | "aprendizado-recursivo"
  | "repositorios-privados"
  | "integracoes"
  | "exportacao"
  | "core-ld"
  | "modelos-adaptaveis"
  | "suporte"
  | "multiplas-licencas";

export const featureStatus: Record<FeatureKey, FeatureStatus> = {
  // Evidência: telas do material oficial do Legacy Doc.
  "analise-repositorio": "in-progress",
  "relatorio-tecnico": "in-progress",
  historico: "in-progress",
  "tema-claro-escuro": "in-progress",

  // Citados no material como proposta. Sem evidência de implementação.
  "varredura-automatica": "planned",
  "aprendizado-recursivo": "planned",
  "repositorios-privados": "planned",
  integracoes: "planned",
  exportacao: "planned",
  "core-ld": "planned",
  "modelos-adaptaveis": "planned",
  suporte: "planned",
  "multiplas-licencas": "planned",
};
