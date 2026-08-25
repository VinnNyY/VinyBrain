"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Terminal, TriangleAlert } from "lucide-react";

import { WAITLIST_GOAL } from "@/lib/mvp-config";
import { waitlistEndpoint } from "@/lib/waitlist/endpoint";
import { Container } from "@/components/ui";

type FormState = "idle" | "submitting" | "success" | "duplicate" | "error";

/** Contagem real vinda da API. `null` = sem fonte de dados: o contador some. */
type CountState = { value: number | null; loaded: boolean };

const codebaseSizes = [
  "Menos de 10 mil linhas",
  "10 mil a 100 mil linhas",
  "100 mil a 1 milhão de linhas",
  "Mais de 1 milhão de linhas",
];

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Anima a contagem até `target` quando `active` vira true.
 *
 * Não é loop: cada mudança de `target` dispara uma transição única, partindo do
 * valor já exibido. Isso cobre os dois momentos reais — a entrada na viewport
 * (0 → contagem atual) e a própria inscrição do visitante (n → n+1).
 * Com `prefers-reduced-motion`, salta direto para o valor final.
 */
function useCountUp(target: number | null, active: boolean): number {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    if (target === null || !active || fromRef.current === target) return;

    const from = fromRef.current;

    // Salto direto, mas em callback de frame: setState síncrono dentro do
    // efeito dispara renders em cascata (react-hooks/set-state-in-effect).
    if (prefersReducedMotion() || target === 0) {
      fromRef.current = target;
      const jump = requestAnimationFrame(() => setDisplay(target));
      return () => cancelAnimationFrame(jump);
    }

    const duration = 900;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutCubic: desacelera no fim, leitura mais confortável
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (target - from) * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active]);

  return display;
}

