import type { NextConfig } from "next";

/**
 * A landing é publicada como site estático no Deploy StayCloud, que serve
 * arquivos e não executa código no servidor — o CLI reporta "artefato estático
 * pronto". Por isso o build de publicação usa `output: "export"`.
 *
 * Consequências assumidas:
 *
 * - Route Handlers não existem no artefato estático. A API da lista de espera
 *   roda em outro provedor e o endereço entra por `NEXT_PUBLIC_WAITLIST_API`.
 * - O handler local `src/app/api/waitlist/route.local.ts` só é reconhecido
 *   como rota quando `pageExtensions` inclui `local.ts`, o que acontece apenas
 *   fora do export. Assim ele continua servindo o desenvolvimento sem entrar
 *   no build publicado nem quebrá-lo.
 * - `next/image` perde a otimização sob demanda, então `unoptimized` é
 *   obrigatório no export.
 *
 * Publicação:  STATIC_EXPORT=true npm run build   → gera `out/`
 * Desenvolvimento: npm run dev                    → API local disponível
 */
const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = isStaticExport
  ? {
      output: "export",
      /**
       * Sem isto o export gera `pagina.html` solto. O servidor estático da
       * StayCloud redireciona `/pagina` para `/pagina/` e procura
       * `pagina/index.html`, devolvendo 403. Com `trailingSlash`, cada rota
       * vira um diretório com `index.html` e o redirecionamento resolve.
       */
      trailingSlash: true,
      images: { unoptimized: true },
      env: { NEXT_PUBLIC_STATIC_EXPORT: "true" },
    }
  : {
      pageExtensions: ["ts", "tsx", "js", "jsx", "local.ts"],
    };

export default nextConfig;
