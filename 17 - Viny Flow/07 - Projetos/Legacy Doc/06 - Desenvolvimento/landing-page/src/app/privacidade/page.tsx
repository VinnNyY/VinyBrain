import type { Metadata } from "next";

import { Header } from "@/components/header";
import { Container } from "@/components/ui";
import { site } from "@/lib/landing-content";

export const metadata: Metadata = {
  title: "Política de privacidade | Legacy Doc",
  description:
    "Como o Legacy Doc trata os dados informados na lista de espera: finalidade, base legal, retenção e direitos do titular.",
  robots: { index: false, follow: false },
};

export default function PrivacidadePage() {
  return (
    <>
      <Header linkPrefix={site.slug} />
      <main id="conteudo" className="legal-page">
        <Container>
          <p className="eyebrow">Documento em revisão</p>
          <h1>Política de privacidade</h1>
          <p className="legal-lead">
            Este documento descreve como tratamos os dados informados na lista de espera do
            Legacy Doc. É um rascunho técnico preparado pela equipe do produto e ainda não
            passou por revisão jurídica.
          </p>

          <section>
            <h2>Quais dados coletamos</h2>
            <p>
              Pedimos o mínimo necessário. Na lista de espera coletamos apenas:
            </p>
            <ul>
              <li>
                <strong>E-mail</strong> — único campo obrigatório, usado para avisar você.
              </li>
              <li>
                <strong>Linguagem principal e tamanho da base de código</strong> —
                opcionais, usados só para priorizar o que construímos primeiro.
              </li>
            </ul>
            <p>
              Não pedimos nome, empresa nem cargo. Não coletamos código-fonte, credenciais,
              tokens de acesso a repositórios nem dados de pagamento.
            </p>
            <p>
              Para conter envios automatizados, registramos temporariamente uma{" "}
              <strong>versão embaralhada do seu endereço IP</strong>, que não permite
              identificar você e é descartada em até uma hora. O IP em si nunca é
              armazenado.
            </p>
          </section>

          <section>
            <h2>Para que usamos</h2>
            <ul>
              <li>Avisar quando o acesso antecipado for aberto.</li>
              <li>Enviar atualizações sobre o desenvolvimento do produto.</li>
              <li>
                Entender o perfil de quem tem interesse, para priorizar o que construir
                primeiro.
              </li>
            </ul>
            <p>
              Não usamos os dados do formulário para publicidade e não os vendemos nem
              alugamos. Eles não são compartilhados com terceiros, salvo o provedor de
              infraestrutura descrito adiante.
            </p>
          </section>

          <section>
            <h2>Medição de audiência</h2>
            <p>
              Usamos o <strong>StayView</strong> para entender como as pessoas chegam e
              navegam nesta página. Essa ferramenta é carregada em todas as páginas e
              registra dados de navegação, como páginas visitadas, origem do acesso e
              informações técnicas do navegador.
            </p>
            <p>
              Essa medição é separada da lista de espera: ela não recebe o e-mail nem os
              demais campos que você informa no formulário.
            </p>
            <p className="legal-pending">
              Política de privacidade e período de retenção do provedor de medição ainda
              precisam ser verificados e descritos aqui.
            </p>
          </section>

          <section>
            <h2>Base legal</h2>
            <p>
              O tratamento se apoia no consentimento do titular, manifestado ao enviar o
              formulário, conforme o artigo 7º, inciso I, da Lei nº 13.709/2018 (LGPD). O
              consentimento pode ser retirado a qualquer momento.
            </p>
          </section>

          <section>
            <h2>Por quanto tempo guardamos</h2>
            <p>
              Mantemos os dados enquanto a lista de espera estiver ativa ou até você pedir a
              exclusão. Se o produto for descontinuado, os registros são apagados.
            </p>
          </section>

          <section>
            <h2>Onde os dados ficam</h2>
            <p>
              Os registros ficam em um banco de dados operado pela equipe do Legacy Doc na
              infraestrutura da Cloudflare. O acesso é restrito à equipe e protegido por
              credencial. Caso troquemos de provedor, este documento será atualizado antes
              da mudança entrar em vigor.
            </p>
          </section>

          <section>
            <h2>Seus direitos</h2>
            <p>
              A LGPD garante a você, entre outros direitos, confirmar a existência de
              tratamento, acessar seus dados, corrigi-los, solicitar a exclusão e revogar o
              consentimento. Para exercer qualquer um deles, entre em contato com a equipe.
            </p>
          </section>

          <section>
            <h2>Contato</h2>
            <p className="legal-pending">
              Canal de contato para exercício de direitos ainda não definido. Este campo
              precisa ser preenchido antes de qualquer publicação da página.
            </p>
          </section>

          <p className="legal-updated">Última atualização: 21 de agosto de 2026.</p>
        </Container>
      </main>
    </>
  );
}
