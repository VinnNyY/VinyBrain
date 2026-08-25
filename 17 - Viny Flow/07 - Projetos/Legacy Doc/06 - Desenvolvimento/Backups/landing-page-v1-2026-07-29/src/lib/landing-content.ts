import {
  AlertTriangle,
  ArrowRight,
  BookOpenText,
  Braces,
  Boxes,
  BrainCircuit,
  CheckCircle2,
  CircleHelp,
  ClipboardList,
  Code2,
  FileCode2,
  FileText,
  GitBranch,
  Layers3,
  ListChecks,
  Network,
  RefreshCcw,
  SearchCode,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

export const site = {
  name: "Legacy Doc",
  title: "Legacy Doc | Documentação de código legado com IA",
  description:
    "Use IA para analisar repositórios legados ou pouco documentados e gerar documentação técnica estruturada para times de engenharia.",
  slug: "/documentacao-codigo-legado",
  pendingDomain: "https://seudominio.com",
  ctaPrimary: "Entrar na lista de interesse",
  ctaSecondary: "Ver como funciona",
};

export const navItems = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Produto", href: "#produto" },
  { label: "Aplicações", href: "#aplicacoes" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "FAQ", href: "#faq" },
];

export const hero = {
  eyebrow: "Produto em desenvolvimento",
  title: "Documentação técnica gerada a partir do seu código",
  description:
    "O Legacy Doc usa IA para analisar repositórios e bases de código, identificar estruturas relevantes e gerar documentação técnica organizada para apoiar manutenção, onboarding e evolução de sistemas legados ou pouco documentados.",
  microcopy:
    "Produto em desenvolvimento. A documentação gerada deve ser revisada pela equipe técnica.",
};

export const transformation = {
  title: "De código disperso a documentação revisável",
  description:
    "Bases antigas costumam carregar regras, dependências e decisões que não aparecem em documentos atualizados. O Legacy Doc organiza sinais encontrados no código em uma base inicial de documentação técnica.",
  before:
    "Repositório pouco documentado, dependências difíceis de rastrear e conhecimento concentrado em poucas pessoas.",
  after:
    "Visão geral do sistema, módulos identificados, fluxos técnicos e pontos de atenção prontos para revisão.",
};

export const problems = [
  {
    title: "Onboarding lento",
    description:
      "Novas pessoas precisam reconstruir contexto lendo código e perguntando a quem conhece a história do sistema.",
    icon: Users,
  },
  {
    title: "Documentação desatualizada",
    description: "Documentos antigos deixam de acompanhar mudanças no código.",
    icon: FileText,
  },
  {
    title: "Conhecimento centralizado",
    description: "Partes críticas do sistema dependem da memória de poucas pessoas.",
    icon: BrainCircuit,
  },
  {
    title: "Modernização com incerteza",
    description:
      "Refatorar ou migrar sem visão clara aumenta o risco técnico.",
    icon: AlertTriangle,
  },
];

export const workflow = [
  {
    title: "Envie ou conecte uma base de código",
    description: "O formato exato de entrada será comunicado conforme validação técnica.",
    icon: FileCode2,
  },
  {
    title: "Analise estrutura e contexto",
    description:
      "A IA apoia a leitura de arquivos, relações e padrões encontrados no código.",
    icon: SearchCode,
  },
  {
    title: "Organize os achados",
    description:
      "O Legacy Doc transforma a análise em seções técnicas compreensíveis.",
    icon: Layers3,
  },
  {
    title: "Revise e evolua",
    description:
      "A equipe técnica valida, ajusta e usa a documentação como base interna.",
    icon: ListChecks,
  },
];

export const reportSections = [
  "Visão geral do sistema",
  "Arquitetura e módulos",
  "Fluxos principais",
  "Dependências",
  "Pontos de atenção",
  "Glossário técnico",
];

export const benefits = [
  {
    title: "Comece por uma base estruturada",
    description:
      "Evite partir de uma página em branco ao documentar sistemas existentes.",
    icon: BookOpenText,
  },
  {
    title: "Apoie onboarding técnico",
    description:
      "Ajude novas pessoas a entender arquitetura, módulos e fluxos principais.",
    icon: Users,
  },
  {
    title: "Organize conhecimento disperso",
    description:
      "Transforme leitura de código em material técnico revisável.",
    icon: Boxes,
  },
  {
    title: "Prepare modernizações",
    description:
      "Use a documentação como apoio para discutir refatoração, migração ou evolução.",
    icon: RefreshCcw,
  },
];

export const useCases = [
  {
    title: "Entrada em projeto legado",
    description: "Criar uma primeira visão técnica antes de alterar o sistema.",
  },
  {
    title: "Transição de equipe",
    description: "Registrar conhecimento antes que contexto se perca.",
  },
  {
    title: "Auditoria técnica",
    description: "Mapear estrutura, dependências e pontos de atenção.",
  },
  {
    title: "Refatoração",
    description: "Entender módulos e fluxos antes de mexer na arquitetura.",
  },
  {
    title: "Modernização",
    description: "Apoiar planejamento de evolução em bases antigas.",
  },
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
  {
    title: "Pesquisa aplicada",
    description: "A origem do produto orienta metodologia e evolução.",
    icon: Sparkles,
  },
];

export const roadmap = [
  {
    title: "Proposta confirmada",
    description:
      "Análise de bases de código e geração de documentação técnica estruturada.",
  },
  {
    title: "Em validação",
    description:
      "Entradas aceitas, formatos de saída, critérios de qualidade e revisão humana.",
  },
  {
    title: "Planejado",
    description:
      "Integrações, histórico de documentação, colaboração e controles de segurança, se aprovados tecnicamente.",
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
    question: "O Legacy Doc substitui desenvolvedores ou analistas?",
    answer:
      "Não. Ele apoia o trabalho técnico ao organizar informações extraídas do código, mas decisões de arquitetura, manutenção e evolução continuam dependendo da equipe responsável.",
  },
];

export const mockTabs = [
  {
    id: "analise",
    label: "Análise",
    icon: SearchCode,
    title: "Análise em andamento",
    description:
      "Arquivos, funções e relações aparecem como sinais técnicos para revisão.",
  },
  {
    id: "modulos",
    label: "Módulos",
    icon: Network,
    title: "Estrutura identificada",
    description:
      "O sistema agrupa achados em módulos, fluxos e dependências observadas.",
  },
  {
    id: "documentacao",
    label: "Documentação",
    icon: FileText,
    title: "Relatório revisável",
    description:
      "A saída vira uma primeira documentação técnica organizada para o time.",
  },
];

export const iconMap = {
  ArrowRight,
  Braces,
  Code2,
  CircleHelp,
  ShieldCheck,
};