export function WaitlistSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const [count, setCount] = useState<CountState>({ value: null, loaded: false });
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [email, setEmail] = useState("");

  // Dispara a animação quando a seção entra na viewport (uma vez só).
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    // Navegador sem IntersectionObserver: mostra o estado final sem observar.
    if (typeof IntersectionObserver === "undefined") {
      const fallback = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(fallback);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Busca a contagem real. Falhou? `value` fica null e o contador não aparece —
  // nunca exibimos número estimado. setState só acontece em callback da promise.
  useEffect(() => {
    if (!waitlistEndpoint) return;
    const controller = new AbortController();

    fetch(waitlistEndpoint, { cache: "no-store", signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { count: number | null } | null) => {
        setCount({
          value: typeof data?.count === "number" ? data.count : null,
          loaded: true,
        });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setCount({ value: null, loaded: true });
      });

    return () => controller.abort();
  }, []);

  const displayCount = useCountUp(count.value, inView && count.loaded);
  // Barra e contagem só entram a partir do primeiro inscrito: uma barra vazia
  // enfraquece justamente a seção que precisa ter mais energia.
  const hasCounter = count.loaded && count.value !== null && count.value > 0;
  const percent = hasCounter
    ? Math.min(Math.round(((count.value as number) / WAITLIST_GOAL) * 100), 100)
    : 0;
  const barPercent = inView ? percent : 0;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (formState === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const emailValue = String(data.get("email") ?? "").trim();

    if (!emailValue) {
      setFormState("error");
      setErrorMessage("Informe seu e-mail para entrar na lista.");
      return;
    }

    setFormState("submitting");
    setErrorMessage("");

    try {
      const response = await fetch(waitlistEndpoint as string, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailValue,
          codebaseSize: data.get("codebaseSize"),
          language: data.get("language"),
          website: data.get("website"),
        }),
      });

      if (response.status === 422) {
        setFormState("error");
        setErrorMessage("Esse e-mail não parece válido. Confira e tente de novo.");
        return;
      }

      if (response.status === 429) {
        setFormState("error");
        setErrorMessage("Muitas tentativas deste dispositivo. Tente novamente mais tarde.");
        return;
      }

      if (!response.ok && response.status !== 200) {
        setFormState("error");
        setErrorMessage(
          "Não conseguimos registrar sua inscrição agora. Tente novamente em instantes.",
        );
        return;
      }

      const result = (await response.json()) as { status: string; count: number };
      setCount({ value: result.count, loaded: true });
      setFormState(result.status === "duplicate" ? "duplicate" : "success");
      if (result.status === "created") form.reset();
      setEmail("");
    } catch {
      setFormState("error");
      setErrorMessage(
        "Não conseguimos registrar sua inscrição agora. Tente novamente em instantes.",
      );
    }
  }

  const isSubmitting = formState === "submitting";
  const isDone = formState === "success" || formState === "duplicate";

  return (
    <section id="lista-de-espera" ref={sectionRef} className="waitlist-section scroll-mt-24">
      <Container>
        <div className="waitlist-grid">
          <div className="waitlist-goal">
            <p className="eyebrow">Lista de espera</p>
            <h2 className="waitlist-title">
              Para o Legacy Doc sair do papel, precisamos de{" "}
              <span className="waitlist-goal-number">{WAITLIST_GOAL}</span> inscrições.
            </h2>
            <p className="waitlist-lead">
              O produto está em desenvolvimento e a lista de espera define a prioridade do
              que construímos primeiro. Inscreva-se e faça parte disso.
            </p>

            <div className="waitlist-terminal" role="group" aria-label="Progresso da meta">
              <div className="waitlist-terminal-bar" aria-hidden="true">
                <Terminal size={14} />
                <span>legacy-doc — build da lista de espera</span>
              </div>

              <div className="waitlist-terminal-body">
                {hasCounter ? (
                  <p className="waitlist-count">
                    <span className="waitlist-count-value">{displayCount}</span>
                    <span className="waitlist-count-total">de {WAITLIST_GOAL} inscritos</span>
                  </p>
                ) : (
                  <p className="waitlist-count">
                    <span className="waitlist-count-value">{WAITLIST_GOAL}</span>
                    <span className="waitlist-count-total">inscrições é a meta</span>
                  </p>
                )}

                {hasCounter ? (
                  <div
                    className="waitlist-progress"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={WAITLIST_GOAL}
                    aria-valuenow={count.value as number}
                    aria-valuetext={`${count.value} de ${WAITLIST_GOAL} inscrições`}
                  >
                    <span className="waitlist-progress-fill" style={{ width: `${barPercent}%` }} />
                  </div>
                ) : (
                  <p className="waitlist-no-data">
                    A contagem de inscritos aparece aqui assim que houver registros.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="waitlist-form-shell">
            {!waitlistEndpoint ? (
              /* Sem endpoint configurado não existe para onde enviar. Mostrar um
                 formulário aqui faria a inscrição sumir em silêncio. */
              <div className="waitlist-unavailable" role="status">
                <span className="waitlist-unavailable-icon" aria-hidden="true">
                  <TriangleAlert size={20} />
                </span>
                <h3>As inscrições abrem em instantes</h3>
                <p>
                  Estamos finalizando o canal de cadastro. Volte em breve para entrar na
                  lista de espera do Legacy Doc.
                </p>
              </div>
            ) : isDone ? (
              <div className="waitlist-success" role="status">
                <span className="waitlist-success-icon" aria-hidden="true">
                  <Check size={22} />
                </span>
                <h3>
                  {formState === "duplicate"
                    ? "Você já está na lista."
                    : "Pronto. Você está dentro."}
                </h3>
                <p>
                  {formState === "duplicate"
                    ? "Esse e-mail já estava registrado. Continua valendo o acesso antecipado quando abrirmos."
                    : "Você entra no grupo que vai testar o Legacy Doc antes de todo mundo e ajudar a decidir o que construímos primeiro."}
                </p>
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={() => setFormState("idle")}
                >
                  Inscrever outro e-mail
                </button>
              </div>
            ) : (
              <form className="waitlist-form" onSubmit={handleSubmit} noValidate>
                <div className="waitlist-field">
                  <label htmlFor="waitlist-email">
                    E-mail <span className="waitlist-required">*</span>
                  </label>
                  <input
                    id="waitlist-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (formState === "error") setFormState("idle");
                    }}
                    aria-describedby={
                      formState === "error" ? "waitlist-error" : "waitlist-privacy"
                    }
                    aria-invalid={formState === "error"}
                    placeholder="voce@empresa.com"
                  />
                </div>

                <div className="waitlist-field-row">
                  <div className="waitlist-field">
                    <label htmlFor="waitlist-language">Linguagem principal (opcional)</label>
                    <input
                      id="waitlist-language"
                      name="language"
                      type="text"
                      maxLength={40}
                      placeholder="TypeScript, Java, C#..."
                    />
                  </div>
                  <div className="waitlist-field">
                    <label htmlFor="waitlist-codebase">Tamanho da base (opcional)</label>
                    <select id="waitlist-codebase" name="codebaseSize" defaultValue="">
                      <option value="">Prefiro não informar</option>
                      {codebaseSizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Honeypot: invisível e fora da ordem de tabulação. Pessoa
                    nenhuma preenche; bot que preencher é descartado no worker. */}
                <div className="waitlist-hp" aria-hidden="true">
                  <label htmlFor="waitlist-website">Não preencha este campo</label>
                  <input
                    id="waitlist-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {formState === "error" ? (
                  <p className="waitlist-error" id="waitlist-error" role="alert">
                    <TriangleAlert size={16} aria-hidden="true" />
                    {errorMessage}
                  </p>
                ) : null}

                <button type="submit" className="button button-primary waitlist-submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 size={17} className="waitlist-spinner" aria-hidden="true" />
                      Registrando…
                    </>
                  ) : (
                    "Entrar na lista de espera"
                  )}
                </button>

                <p className="waitlist-privacy" id="waitlist-privacy">
                  Ao entrar na lista você recebe acesso antecipado quando abrirmos, atualizações
                  do desenvolvimento e espaço para influenciar as prioridades do produto. Pedimos o mínimo: só o
                  e-mail é obrigatório e não repassamos seus dados a terceiros. Veja a{" "}
                  <a href="/privacidade">política de privacidade</a>.
                </p>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
