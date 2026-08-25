import Image from "next/image";
import { ArrowRight, Braces, CheckCircle2 } from "lucide-react";
import { FAQAccordion } from "@/components/faq-accordion";
import { Header } from "@/components/header";
import { HeroPipeline } from "@/components/hero-pipeline";
import { ProductTabs } from "@/components/product-tabs";
import { Badge, ButtonLink, Container, IconShell, Section } from "@/components/ui";
import { StatusPill } from "@/components/status-pill";
import { WaitlistSection } from "@/components/waitlist-section";
import type { FeatureKey } from "@/lib/feature-status";
import {
  benefits,
  differentiators,
  hero,
  pipeline,
  planFaq,
  plans,
  problems,
  reportDetails,
  roadmap,
  site,
  team,
  transformation,
  useCases,
} from "@/lib/landing-content";
import { faqSchema, jsonLd, softwareApplicationSchema } from "@/lib/schema";

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(softwareApplicationSchema())}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema())} />
      <a href="#conteudo" className="skip-link">
        Ir para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <HeroSection />
        <TransformationSection />
        <ProblemSection />
        <PipelineSection />
        <ProductShowcaseSection />
        <ReportSection />
        <BenefitsUseCasesSection />
        <DifferentiatorsSection />
        <WaitlistSection />
        <PlansSection />
        <ResearchRoadmapSection />
        <TeamSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

function HeroSection() {
  return (
    <section id="topo" className="hero-section">
      <Container>
        <div className="hero-split">
          <div className="hero-copy">
            <p className="hero-stage">
              <span className="hero-stage-dot" aria-hidden="true" />
              <span className="hero-stage-text">{hero.stageLine}</span>
            </p>
            <h1>
              Documentação técnica gerada{" "}
              <span className="hero-accent">a partir do seu código</span>
            </h1>
            <p className="hero-description">{hero.description}</p>
            <div className="hero-actions">
              <ButtonLink href="#lista-de-espera">{site.ctaPrimary}</ButtonLink>
              <ButtonLink href="#demonstracao" variant="secondary">
                {site.ctaSecondary}
              </ButtonLink>
            </div>
            <p className="hero-microcopy">{hero.microcopy}</p>
          </div>

          <div className="hero-visual">
            <HeroPipeline />
          </div>
        </div>
      </Container>
    </section>
  );
}

