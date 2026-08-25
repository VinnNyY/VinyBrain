"use client";

import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, FileText, ShieldCheck } from "lucide-react";

import { Header } from "@/components/header";
import { Badge, ButtonLink, Container, IconShell } from "@/components/ui";
import { plans, site } from "@/lib/landing-content";

/**
 * Conteúdo do resumo de plano.
 *
 * Client Component por causa do `useSearchParams`: a versão anterior lia
 * `searchParams` no servidor, o que torna a rota dinâmica e impede o export
 * estático exigido pela hospedagem da StayCloud.
 */
export function CheckoutContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("plano");
  const selectedPlan = plans.find((plan) => plan.slug === slug) ?? plans[2];

  return (
    <>
      <a href="#conteudo" className="skip-link">
        Ir para o conteúdo
      </a>
      <Header linkPrefix={site.slug} />
      <main id="conteudo" className="checkout-page">
        <Container>
          <a href={`${site.slug}#planos`} className="checkout-back">
            <ArrowLeft size={18} aria-hidden="true" />
            Voltar aos planos
          </a>

          <div className="checkout-layout">
            <section className="checkout-copy" aria-labelledby="checkout-title">
              <p className="eyebrow">Modelo previsto</p>
              <h1 id="checkout-title">Revise o plano selecionado</h1>
              <p>
                Nenhum plano está disponível para contratação no momento. Esta página organiza
                a escolha antes do contato com a equipe Legacy Doc, e os valores seguem o
                material oficial do produto.
              </p>

              <div className="checkout-steps" aria-label="Etapas do processo">
                <article>
                  <IconShell icon={FileText} />
                  <div>
                    <h2>Resumo</h2>
                    <p>Confira preço, licenças e recursos do plano escolhido.</p>
                  </div>
                </article>
                <article>
                  <IconShell icon={ShieldCheck} />
                  <div>
                    <h2>Validação</h2>
                    <p>A equipe confirma o escopo e os próximos passos comerciais.</p>
                  </div>
                </article>
              </div>
            </section>

            <aside
              className="checkout-summary"
              aria-label={`Resumo do plano ${selectedPlan.name}`}
            >
              <div className="checkout-summary-top">
                <div>
                  <span>Plano selecionado</span>
                  <h2>{selectedPlan.name}</h2>
                </div>
                {selectedPlan.badge ? <Badge tone="green">{selectedPlan.badge}</Badge> : null}
              </div>

              <div className="checkout-price">
                <strong>{selectedPlan.price}</strong>
                <span>{selectedPlan.period}</span>
              </div>
              <p className="checkout-currency">Valores em dólares.</p>
              <p className="plan-licenses">{selectedPlan.licenses}</p>

              <ul className="checkout-features">
                {selectedPlan.features.map((feature) => (
                  <li key={feature}>
                    <CheckCircle2 size={17} aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="checkout-actions">
                <ButtonLink href="#proximo-passo" className="w-full">
                  Continuar
                </ButtonLink>
                <ButtonLink
                  href={`${site.slug}#planos`}
                  variant="secondary"
                  className="w-full"
                >
                  Alterar plano
                </ButtonLink>
              </div>
            </aside>
          </div>

          <section id="proximo-passo" className="checkout-next-step">
            <div>
              <p className="eyebrow">Próximo passo</p>
              <h2>Converse com a equipe para avançar</h2>
              <p>
                Esta etapa mantém o plano selecionado e direciona a conversa para avaliação de
                escopo, acesso e próximos passos.
              </p>
            </div>
            <ButtonLink href={`${site.slug}#lista-de-espera`} variant="secondary">
              Ir para a lista de espera
            </ButtonLink>
          </section>
        </Container>
      </main>
    </>
  );
}
