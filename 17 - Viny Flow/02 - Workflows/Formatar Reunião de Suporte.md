# Formatar Reunião de Suporte

## 1. Objetivo

Transformar transcricoes e anotacoes brutas de `Daily Suporte` e `Weekly Suporte` em ata formal, clara, consistente e pronta para envio a coordenacao.

## 2. Quando usar

Use quando houver uma anotacao solta, uma transcricao baguncada ou um rascunho de reuniao do suporte que precise virar documento formal com opcao de PDF.

## 3. Entrada esperada

- transcricao bruta;
- tipo da reuniao, se ja estiver claro;
- data, se ja estiver clara;
- participantes, se existirem;
- indicacao de necessidade de PDF;
- observacoes adicionais.

## 4. Saida esperada

- Markdown final pronto para arquivo;
- versão preliminar em revisão, quando necessária;
- PDF final validado;
- registros de `A definir` onde faltar responsável ou prazo;
- lista de `Pontos a confirmar` quando houver duvida.

## 5. Estrutura de pastas

- `19 - Reuniões/04 - Transcrições Originais/`: conteúdo bruto, preservado sem substituição;
- `19 - Reuniões/01 - Em Revisão/`: HTML, Markdown preliminar e materiais em conferência;
- `19 - Reuniões/02 - Reuniões Formatadas/Dailies/`: Markdown final de Dailies;
- `19 - Reuniões/02 - Reuniões Formatadas/Weeklies/`: Markdown final de Weeklies;
- `19 - Reuniões/03 - PDFs/Dailies/`: PDF final de Dailies;
- `19 - Reuniões/03 - PDFs/Weeklies/`: PDF final de Weeklies;
- `19 - Reuniões/05 - Modelos/`: modelos, checklist e padrão de formatação.

## 6. Como identificar Daily ou Weekly

1. Ler o texto bruto procurando marcadores diretos, como `daily`, `weekly`, `fechamento semanal`, `reuniao diaria` ou contexto equivalente.
2. Se o tipo estiver expresso, usar o tipo informado.
3. Se houver ambiguidade, perguntar antes de gerar o documento final.
4. Se o texto indicar rotina diaria, classificar como `Daily Suporte`.
5. Se o texto indicar consolidacao da semana, classificar como `Weekly Suporte`.

## 7. Como transformar texto bruto em ata formal

1. Remover ruído, repeticoes e gírias.
2. Organizar a fala em: informações da reunião, resumo executivo, atualizações da equipe, assuntos discutidos, decisões, plano de ação, riscos e bloqueios, acompanhamento e observações.
3. Converter frases soltas em parágrafos formais.
4. Separar resumo, contexto, discussões, pendências, bloqueios, decisões e ações.
5. Preservar o sentido original.
6. Registrar apenas o que estiver suportado pela transcricao.
7. Usar `A definir` para responsável ou prazo não informados e registrar demais lacunas em observações ou pontos para acompanhamento.

## 8. Como gerar PDF

1. Salvar a transcrição bruta em `19 - Reuniões/04 - Transcrições Originais/`.
2. Criar a primeira versão em `19 - Reuniões/01 - Em Revisão/`.
3. Gerar o Markdown final na subpasta de Daily ou Weekly.
4. Gerar o PDF correspondente na subpasta de Daily ou Weekly.
5. Validar abertura, existência e correspondência do PDF antes de marcar a reunião como concluída.
6. Se necessário para a revisão, gerar HTML em `19 - Reuniões/01 - Em Revisão/`.
7. Verificar ferramentas locais disponiveis nesta ordem:
   - `google-chrome`
   - `chromium`
   - `wkhtmltopdf`
   - `pandoc`
   - `libreoffice`
8. Se `google-chrome` estiver disponivel, usar modo headless para imprimir o HTML em PDF.
9. Se `google-chrome` nao estiver disponivel, testar as alternativas na ordem acima.
10. Se nenhuma ferramenta estiver disponivel, manter o material em revisão e registrar que o PDF ainda não foi validado.
11. Nao instalar dependencias automaticamente sem autorizacao.

### Comando base de referencia

```bash
google-chrome --headless --disable-gpu --print-to-pdf="CAMINHO-SAIDA.pdf" "file://CAMINHO-HTML.html"
```

## 9. Como validar se nao inventou informacao

1. Conferir se cada responsavel citado apareceu na transcricao.
2. Conferir se cada prazo apareceu na transcricao.
3. Conferir se cada decisao foi de fato declarada.
4. Conferir se opinioes nao foram transformadas em fatos.
5. Conferir se nomes, datas e numeros nao foram completados por inferencia.
6. Se houver qualquer duvida, mover para `Pontos a confirmar`.

## 10. Como lidar com gírias

- trocar por linguagem formal;
- manter a ideia original;
- nao exagerar na reescrita;
- nao mudar tom, prioridade ou gravidade do que foi dito.

## 11. Como registrar pontos a confirmar

Usar `Pontos a confirmar` para:

- data incompleta;
- tipo de reuniao ambíguo;
- participante nao identificado;
- responsavel ausente;
- prazo ausente;
- decisao ambígua;
- trecho que possa ter mais de uma interpretacao.

## 12. Como nomear o arquivo final

### Markdown final

- `Daily - Suporte - YYYY-MM-DD.md`
- `Weekly - Suporte - YYYY-MM-DD.md`

Para duas reuniões do mesmo tipo na mesma data, usar `Daily - Suporte - YYYY-MM-DD - HH-MM.md` ou `Weekly - Suporte - YYYY-MM-DD - HH-MM.md`.

### HTML de revisao

- `Daily - Suporte - YYYY-MM-DD.html`
- `Weekly - Suporte - YYYY-MM-DD.html`

### PDF final

- `Daily - Suporte - YYYY-MM-DD.pdf`
- `Weekly - Suporte - YYYY-MM-DD.pdf`

Para duas reuniões do mesmo tipo na mesma data, acrescentar ` - HH-MM` antes da extensão. Não usar barras no nome.

## 13. Critério de saida

A tarefa so fecha quando:

- o tipo da reuniao foi identificado;
- a data foi identificada;
- a versao formal foi gerada;
- o conteúdo bruto foi preservado;
- o Markdown final e o PDF existem nos caminhos corretos;
- o PDF abre corretamente;
- o conteúdo foi revisado;
- nao houve invenção de informacao.

## 14. Status do fluxo

O fluxo foi testado com `Daily Suporte` e `Weekly Suporte` e está aprovado para uso real.