function TransformationSection() {
  return (
    <Section
      id="transformacao"
      eyebrow="Transformação"
      title={transformation.title}
      description={transformation.description}
      className="band-surface"
    >
      <div className="transform-shell">
        <div className="transform-panel is-before">
          <Badge tone="amber">Antes</Badge>
          <h3>Código difícil de explicar</h3>
          <ul>
            {transformation.before.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <pre className="code-scroll" tabIndex={0}><code>{`// comportamento esperado?
processInvoice(invoice)
retryPayment(invoice.paymentId)
// regra depende do time antigo`}</code></pre>
        </div>
        <div className="transform-arrow" aria-hidden="true">
          <ArrowRight size={30} />
        </div>
        <div className="transform-panel is-after">
          <Badge tone="green">Depois</Badge>
          <h3>Documentação para revisar</h3>
          <ul>
            {transformation.after.map((item) => (
              <li key={item}>
                <CheckCircle2 size={16} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <div className="doc-fragment">
            <strong>Função: somar</strong>
            <span>Parâmetros: num1, num2</span>
            <span>Retorno: double</span>
            <span>Descrição: recebe dois valores e retorna o resultado.</span>
          </div>
        </div>
      </div>
    </Section>
  );
}

function ProblemSection() {
  return (
    <section id="problema" className="problem-band">
      <Container>
        <div className="problem-statement">
          <p className="eyebrow">O problema</p>
          {problems.map((item, index) => (
            <div key={item.title} className="problem-line">
              <span className="problem-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function PipelineSection() {
  return (
    <section id="como-funciona" className="pipeline-band">
      <Container>
        <div className="pipeline-head">
          <h2>Do repositório à documentação</h2>
          <p>Quatro etapas. Cada uma com um estado técnico verificável.</p>
        </div>

        <ol className="pipeline-flow">
          {pipeline.map((item, index) => (
            <li key={item.title}>
              <div className="pipeline-step">
                <IconShell icon={item.icon} />
                <h3>{item.title}</h3>
                <p className="pipeline-label">{item.label}</p>
                <p>{item.description}</p>
              </div>
              {index < pipeline.length - 1 ? (
                <ArrowRight className="pipeline-connector" aria-hidden="true" />
              ) : null}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

function ProductShowcaseSection() {
  return (
    <Section
      id="demonstracao"
      eyebrow="Demonstração do produto"
      title="A interface real precisa aparecer grande o suficiente para ser entendida"
      description="Telas do material oficial do Legacy Doc. Os dados exibidos são demonstrativos e devem ser revisados pela equipe técnica."
      className="band-surface"
    >
      <ProductTabs />
    </Section>
  );
}

function ReportSection() {
  return (
    <section id="relatorio" className="report-section">
      <Container>
        <div className="report-layout">
          <div className="report-copy">
            <p className="eyebrow">Relatório gerado</p>
            <h2>O entregável é uma documentação técnica, não apenas uma resposta de IA</h2>
            <p>
              O relatório organiza informações extraídas do repositório em um documento revisável com funções, argumentos, parâmetros, retornos, descrições e observações.
            </p>
            <div className="report-detail-list">
              {reportDetails.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
          <div className="report-document">
            <Image
              src="/assets/legacy-doc-v2/screen-relatorio.png"
              alt="Relatório técnico do Legacy Doc com resumo executivo, funções documentadas e observações"
              width={465}
              height={650}
              sizes="(max-width: 768px) 92vw, 465px"
              loading="eager"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

function BenefitsUseCasesSection() {
  return (
    <Section
      id="aplicacoes"
      eyebrow="Benefícios e cenários"
      title="Quando o time precisa entender antes de mexer"
      description="O Legacy Doc é mais útil quando existe uma base de código real, pouco documentada, e uma equipe que precisa transformar leitura técnica em material compartilhável."
      className="band-base"
    >
      <div className="benefits-layout">
        <div className="benefit-column">
          {benefits.map((item) => (
            <article key={item.title} className="benefit-row">
              <IconShell icon={item.icon} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="use-case-panel">
          <h3>Cenários de aplicação</h3>
          <div>
            {useCases.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function DifferentiatorsSection() {
  return (
    <section id="diferenciais" className="differentiators-band">
      <Container>
        <div className="differentiators-inner">
          <div className="differentiators-lead">
            <p className="eyebrow">Diferenciais técnicos</p>
            <h2>Uma proposta orientada a documentação revisável</h2>
          </div>
          <p className="differentiators-note">
            Descrevem a direção do produto. Comparações, métricas e superioridade sobre
            concorrentes seguem fora da página até existirem evidências.
          </p>
          <div className="differentiators-cols">
            {differentiators.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * Cada recurso de plano aponta para a fonte central de status. Sem confirmação
 * no código do produto, o padrão é `planejado`.
 */
function planFeatureKey(feature: string): FeatureKey {
  const normalized = feature.toLowerCase();
  if (normalized.includes("modelos")) return "modelos-adaptaveis";
  if (normalized.includes("core")) return "core-ld";
  if (normalized.includes("suporte")) return "suporte";
  return "multiplas-licencas";
}

function PlansSection() {
  return (
    <section id="planos" className="plans-section">
      <Container>
        <div className="plans-heading">
          <div>
            <p className="eyebrow">Modelo previsto</p>
            <h2>Como pretendemos cobrar quando o produto abrir</h2>
          </div>
          <p>
            Estes valores são o modelo de planos previsto, não uma assinatura disponível
            hoje. Nada aqui está aberto para contratação: o produto ainda está em
            desenvolvimento e os valores podem mudar até o lançamento.
          </p>
        </div>

        <p className="plans-notice">
          <span className="status-pill status-planned">Planejado</span>
          Nenhum plano está à venda no momento. Entre na lista de espera para ser avisado
          quando abrirmos.
        </p>

        <div className="plans-rail" aria-label="Planos Legacy Doc">
          {plans.map((plan) => (
            <article key={plan.name} className={`plan-card ${plan.badge ? "is-featured" : ""}`}>
              <div className="plan-top">
                <h3>{plan.name}</h3>
                {plan.badge ? <Badge tone="green">{plan.badge}</Badge> : null}
              </div>
              <div className="plan-price">
                <strong>{plan.price}</strong>
                <span>{plan.period}</span>
              </div>
              <p className="plan-licenses">{plan.licenses}</p>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <CheckCircle2 size={16} aria-hidden="true" />
                    <span>{feature}</span>
                    <StatusPill feature={planFeatureKey(feature)} />
                  </li>
                ))}
              </ul>
              <ButtonLink href={plan.href} variant={plan.badge ? "primary" : "secondary"} className="w-full">
                {plan.cta}
              </ButtonLink>
            </article>
          ))}
        </div>

        <div className="plan-faq">
          {planFaq.map((item) => (
            <article key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function ResearchRoadmapSection() {
  return (
    <section id="pesquisa" className="research-band">
      <Container>
        <div className="research-grid">
          <div className="research-lead">
            <p className="eyebrow">Origem e evolução</p>
            <h2>Pesquisa aplicada como origem, produto como direção</h2>
            <p>
              O Legacy Doc nasceu em uma pesquisa de Ciência da Computação sobre
              documentação de sistemas legados. Essa origem orienta metodologia e validação
              inicial, mas o posicionamento principal segue sendo produto de tecnologia em
              desenvolvimento.
            </p>
            <p className="research-note">
              <Braces size={15} aria-hidden="true" />
              O que está no roadmap ainda não existe no produto.
            </p>
          </div>

          <ol className="roadmap-timeline">
            {roadmap.map((item) => (
              <li key={item.title}>
                <span className="roadmap-marker" aria-hidden="true" />
                <div>
                  <div className="roadmap-head">
                    <h3>{item.title}</h3>
                    <span className="status-pill status-planned">Planejado</span>
                  </div>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

function TeamSection() {
  return (
    <section id="equipe" className="team-band">
      <Container>
        <div className="team-inner">
          <div className="team-lead">
            <p className="eyebrow">Equipe</p>
            <h2>Quem está construindo</h2>
            <p>Papéis públicos ainda não confirmados.</p>
          </div>
          <div className="team-strip">
            {team.map((name) => (
              <article key={name}>
                <div>{name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</div>
                <h3>{name}</h3>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function FAQSection() {
  return (
    <Section id="faq" eyebrow="FAQ" title="Perguntas frequentes" className="band-base">
      <FAQAccordion />
    </Section>
  );
}

function FinalCTA() {
  return (
    <section id="lista" className="final-cta">
      <Container>
        <div className="final-cta-panel">
          <div>
            <p className="eyebrow">Próximo passo</p>
            <h2>Quer avaliar o Legacy Doc em uma base existente?</h2>
            <p>
              Fale com a equipe para acompanhar a evolução do produto ou solicitar acesso quando o canal de validação estiver definido.
            </p>
          </div>
          <div className="final-cta-actions">
            <ButtonLink href="#planos">Ver planos</ButtonLink>
            <ButtonLink href="#demonstracao" variant="secondary">Rever demonstração</ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-layout">
          <div>
            <div className="footer-brand">
              <Image
                src="/assets/pdf-extracted/legacy-doc-001.png"
                alt="Logo Legacy Doc"
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg border border-blue-400/20 object-contain"
              />
              <span>Legacy Doc</span>
            </div>
            <p>
              Produto em desenvolvimento para gerar documentação técnica estruturada a partir de bases de código legadas ou pouco documentadas.
            </p>
          </div>
          <div className="footer-links">
            <a href="#demonstracao">Demonstração</a>
            <a href="#relatorio">Relatório</a>
            <a href="#planos">Planos</a>
            <a href="#faq">FAQ</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
