import {
  AlertTriangle,
  ArrowRight,
  BookOpenText,
  Boxes,
  Braces,
  CheckCircle2,
  CircleHelp,
  ClipboardList,
  Code2,
  FileCode2,
  FileText,
  GitBranch,
  History,
  Layers3,
  ListChecks,
  Moon,
  Network,
  RefreshCcw,
  SearchCode,
  Sparkles,
  Sun,
  Users,
} from "lucide-react";

export const site = {
  name: "Legacy Doc",
  title: "Legacy Doc | Documentação de código legado com IA",
  description:
    "Use IA para analisar repositórios legados ou pouco documentados e gerar documentação técnica estruturada para times de engenharia.",
  slug: "/documentacao-codigo-legado",
  /**
   * Origem pública atual. Alimenta canonical, Open Graph e JSON-LD.
   *
   * É o subdomínio provisório da plataforma. Trocar pelo domínio próprio
   * antes da divulgação pública — e, na mesma troca, reavaliar o `robots`,
   * que hoje é `noindex, nofollow` de propósito.
   */
  pendingDomain: "https://legacy-doc.stayai.space",
  ctaPrimary: "Entrar na lista de espera",
  ctaSecondary: "Ver demonstração",
};

export const navItems = [
  { label: "Demonstração", href: "#demonstracao" },
  { label: "Relatório", href: "#relatorio" },
  { label: "Lista de espera", href: "#lista-de-espera" },
  { label: "Planos", href: "#planos" },
  { label: "Roadmap", href: "#pesquisa" },
  { label: "FAQ", href: "#faq" },
];

export const hero = {
  eyebrow: "Produto em desenvolvimento",
  /** Deixa o estágio explícito logo na primeira dobra, ao lado do badge. */
  stageLine: "MVP em construção — ainda não disponível para uso geral",
  title: "Documentação técnica gerada a partir do seu código",
  description:
    "O Legacy Doc analisa o repositório e organiza estrutura, funções, parâmetros, retornos e descrições em uma documentação técnica revisável.",
  microcopy: "A documentação gerada deve ser revisada pela equipe técnica.",
};

export const transformation = {
  title: "Do código sem contexto ao relatório técnico",
  description:
    "A proposta é converter sinais espalhados no repositório em uma primeira versão de documentação que o time consegue revisar, complementar e evoluir.",
  before: [
    "Arquivos dispersos",
    "Funções sem descrição",
    "Regras escondidas no código",
    "Conhecimento concentrado",
  ],
  after: [
    "Estrutura organizada",
    "Funções documentadas",
    "Parâmetros e retornos descritos",
    "Relatório técnico revisável",
  ],
};

export const problems = [
  {
    title: "O sistema funciona, mas pouca gente entende por quê.",
    description:
      "Bases antigas carregam decisões, dependências e regras que raramente aparecem em documentos atualizados.",
  },
  {
    title: "Cada manutenção começa com uma investigação.",
    description:
      "Antes de evoluir, refatorar ou migrar, a equipe precisa reconstruir contexto técnico lendo código e perguntando a quem lembra da história.",
  },
];

export const pipeline = [
  {
    title: "Repositório",
    label: "URL ou base de código",
    description: "A entrada real será definida conforme validação técnica.",
    icon: GitBranch,
  },
  {
    title: "Varredura",
    label: "Arquivos identificados",
    description: "O sistema mapeia arquivos, módulos e sinais de estrutura.",
    icon: SearchCode,
  },
  {
    title: "Análise",
    label: "Funções e relações",
    description: "A IA apoia a identificação de funções, parâmetros, retornos e dependências.",
    icon: Network,
  },
  {
    title: "Documentação",
    label: "Relatório revisável",
    description: "A saída organiza os achados em seções técnicas para revisão humana.",
    icon: FileText,
  },
];

export const productTabs = [
  {
    id: "analisar",
    label: "Analisar",
    title: "Entrada do repositório",
    description: "Tela oficial do material Legacy Doc para iniciar uma análise por URL de repositório.",
    image: "/assets/legacy-doc-v2/screen-analisar.png",
    alt: "Screenshot do Legacy Doc com campo para informar URL de repositório e iniciar análise",
    icon: FileCode2,
  },
  {
    id: "historico",
    label: "Histórico",
    title: "Histórico de documentações",
    description: "Visual oficial do material com documentações geradas e ações de resultado.",
    image: "/assets/legacy-doc-v2/screen-historico.png",
    alt: "Screenshot do Legacy Doc com histórico de documentações geradas",
    icon: History,
  },
  {
    id: "resultado",
    label: "Resultado",
    title: "Resultado da documentação",
    description: "Documento gerado com informações de repositório, arquivo principal, status e funções.",
    image: "/assets/legacy-doc-v2/screen-relatorio.png",
    alt: "Screenshot de relatório técnico gerado pelo Legacy Doc",
    icon: FileText,
  },
  {
    id: "relatorio",
    label: "Relatório",
    title: "Documento revisável",
    description: "O relatório real do material mostra funções, argumentos, linguagem e observações.",
    image: "/assets/legacy-doc-v2/screen-relatorio.png",
    alt: "Relatório técnico do Legacy Doc com resumo executivo, funções documentadas e observações",
    icon: ClipboardList,
  },
  {
    id: "tema-claro",
    label: "Tema claro",
    title: "Interface em tema claro",
    description: "Recorte oficial do material com a experiência em superfície clara.",
    image: "/assets/legacy-doc-v2/screen-analisar.png",
    alt: "Screenshot do Legacy Doc em tema claro",
    icon: Sun,
  },
  {
    id: "tema-escuro",
    label: "Tema escuro",
    title: "Interface em tema escuro",
    description: "Recorte oficial do material com a experiência em tema escuro.",
    image: "/assets/legacy-doc-v2/screen-tema-escuro.png",
    alt: "Screenshot do Legacy Doc em tema escuro",
    icon: Moon,
  },
];

