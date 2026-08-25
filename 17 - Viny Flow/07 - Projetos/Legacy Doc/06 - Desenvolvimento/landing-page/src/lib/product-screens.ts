/**
 * FONTE ÚNICA das capturas de tela do produto.
 *
 * Todas as imagens atuais são recortes do PDF de apresentação (Canva), com
 * menos de 900px de largura e texto já borrado em tamanho nativo. Estão
 * marcadas com `placeholder: true` e a página sinaliza isso ao visitante.
 *
 * PARA SUBSTITUIR: troque `src` pelo arquivo definitivo e vire `placeholder`
 * para `false`. Nada além deste arquivo precisa mudar — o container já está
 * dimensionado para a resolução final.
 *
 * `targetWidth`/`targetHeight` descrevem a captura que precisamos, não o que
 * existe hoje. O container reserva esse espaço via `aspect-ratio`, então a
 * troca não causa deslocamento de layout.
 */

import { FileCode2, FileText, History, Moon } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ProductScreen = {
  id: string;
  label: string;
  title: string;
  description: string;
  src: string;
  alt: string;
  icon: LucideIcon;
  /** Proporção reservada no layout. Evita salto quando a imagem final entrar. */
  aspect: "wide" | "tall";
  /** Largura mínima aceitável da captura definitiva, em pixels reais. */
  targetWidth: number;
  targetHeight: number;
  /** true = recorte provisório de PDF, sinalizado na interface. */
  placeholder: boolean;
};

export const productScreens: ProductScreen[] = [
  {
    id: "analisar",
    label: "Analisar",
    title: "Entrada do repositório",
    description:
      "Tela inicial: informar a URL do repositório e disparar a análise.",
    src: "/assets/legacy-doc-v2/screen-analisar.png",
    alt: "Tela do Legacy Doc com campo para informar a URL de um repositório e botão para iniciar a análise",
    icon: FileCode2,
    aspect: "wide",
    targetWidth: 2560,
    targetHeight: 1440,
    placeholder: true,
  },
  {
    id: "historico",
    label: "Histórico",
    title: "Histórico de documentações",
    description:
      "Documentações já geradas, com acesso ao resultado de cada análise.",
    src: "/assets/legacy-doc-v2/screen-historico.png",
    alt: "Tela do Legacy Doc listando documentações geradas anteriormente",
    icon: History,
    aspect: "wide",
    targetWidth: 2560,
    targetHeight: 1440,
    placeholder: true,
  },
  {
    id: "relatorio",
    label: "Relatório",
    title: "Documento revisável",
    description:
      "Resultado com funções, argumentos, retornos, linguagem e observações.",
    src: "/assets/legacy-doc-v2/screen-relatorio.png",
    alt: "Relatório técnico do Legacy Doc com funções documentadas, argumentos e observações",
    icon: FileText,
    aspect: "tall",
    targetWidth: 1400,
    targetHeight: 1960,
    placeholder: true,
  },
  {
    id: "tema-escuro",
    label: "Tema escuro",
    title: "Interface em tema escuro",
    description: "A mesma experiência em superfície escura.",
    src: "/assets/legacy-doc-v2/screen-tema-escuro.png",
    alt: "Tela do Legacy Doc em tema escuro",
    icon: Moon,
    aspect: "wide",
    targetWidth: 2560,
    targetHeight: 1440,
    placeholder: true,
  },
];

/** true enquanto qualquer captura ainda for recorte provisório. */
export const hasPlaceholderScreens = productScreens.some((s) => s.placeholder);
