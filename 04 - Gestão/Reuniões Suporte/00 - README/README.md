# Reuniões Suporte

Esta area serve para transformar anotacoes e transcricoes brutas de reunioes `Daily Suporte` e `Weekly Suporte` em documentos formais, claros e prontos para envio a coordenacao.

## Para que serve

- centralizar entradas brutas de reunioes do suporte;
- organizar o material antes da revisao final;
- manter um padrao unico de ata para Daily e Weekly;
- gerar a versao final em Markdown e PDF;
- evitar perdas de contexto, exageros e invenções de informacao.

## Estrutura da area

- `01 - Entradas Brutas/`: transcricoes, notas soltas e rascunhos originais;
- `02 - Em Revisão/`: HTML de revisao e materiais em conferência;
- `03 - Reuniões Concluídas/`: Markdown final aprovado;
- `04 - PDFs/`: PDF final pronto para envio;
- `05 - Templates/`: templates, guia e instrucoes de formalizacao;
- `06 - Validações/`: validacoes, checklists e evidencias de conferencia.

## Como salvar uma transcricao bruta

1. Salve o texto exatamente como foi anotado ou transcrito em `01 - Entradas Brutas/`.
2. Nao tente formalizar antes de guardar a versao original.
3. Se houver mais de uma reuniao no mesmo dia, use um nome descritivo no arquivo bruto para manter a separacao.
4. Preserve abreviacoes, gírias e trechos truncados no bruto; a formalizacao acontece depois.

## Como o Codex deve processar

1. Ler a transcricao bruta sem alterar o sentido.
2. Identificar se a reuniao e `Daily Suporte` ou `Weekly Suporte`.
3. Identificar a data.
4. Identificar participantes, se houver.
5. Formalizar o texto, removendo gírias e organizando as ideias.
6. Separar resumo, fatos, decisões, pendências, bloqueios e acoes.
7. Marcar como `Não informado` tudo o que não estiver presente.
8. Registrar duvidas em `Pontos a confirmar`.
9. Gerar o Markdown final em `03 - Reuniões Concluídas/`.
10. Gerar HTML de revisao em `02 - Em Revisão/`.
11. Gerar PDF final em `04 - PDFs/` quando houver ferramenta local disponivel, com prioridade para `google-chrome` em modo headless.

## Onde ficam os documentos

- Markdown final: `03 - Reuniões Concluídas/`
- HTML de revisao: `02 - Em Revisão/`
- PDF final: `04 - PDFs/`
- Fontes brutas: `01 - Entradas Brutas/`

## Padrao de nomes

### Markdown concluido

- `Daily Suporte - YYYY-MM-DD.md`
- `Weekly Suporte - YYYY-MM-DD.md`

### PDF

- `Daily Suporte - YYYY-MM-DD.pdf`
- `Weekly Suporte - YYYY-MM-DD.pdf`

## PDF padrão neste ambiente

Neste ambiente, o conversor PDF padrão disponível é `google-chrome` em modo headless.

### Fluxo recomendado

1. Gerar o Markdown formal.
2. Gerar o HTML de revisão.
3. Revisar visualmente o HTML.
4. Converter o HTML para PDF com `google-chrome` headless.
5. Salvar o PDF em `04 - PDFs/`.

### Comando base de referência

```bash
google-chrome --headless --disable-gpu --print-to-pdf="CAMINHO-SAIDA.pdf" "file://CAMINHO-HTML.html"
```

### Validação após gerar PDF

- confirmar se o PDF existe;
- confirmar o caminho completo;
- confirmar o tamanho do arquivo;
- confirmar que o Markdown e o HTML não foram alterados sem necessidade.

### Alternativas se o Chrome não estiver disponível

- `wkhtmltopdf`
- `pandoc`
- `chromium`
- `libreoffice`

## Fluxo validado

O fluxo de `Daily Suporte` e `Weekly Suporte` foi testado e aprovado para uso real.

Saídas validadas:

- Markdown formal em `03 - Reuniões Concluídas/`;
- HTML de revisão em `02 - Em Revisão/`;
- PDF final em `04 - PDFs/`.

Status:

- `Fluxo aprovado para uso real.`

### Titulo visivel do documento

- `Daily Suporte - DD/MM/YYYY`
- `Weekly Suporte - DD/MM/YYYY`

## Regras de formalizacao

- trocar linguagem informal por linguagem formal;
- remover gírias sem mudar o sentido;
- transformar frases soltas em texto coerente;
- manter fidelidade ao que foi dito;
- separar fatos, decisões, pendências e ações;
- usar `Não informado` quando faltar dado;
- usar `Pontos a confirmar` quando houver ambiguidade;
- nao atribuir responsavel, prazo ou decisao sem base na transcricao;
- nao adicionar conclusoes que nao tenham sido ditas;
- nao suavizar ou endurecer o conteudo a ponto de mudar o significado.

## Cuidados para nao inventar informacao

- nao inferir nome, prazo, numero ou decisao sem evidencia;
- nao preencher lacunas com suposicoes;
- nao transformar opiniao em fato;
- nao criar responsavel por deducao;
- nao criar prazo por estimativa;
- nao criar motivo que nao tenha sido mencionado;
- se houver conflito de trechos, registrar a divergencia em `Pontos a confirmar`.

## Critério de entrega

O material so deve ser considerado pronto quando:

- a data estiver identificada;
- o tipo da reuniao estiver identificado;
- o texto estiver formal e coerente;
- as pendencias estiverem claras;
- as acoes estiverem listadas;
- os dados ausentes estiverem marcados como `Não informado`;
- o arquivo final estiver salvo no local correto;
- o PDF tiver sido gerado ou, se nao houver ferramenta local, o limite tecnico tiver sido registrado.
