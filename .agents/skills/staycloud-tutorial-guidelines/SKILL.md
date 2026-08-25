---
name: staycloud-tutorial-guidelines
description: Create, review, and audit StayCloud tutorials with the project pattern for text, structure, visuals, and safety. Use when working on StayCloud help articles, execution-real drafts, print audits, or WordPress-ready tutorial preparation.
metadata:
  author: codex
  version: "1.0.0"
  argument-hint: <file-or-pattern>
---

# StayCloud Tutorial Guidelines

Use this skill to create, review, and audit StayCloud tutorials in the `Viny Brain` pattern.

## When to use

Use this skill when the task involves:

- creating a new StayCloud tutorial
- revising an existing StayCloud tutorial
- auditing tutorial prints or layout
- checking whether a tutorial is ready for WordPress
- validating that the tutorial follows the local StayCloud workflow

## Goal

Keep StayCloud tutorials clear, safe, and publishable by enforcing the local standard for writing, structure, prints, and review.

## Safety rules

- Do not expose credentials, tokens, cookies, passwords, or client data
- Do not save credentials in the vault, checklist, report, or skill notes
- Do not publish anything without explicit confirmation
- Do not use real client data in prints or examples
- Do not treat placeholder content as final content
- Stop if a print, note, or draft could reveal sensitive information

## Writing rules

- Use clear, direct, human language
- Keep the tone professional and natural
- Write one action per step
- Focus on what the client needs to do
- Avoid generic filler and robotic phrasing
- Keep bot names, menu names, and button names consistent with the interface

## Structure rules

Every tutorial should follow this order when the topic allows it:

1. Title
2. Short introduction
3. Objective
4. Prerequisites
5. Numbered steps
6. Real prints
7. Expected result
8. Common errors or doubts when relevant
9. Final closing

If the topic needs FAQ or notes, add them only when they help the reader.

## Official V2 delivery

Create new Painel Novo tutorials inside:

`03 - Tutoriais/Produção em Lote/Painel Novo/Tutoriais Corretos V2/`

Every final package must include:

- `01 - VISUALIZAR TUTORIAL.html`
- `02 - COLAR NO WORDPRESS.txt`
- `03 - SEO RANK MATH.txt`
- `04 - VALIDAÇÃO FINAL.md`
- `prints-finais/`
- `apoio/`

The WordPress TXT must contain the complete article HTML, start with exactly one H1, and use only allowed article tags. It must not contain CSS, scripts, iframe, Rank Math data, Markdown syntax, local paths, placeholders, or internal instructions.

Markdown is internal documentation only. TXT is the primary publication delivery. Images must already use direct public URLs, and the client must never need to insert prints manually. Old or redundant files belong in `apoio/estrutura-anterior/`, not in the tutorial root.

## SEO / Rank Math

Every StayCloud tutorial must include a validation section with:

- main keyword
- suggested SEO title
- slug
- meta description
- Rank Math criteria

Rules:

- target a Rank Math score above 80
- keep the main keyword in the SEO title, meta description, slug, first paragraph, body, excerpt, and social text when natural
- add the main keyword to at least one H2, one H3 when natural, and one image ALT
- write the article body with Rank Math in mind; SEO is not only a separate metadata file
- target at least 600 words, preferably 650 to 900 words
- include at least two useful internal links from known existing StayCloud help articles
- make the meta description clear, benefit-driven, and keyword-aware
- keep density natural and avoid keyword stuffing
- treat the final validation summary as incomplete until the meta description is defined
- when WordPress Rank Math is not checked directly, mark the status as `SEO preparado localmente — aguardando conferência no Rank Math`

If the SEO validation is missing, the tutorial is not ready.

## Visual rules

- Use wide prints with enough context
- Avoid excessive zoom
- Keep the user oriented in the interface
- Blur only sensitive data
- Do not blur half the screen
- Mark the main action clearly
- Keep captions short and useful
- Make each print support a single main action
- A visual marker is approved only when it points exactly to the element cited in the step text and the next step confirms the same flow
- Nearby buttons, banners, alerts, invoices, or alternative actions must not be highlighted just because they are visible
- If a corrected local image does not yet match the public WordPress URL, the tutorial is blocked until upload and URL update

## Cache and recapture

If a print becomes stuck, cached, wrong, or keeps appearing old:

- you may delete the local image only inside the active tutorial directory
- do not delete images outside the current tutorial directory
- do not delete images already published to WordPress without explicit confirmation
- recapture the image after deletion
- prefer a versioned filename like `passo-04-dados-acesso-v2.webp` or `passo-04-dados-acesso-recaptura.webp`
- update all HTML and Markdown references
- confirm the old image is no longer referenced
- run the visual audit again
- record the removal and recapture in the report

## Reproval criteria

Reject the tutorial if any of these happen:

- placeholder content remains in the final draft
- a print is cropped too tightly
- a print is zoomed in too much
- blur hides useful context
- the main focus is not clearly marked
- there is no real image
- the HTML was not reviewed
- the tutorial does not match the StayCloud pattern

## Checklist before considering it ready

- The flow was validated in the real interface
- The SEO validation is complete
- The main keyword is present in the title, introduction, slug, meta description, and a heading when natural
- The suggested SEO title, slug, and meta description are defined
- The Rank Math target is above 80
- The text is clear and natural
- The structure follows the StayCloud pattern
- The prints show enough context
- Sensitive data is hidden only where needed
- The HTML draft is clean
- The WordPress TXT is ready to paste
- The visual audit was completed
- No credential exposure occurred

## Checklist before publishing

- The real flow still matches the current interface
- The SEO validation is approved
- The Rank Math target is above 80
- The prints are approved in the visual audit
- The HTML was reviewed visually
- The WordPress TXT contains only the final article HTML
- The images are ready for WordPress
- The tutorial was approved explicitly
- No sensitive data is present

## How to use with other skills

Use this skill together with:

- `writing-guidelines` for tone, clarity, and concision
- `web-design-guidelines` for layout, hierarchy, spacing, and image usability

Suggested order:

1. Use `staycloud-tutorial-guidelines` to enforce the StayCloud workflow
2. Use `writing-guidelines` to refine the text
3. Use `web-design-guidelines` to audit the visual composition

## Final rule

If the tutorial is not ready to be published as a real StayCloud help article, do not mark it as ready.
