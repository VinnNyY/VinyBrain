import Image from "next/image";
import {
  ArrowRight,
  Braces,
  CheckCircle2,
} from "lucide-react";
import { FAQAccordion } from "@/components/faq-accordion";
import { Header } from "@/components/header";
import { ProductMockup } from "@/components/product-mockup";
import { ProductTabs } from "@/components/product-tabs";
import { Badge, ButtonLink, Container, IconShell, Section } from "@/components/ui";
import {
  benefits,
  differentiators,
  hero,
  problems,
  reportSections,
  roadmap,
  site,
  team,
  transformation,
  useCases,
  workflow,
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
        <WorkflowSection />
        <InterfaceSection />
        <ReportSection />
        <BenefitsSection />
        <UseCasesSection />
        <DifferentiatorsSection />
        <ResearchSection />
        <RoadmapSection />
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
    <section id="topo" className="scroll-mt-24 py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          <div className="min-w-0">
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-normal text-white sm:text-6xl sm:leading-[1.03] lg:text-[64px]">
              {hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              {hero.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#lista">{site.ctaPrimary}</ButtonLink>
              <ButtonLink href="#como-funciona" variant="secondary">
                {site.ctaSecondary}
              </ButtonLink>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-400">{hero.microcopy}</p>
          </div>
          <ProductMockup />
        </div>
      </Container>
    </section>
  );
}

function TransformationSection() {
  return (
    <Section
      id="transformacao"
      eyebrow="Demonstração da transformação"
      title={transformation.title}
      description={transformation.description}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
        <div className="card">
          <Badge tone="amber">Antes</Badge>
          <h3 className="mt-5 text-xl font-semibold text-white">Código disperso</h3>
          <p className="mt-3 leading-7 text-slate-400">{transformation.before}</p>
          <pre className="code-scroll mt-5" tabIndex={0}><code>{`// README antigo
// regra depende do módulo billing
// confirmar comportamento com equipe`}</code></pre>
        </div>
        <div className="hidden items-center justify-center text-blue-300 lg:flex" aria-hidden="true">
          <ArrowRight size={28} />
        </div>
        <div className="card">
          <Badge tone="green">Depois</Badge>
          <h3 className="mt-5 text-xl font-semibold text-white">Documentação revisável</h3>
          <p className="mt-3 leading-7 text-slate-400">{transformation.after}</p>
          <ul className="mt-5 grid gap-2 text-sm text-slate-300">
            {["Visão geral", "Módulos", "Fluxos", "Pontos de atenção"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-300" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

function ProblemSection() {
  return (
    <Section
      id="problema"
      eyebrow="Problema"
      title="Quando o conhecimento está espalhado pelo código"
      description="Manter um sistema legado exige entender arquitetura, regras e dependências que muitas vezes nunca foram documentadas ou deixaram de refletir o estado real do software."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {problems.map((item) => (
          <article key={item.title} className="card">
            <IconShell icon={item.icon} />
            <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-400">{item.description}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

function WorkflowSection() {
  return (
    <Section
      id="como-funciona"
      eyebrow="Como funciona"
      title="Da análise do repositório à documentação estruturada"
    >
      <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {workflow.map((item, index) => (
          <li key={item.title} className="card relative overflow-hidden">
            <span className="absolute right-5 top-5 font-mono text-sm font-bold text-blue-200">
              {String(index + 1).padStart(2, "0")}
            </span>
            <IconShell icon={item.icon} />
            <h3 className="mt-5 pr-10 text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-400">{item.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function InterfaceSection() {
  return (
    <Section
      id="produto"
      eyebrow="Interface do produto"
      title="Uma interface para entender antes de documentar"
      description="A experiência do Legacy Doc deve ajudar o time a acompanhar a análise, navegar pelos achados e entender de onde vem cada parte da documentação gerada."
    >
      <ProductTabs />
      <p className="mt-4 text-sm leading-6 text-slate-500">
        Conteúdo visual demonstrativo. Screenshots reais ainda precisam ser confirmados antes da publicação da landing.
      </p>
    </Section>
  );
}

function ReportSection() {
  return (
    <Section
      id="relatorio"
      eyebrow="Relatório gerado"
      title="Documentação técnica pronta para revisão"
      description="A saída esperada é uma documentação inicial organizada para apoiar leitura, manutenção e onboarding."
    >
      <div className="panel overflow-hidden">
        <div className="grid lg:grid-cols-[240px_1fr]">
          <nav aria-label="Índice do relatório demonstrativo" className="hidden border-r border-white/10 p-5 lg:grid lg:content-start lg:gap-2">
            {reportSections.map((item) => (
              <a key={item} href="#relatorio" className="focus-ring rounded-md px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
                {item}
              </a>
            ))}
          </nav>
          <div className="p-5 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-white">Visão geral do sistema</h3>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
                  A documentação gerada não deve ser tratada como definitiva sem revisão da equipe responsável.
                </p>
              </div>
              <Badge tone="amber">Revisão necessária</Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {reportSections.slice(0, 4).map((item) => (
                <article key={item} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                  <h4 className="font-semibold text-white">{item}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Seção preparada para organizar achados técnicos e apoiar revisão.
                  </p>
                </article>
              ))}
            </div>
            <div className="mt-6 rounded-lg border border-white/10 bg-[#090d15]">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                <span className="font-mono text-xs text-slate-400">src/billing/InvoiceService.ts</span>
                <span className="badge badge-amber">Evidência para revisão</span>
              </div>
              <pre className="code-scroll" tabIndex={0}><code>{`function processInvoice(invoice) {
  validateUser(invoice.userId)
  syncInvoice(invoice.id)
  retryPayment(invoice.paymentId)
}`}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function BenefitsSection() {
  return (
    <Section id="beneficios" eyebrow="Benefícios" title="Mais contexto para manter e evoluir sistemas">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {benefits.map((item) => (
          <article key={item.title} className="card">
            <IconShell icon={item.icon} />
            <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-400">{item.description}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

function UseCasesSection() {
  return (
    <Section id="aplicacoes" eyebrow="Cenários de aplicação" title="Onde o Legacy Doc pode ajudar">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {useCases.map((item) => (
          <article key={item.title} className="card">
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-400">{item.description}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

function DifferentiatorsSection() {
  return (
    <Section
      id="diferenciais"
      eyebrow="Diferenciais técnicos"
      title="O que torna o Legacy Doc diferente"
      description="A proposta do Legacy Doc é unir análise de código e geração de documentação em um fluxo orientado a repositórios, com foco em bases legadas e resultado revisável por equipes técnicas."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {differentiators.map((item) => (
          <article key={item.title} className="card">
            <IconShell icon={item.icon} />
            <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-400">{item.description}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

function ResearchSection() {
  return (
    <Section
      id="pesquisa"
      eyebrow="Pesquisa e desenvolvimento"
      title="Uma pesquisa aplicada que evolui para produto"
      description="O Legacy Doc nasceu de uma pesquisa em Ciência da Computação sobre documentação de sistemas legados. Essa origem ajuda a orientar metodologia, validação inicial e evolução futura, enquanto o posicionamento principal segue sendo o de um produto de tecnologia em desenvolvimento."
    >
      <div className="panel grid gap-5 p-5 md:grid-cols-[auto_1fr] md:p-6">
        <IconShell icon={Braces} />
        <p className="text-sm leading-7 text-slate-400">
          Esta seção fica intencionalmente secundária: ela explica a origem e o método sem posicionar o Legacy Doc como apenas um trabalho acadêmico.
        </p>
      </div>
    </Section>
  );
}

function RoadmapSection() {
  return (
    <Section
      id="roadmap"
      eyebrow="Roadmap"
      title="Evolução planejada do Legacy Doc"
      description="O roadmap público deve separar claramente o que já foi validado do que está em desenvolvimento ou planejado."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {roadmap.map((item) => (
          <article key={item.title} className="card">
            <Badge>{item.title}</Badge>
            <p className="mt-5 text-sm leading-7 text-slate-400">{item.description}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

function TeamSection() {
  return (
    <Section
      id="equipe"
      eyebrow="Equipe"
      title="Equipe Legacy Doc"
      description="O material inicial apresenta Bernardo Clepf, Jhonatan Costa, Matheus Tavares e Vinicius Alves como equipe do Legacy Doc. Papéis públicos devem ser confirmados antes da publicação."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((name) => (
          <article key={name} className="card">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-blue-400/25 bg-blue-500/10 font-semibold text-blue-100">
              {name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
            </div>
            <h3 className="text-lg font-semibold text-white">{name}</h3>
            <p className="mt-2 text-sm text-slate-400">Papel público pendente de confirmação.</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

function FAQSection() {
  return (
    <Section id="faq" eyebrow="FAQ" title="Perguntas frequentes">
      <FAQAccordion />
    </Section>
  );
}

function FinalCTA() {
  return (
    <section id="lista" className="scroll-mt-24 py-16 sm:py-20">
      <Container>
        <div className="panel grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="eyebrow">CTA final</p>
            <h2 className="text-3xl font-semibold leading-tight text-white">
              Quer criar uma primeira documentação para um sistema existente?
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-slate-400">
              Entre na lista de interesse para acompanhar a evolução do Legacy Doc. O canal de captura definitivo ainda depende de confirmação.
            </p>
          </div>
          <ButtonLink href="#lista">
            {site.ctaPrimary}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <Container>
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/pdf-extracted/legacy-doc-001.png"
                alt="Logo Legacy Doc"
                width={36}
                height={36}
                className="h-9 w-9 rounded-lg border border-blue-400/20 object-contain"
              />
              <span className="font-semibold text-white">Legacy Doc</span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Produto em desenvolvimento para gerar documentação técnica estruturada a partir de bases de código legadas ou pouco documentadas.
            </p>
          </div>
          <div className="grid gap-2 text-sm text-slate-400">
            <span>Domínio público pendente.</span>
            <span>Política de privacidade pendente.</span>
            <span>Sem publicação ou deploy nesta etapa.</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