export const reportDetails = [
  "Visão geral do repositório",
  "Linguagem identificada",
  "Funções documentadas",
  "Argumentos e parâmetros",
  "Retornos",
  "Descrições",
  "Qualidade estrutural",
  "Observações para revisão",
];

export const benefits = [
  {
    title: "Primeira base de documentação",
    description: "Ajuda o time a sair da página em branco ao documentar um sistema existente.",
    icon: BookOpenText,
  },
  {
    title: "Contexto para manutenção",
    description: "Organiza informações técnicas úteis antes de alterar código legado.",
    icon: Boxes,
  },
  {
    title: "Apoio ao onboarding",
    description: "Facilita a leitura inicial de módulos, funções e fluxos relevantes.",
    icon: Users,
  },
];

export const useCases = [
  "Entrada em projeto legado",
  "Auditoria técnica",
  "Transição de equipe",
  "Refatoração",
  "Modernização",
];

export const differentiators = [
  {
    title: "Foco em legado",
    description: "Pensado para bases difíceis de entender ou pouco documentadas.",
    icon: GitBranch,
  },
  {
    title: "Saída estruturada",
    description: "O objetivo é gerar documentação, não apenas respostas soltas.",
    icon: ClipboardList,
  },
  {
    title: "Fluxo revisável",
    description: "A equipe técnica continua responsável por validar o resultado.",
    icon: CheckCircle2,
  },
];

export const plans = [
  {
    name: "Basic",
    slug: "basic",
    price: "$300",
    period: "/ mês",
    licenses: "10 licenças de usuário",
    features: ["Recursos básicos", "Suporte"],
    cta: "Falar com a equipe",
    href: "#lista-de-espera",
  },
  {
    name: "Plus",
    slug: "plus",
    price: "$800",
    period: "/ mês",
    licenses: "30 licenças de usuário",
    features: ["Modelos adaptáveis", "Suporte personalizado"],
    cta: "Falar com a equipe",
    href: "#lista-de-espera",
  },
  {
    name: "Ultra",
    slug: "ultra",
    price: "$1.400",
    period: "/ mês",
    licenses: "50 licenças de usuário",
    features: ["Modelos adaptáveis", "Suporte personalizado", "Acesso ao Core LD 1.0"],
    cta: "Falar com a equipe",
    href: "#lista-de-espera",
    badge: "Destaque",
  },
  {
    name: "Stand Alone",
    slug: "stand-alone",
    price: "$59",
    period: "/ mês",
    licenses: "1 licença de usuário",
    features: ["Recursos básicos", "Suporte"],
    cta: "Falar com a equipe",
    href: "#lista-de-espera",
  },
];

export const planFaq = [
  {
    question: "Os valores estão em qual moeda?",
    answer: "Os valores estão em dólares e foram mantidos como aparecem no material oficial: $300, $800, $1.400 e $59 por mês.",
  },
  {
    question: "Como funciona o próximo passo?",
    answer: "Ao escolher um plano, você acessa um resumo para revisar a opção selecionada e iniciar contato com a equipe Legacy Doc.",
  },
  {
    question: "O que significa Core LD 1.0?",
    answer: "Core LD 1.0 se refere ao core próprio do Legacy Doc incluído no plano Ultra.",
  },
];

export const roadmap = [
  {
    title: "Proposta confirmada",
    description: "Análise de bases de código e geração de documentação técnica estruturada.",
  },
  {
    title: "Em validação",
    description: "Entradas aceitas, formatos de saída, critérios de qualidade e revisão humana.",
  },
  {
    title: "Planejado",
    description: "Integrações, histórico de documentação, colaboração e controles de segurança, se aprovados tecnicamente.",
  },
];

export const team = [
  "Bernardo Clepf",
  "Jhonatan Costa",
  "Matheus Tavares",
  "Vinicius Alves",
];

export const faq = [
  {
    question: "O que é o Legacy Doc?",
    answer:
      "O Legacy Doc é uma ferramenta em desenvolvimento que usa IA para analisar repositórios e bases de código, especialmente sistemas legados ou pouco documentados, e gerar documentação técnica estruturada.",
  },
  {
    question: "A documentação gerada é definitiva?",
    answer:
      "Não. Ela deve ser tratada como uma primeira versão estruturada, útil para acelerar entendimento e revisão. A validação final deve ser feita por pessoas da equipe técnica.",
  },
  {
    question: "Quais linguagens são suportadas?",
    answer:
      "Compatibilidades específicas ainda precisam ser confirmadas conforme a evolução técnica do produto.",
  },
  {
    question: "O código precisa sair do ambiente da empresa?",
    answer:
      "Esse ponto ainda precisa de definição técnica e política de segurança. A página não promete suporte a código privado ou ambiente enterprise sem documentação específica.",
  },
  {
    question: "Qual é a origem do produto?",
    answer:
      "O Legacy Doc nasceu de uma pesquisa aplicada em Ciência da Computação e evolui como produto voltado à documentação técnica de bases de código reais.",
  },
];

export const iconMap = {
  AlertTriangle,
  ArrowRight,
  Braces,
  CheckCircle2,
  CircleHelp,
  Code2,
  Layers3,
  ListChecks,
  RefreshCcw,
  SearchCode,
  Sparkles,
};
