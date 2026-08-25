import type { Metadata } from "next";
import { Suspense } from "react";

import { CheckoutContent } from "./checkout-content";

export const metadata: Metadata = {
  title: "Plano selecionado",
  description: "Resumo do plano previsto para o Legacy Doc.",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * `useSearchParams` exige um limite de Suspense para que a rota possa ser
 * pré-renderizada estaticamente. Sem isso o export estático falha.
 */
export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  );
}
