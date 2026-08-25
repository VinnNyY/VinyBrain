import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { site } from "@/lib/landing-content";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.pendingDomain),
  title: {
    default: site.title,
    template: "%s | Legacy Doc",
  },
  description: site.description,
  applicationName: "Legacy Doc",
  keywords: [
    "documentação de código legado",
    "documentação técnica de software",
    "documentar código legado",
    "análise de repositório com IA",
    "documentação automática de código",
    "documentação de sistemas legados",
    "IA para documentação técnica",
  ],
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: site.slug,
  },
  openGraph: {
    title: site.title,
    description:
      "Analise repositórios legados ou pouco documentados e gere documentação técnica estruturada com apoio de IA.",
    url: site.slug,
    siteName: "Legacy Doc",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/og/legacy-doc.svg",
        width: 1200,
        height: 630,
        alt: "Legacy Doc - documentação de código legado com IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description:
      "IA para analisar repositórios legados e gerar documentação técnica estruturada.",
    images: ["/og/legacy-doc.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/*
          Pixel StayView — rastreamento de visitas.
          Fica no <head> conforme a instalação indicada pelo painel. `defer`
          garante que não bloqueie a renderização.

          ATENÇÃO: coleta dados de navegação de visitantes. A política de
          privacidade em /privacidade descreve esse tratamento — as duas
          coisas precisam ser mantidas em sincronia. Remover o pixel implica
          atualizar a política também.
        */}
        <script defer src="https://stayview.com.br/pixel/Bw0WsB3lKF1rbzlb" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
