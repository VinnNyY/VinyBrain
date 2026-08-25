/**
 * Configuração central do estágio do produto.
 *
 * O Legacy Doc está em MVP. Tudo que comunica esse estágio na landing
 * é definido aqui, em um único lugar, para não haver divergência entre seções.
 */

/**
 * Meta de inscrições da lista de espera.
 *
 * PONTO ÚNICO DE ALTERAÇÃO: mudar este número atualiza a seção de lista de
 * espera, a barra de progresso, o texto do CTA final e o schema da página.
 * Definido com o Vinicius em 2026-08-14.
 */
export const WAITLIST_GOAL = 100;

/** Badge de estágio exibido no header e no hero. Definido em 2026-08-14. */
export const STAGE_BADGE = "Em desenvolvimento";

/**
 * Status possíveis por funcionalidade.
 *
 * Regra de honestidade do projeto: nada é marcado como `available` sem
 * confirmação técnica no código do produto. Na dúvida, use `planned`.
 */
export type FeatureStatus = "available" | "in-progress" | "planned";

export const featureStatusLabel: Record<FeatureStatus, string> = {
  available: "Disponível no MVP",
  "in-progress": "Em desenvolvimento",
  planned: "Planejado",
};
