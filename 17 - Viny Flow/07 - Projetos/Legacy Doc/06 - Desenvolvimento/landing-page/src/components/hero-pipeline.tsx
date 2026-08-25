import { Check, FileCode2, FolderTree, Loader2, ScanLine } from "lucide-react";

/**
 * Painel de análise do hero.
 *
 * Mostra a esteira real do produto: repositório → varredura → funções
 * detectadas → estrutura → documentação. É Server Component: a animação de
 * entrada é CSS puro com `animation-delay` escalonado, sem JavaScript e sem
 * custo de hidratação. O bloco global de `prefers-reduced-motion` já reduz a
 * duração para 1ms, e como todas usam `animation-fill-mode: both`, o estado
 * final aparece direto para quem pediu menos movimento.
 *
 * Todo o conteúdo é decorativo: a descrição textual equivalente fica no
 * `aria-label` do container, e o miolo é `aria-hidden`.
 */

const files = [
  { path: "src/main.cpp", state: "done" },
  { path: "src/calc.cpp", state: "scanning" },
  { path: "include/calc.h", state: "queued" },
  { path: "src/invoice.cpp", state: "queued" },
  { path: "tests/soma.test", state: "queued" },
] as const;

const steps = [
  { label: "Varredura", detail: "5 arquivos", icon: FolderTree, state: "done" },
  { label: "Funções detectadas", detail: "12 funções", icon: ScanLine, state: "done" },
  { label: "Estrutura identificada", detail: "3 módulos", icon: FileCode2, state: "running" },
  { label: "Documentação gerada", detail: "aguardando", icon: Check, state: "queued" },
] as const;

const detectedFunctions = [
  { signature: "somar(num1, num2)", type: "double" },
  { signature: "subtrair(num1, num2)", type: "double" },
  { signature: "validarEntrada(payload)", type: "bool" },
];

export function HeroPipeline() {
  return (
    <div
      className="hero-panel"
      role="img"
      aria-label="Painel do Legacy Doc analisando um repositório: os arquivos são varridos, as funções são detectadas, a estrutura é identificada e a documentação técnica é gerada para revisão."
    >
      <div className="hp-urlbar" aria-hidden="true">
        <span className="hp-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="hp-url">github.com/equipe/sistema-legado</span>
        <span className="hp-run">Analisar</span>
      </div>

      <ol className="hp-track" aria-hidden="true">
        {steps.map((step, index) => (
          <li
            key={step.label}
            className={`hp-step is-${step.state}`}
            style={{ animationDelay: `${140 + index * 130}ms` }}
          >
            <span className="hp-step-icon">
              {step.state === "running" ? (
                <Loader2 size={14} className="hp-spin" />
              ) : (
                <step.icon size={14} />
              )}
            </span>
            <span className="hp-step-text">
              <strong>{step.label}</strong>
              <em>{step.detail}</em>
            </span>
            <span className="hp-step-bar">
              <i style={{ animationDelay: `${200 + index * 130}ms` }} />
            </span>
          </li>
        ))}
      </ol>

      <div className="hp-body" aria-hidden="true">
        <div className="hp-col hp-col-files">
          <p className="hp-col-title">Arquivos</p>
          <ul className="hp-files">
            {files.map((file, index) => (
              <li
                key={file.path}
                className={`is-${file.state}`}
                style={{ animationDelay: `${320 + index * 70}ms` }}
              >
                <span className="hp-file-dot" />
                {file.path}
              </li>
            ))}
          </ul>
        </div>

        <div className="hp-col hp-col-code">
          <p className="hp-col-title">Análise</p>
          <pre className="hp-code">
            <code>{`double somar(double num1, double num2) {
  return num1 + num2;
}`}</code>
            <span className="hp-scan" />
          </pre>
          <ul className="hp-functions">
            {detectedFunctions.map((fn, index) => (
              <li key={fn.signature} style={{ animationDelay: `${640 + index * 110}ms` }}>
                <code>{fn.signature}</code>
                <span>{fn.type}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="hp-col hp-col-doc">
          <p className="hp-col-title">Documentação gerada</p>
          <div className="hp-doc">
            <p className="hp-doc-title">Função: somar</p>
            <dl>
              <div>
                <dt>Parâmetros</dt>
                <dd>num1, num2</dd>
              </div>
              <div>
                <dt>Retorno</dt>
                <dd>double</dd>
              </div>
              <div>
                <dt>Descrição</dt>
                <dd>Recebe dois valores e retorna o resultado da soma.</dd>
              </div>
            </dl>
            <p className="hp-doc-source">Evidência: src/main.cpp:14</p>
          </div>
          <p className="hp-doc-review">Revisão da equipe técnica pendente</p>
        </div>
      </div>
    </div>
  );
}
