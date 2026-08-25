import { faq, site } from "@/lib/landing-content";

export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Legacy Doc",
    applicationCategory: "DeveloperApplication",
    description:
      "IA para analisar repositórios legados ou pouco documentados e gerar documentação técnica estruturada.",
    url: `${site.pendingDomain}${site.slug}`,
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function jsonLd(value: unknown) {
  return { __html: JSON.stringify(value).replace(/</g, "\\u003c") };
}
