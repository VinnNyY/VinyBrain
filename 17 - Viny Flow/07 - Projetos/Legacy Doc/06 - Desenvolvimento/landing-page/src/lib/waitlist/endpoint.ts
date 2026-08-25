/**
 * Endpoint da lista de espera consumido pelo navegador.
 *
 * A landing é publicada como site estático na StayCloud, que não executa
 * código no servidor. Por isso a API vive em outro provedor e o endereço entra
 * em tempo de build por `NEXT_PUBLIC_WAITLIST_API`.
 *
 * Em desenvolvimento, sem a variável definida, cai no Route Handler local
 * (`/api/waitlist`), que continua funcionando em `next dev`.
 *
 * Se a variável estiver vazia E o build for estático, não existe endpoint: a
 * seção então esconde o formulário e informa isso, em vez de exibir um campo
 * que descartaria a inscrição em silêncio.
 */

const configured = process.env.NEXT_PUBLIC_WAITLIST_API?.trim();
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

/** URL da API, ou `null` quando não há endpoint utilizável. */
export const waitlistEndpoint: string | null = configured
  ? configured
  : isStaticExport
    ? null
    : "/api/waitlist";
