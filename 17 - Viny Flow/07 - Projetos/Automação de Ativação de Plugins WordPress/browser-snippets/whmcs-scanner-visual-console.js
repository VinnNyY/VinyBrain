(function () {
  "use strict";

  const PROJECT = "WHMCS Scanner Visual";
  const EXPECTED_PATH = "/gestor/supporttickets.php";
  const STYLE_ID = "whmcs-scanner-visual-style";
  const PANEL_ID = "whmcs-scanner-visual-panel";
  const ROW_HIGH_CLASS = "whmcs-scanner-row-high";
  const ROW_REVIEW_CLASS = "whmcs-scanner-row-review";
  const BADGE_CLASS = "whmcs-scanner-badge";
  const BADGE_HIGH_CLASS = "whmcs-scanner-badge-high";
  const BADGE_REVIEW_CLASS = "whmcs-scanner-badge-review";

  const ACTION_KEYWORDS = [
    "elementor",
    "elementor pro",
    "wp rocket",
    "rank math",
    "crocoblock",
    "jetengine",
    "jetformbuilder",
    "premium addons",
    "essential addons",
    "happy addons",
  ];

  const ACTIVATION_INTENT_PATTERNS = [
    /\bsolicitacao de ativacao de plugins?\b/,
    /\bativacao de plugins?\b/,
    /\bativar plugins?\b/,
    /\bliberar plugins?\b/,
    /\bhabilitar plugins?\b/,
    /\bpedido de ativacao de plugins?\b/,
  ];

  const NEGATIVE_REACTIVATION_PATTERNS = [
    /\breativacao\b/,
    /\breativar\b/,
    /\breativacao de vps\b/,
    /\breativar vps\b/,
    /\bvps\b/,
  ];

  const NEGATIVE_KEYWORDS = [
    "redirecionamento",
    "migracao",
    "migração",
    "encerrar",
    "reativacao de vps",
    "reativação de vps",
    "email",
    "e-mail",
    "ssl",
    "dns",
    "financeiro",
    "dominio",
    "domínio",
    "hospedagem",
  ];

  const HARD_NEGATIVE_KEYWORDS = [
    "redirecionamento",
    "migracao",
    "migração",
    "encerrar",
    "email",
    "e-mail",
    "ssl",
    "dns",
    "financeiro",
    "hospedagem",
  ];

  const DONE_KEYWORDS = [
    "ativado com sucesso",
    "plugin ativado",
    "ja esta ativo",
    "já está ativo",
    "ja ativamos",
    "já ativamos",
    "concluido",
    "concluído",
    "resolvido",
    "considerar resolvido",
  ];

  const PLUGINS = [
    "elementor pro",
    "wp rocket",
    "rank math",
    "rank math seo pro",
    "crocoblock",
    "jetengine",
    "jetformbuilder",
    "premium addons",
    "essential addons",
    "happy addons",
  ];

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\bplugin\s*\(s\)\b/g, "plugins")
      .replace(/[^a-z0-9#]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function textOf(node) {
    return (node && (node.innerText || node.textContent) || "").replace(/\s+/g, " ").trim();
  }

  function isVisible(el) {
    return !!el && el.getClientRects().length > 0;
  }

  function isTargetPage() {
    return window.location.pathname.indexOf(EXPECTED_PATH) !== -1;
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .${ROW_HIGH_CLASS} {
        background: rgba(239, 68, 68, 0.13) !important;
        box-shadow: inset 0 0 0 2px rgba(220, 38, 38, 0.95) !important;
      }
      .${ROW_REVIEW_CLASS} {
        background: rgba(245, 158, 11, 0.12) !important;
        box-shadow: inset 0 0 0 2px rgba(245, 158, 11, 0.95) !important;
      }
      .${BADGE_CLASS} {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        margin-left: 0.5rem;
        padding: 0.15rem 0.45rem;
        border-radius: 999px;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.04em;
        vertical-align: middle;
        white-space: nowrap;
        border: 1px solid transparent;
      }
      .${BADGE_HIGH_CLASS} {
        background: #dc2626;
        color: #fff;
        border-color: #991b1b;
      }
      .${BADGE_REVIEW_CLASS} {
        background: #f59e0b;
        color: #1f2937;
        border-color: #b45309;
      }
      #${PANEL_ID} {
        position: fixed;
        top: 16px;
        right: 16px;
        width: min(420px, calc(100vw - 32px));
        max-height: min(80vh, 860px);
        overflow: auto;
        z-index: 2147483647;
        background: #0f172a;
        color: #e2e8f0;
        border: 1px solid rgba(148, 163, 184, 0.35);
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(15, 23, 42, 0.35);
        font: 12px/1.45 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      #${PANEL_ID} * { box-sizing: border-box; }
      #${PANEL_ID} .header {
        padding: 14px 16px 10px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.15);
      }
      #${PANEL_ID} .title {
        margin: 0 0 4px;
        font-size: 14px;
        font-weight: 800;
        color: #f8fafc;
      }
      #${PANEL_ID} .subtitle {
        margin: 0;
        color: #94a3b8;
      }
      #${PANEL_ID} .stats {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 8px;
        padding: 12px 16px 0;
      }
      #${PANEL_ID} .stat {
        padding: 10px;
        border-radius: 12px;
        background: rgba(30, 41, 59, 0.9);
        border: 1px solid rgba(148, 163, 184, 0.15);
      }
      #${PANEL_ID} .stat .label { display:block; color:#94a3b8; font-size:10px; text-transform:uppercase; letter-spacing:.06em; }
      #${PANEL_ID} .stat .value { display:block; color:#fff; font-size:18px; font-weight:800; margin-top:3px; }
      #${PANEL_ID} .actions {
        display:flex;
        gap:8px;
        padding: 12px 16px;
      }
      #${PANEL_ID} button {
        appearance: none;
        border: 0;
        border-radius: 10px;
        padding: 9px 12px;
        cursor: pointer;
        font-weight: 700;
      }
      #${PANEL_ID} .copy {
        background: #38bdf8;
        color: #082f49;
      }
      #${PANEL_ID} .clear {
        background: #334155;
        color: #e2e8f0;
      }
      #${PANEL_ID} .list {
        padding: 0 16px 16px;
      }
      #${PANEL_ID} .item {
        margin-top: 10px;
        padding: 10px 12px;
        border-radius: 12px;
        background: rgba(15, 23, 42, 0.9);
        border: 1px solid rgba(148, 163, 184, 0.14);
      }
      #${PANEL_ID} .item strong {
        color: #f8fafc;
      }
      #${PANEL_ID} .muted {
        color: #94a3b8;
      }
      #${PANEL_ID} .empty {
        padding: 12px 16px 16px;
        color: #94a3b8;
      }
    `;
    document.head.appendChild(style);
  }

  function buildHeaderMap(table) {
    const headerRows = Array.from(table.querySelectorAll("tr"));
    for (const row of headerRows) {
      const headerCells = Array.from(row.querySelectorAll("th"));
      if (!headerCells.length) continue;
      const map = headerCells.map((cell, index) => {
        return { index, key: normalizeText(textOf(cell)) };
      });
      return map;
    }
    return [];
  }

  function firstMatchIndex(headers, terms) {
    for (const term of terms) {
      const normalizedTerm = normalizeText(term);
      const found = headers.find((h) => h.key.includes(normalizedTerm));
      if (found) return found.index;
    }
    return -1;
  }

  function pickSubjectCell(row, headers) {
    const subjectIndex = firstMatchIndex(headers, ["subject", "assunto", "topic", "title"]);
    if (subjectIndex >= 0 && row.cells[subjectIndex]) return row.cells[subjectIndex];
    const cells = Array.from(row.cells);
    if (cells.length >= 3) return cells[2];
    return cells[1] || cells[0] || null;
  }

  function inferRecord(row, headers) {
    const cells = Array.from(row.cells);
    const texts = cells.map((cell) => textOf(cell));
    const rawText = texts.join(" | ");
    const normalizedText = normalizeText(rawText);

    const ticketId =
      firstNonEmpty([
        readByHeader(headers, cells, ["ticket", "ticket id", "id", "#"]),
        extractTicketId(rawText),
      ]) || "";
    const department = firstNonEmpty([
      readByHeader(headers, cells, ["department", "departamento", "dept"]),
      firstNonEmpty(guessByKeywords(normalizedText, ["suporte", "billing", "financeiro", "wordpress"])),
    ]) || "";
    const status = firstNonEmpty([
      readByHeader(headers, cells, ["status", "state"]),
      firstNonEmpty(
        guessByKeywords(normalizedText, ["open", "answered", "customer reply", "in progress", "closed", "resolved"])
      ),
    ]) || "";
    const customer = firstNonEmpty([
      readByHeader(headers, cells, ["name", "cliente", "customer", "user"]),
      guessLongestText(texts),
    ]) || "";
    const subjectCell = pickSubjectCell(row, headers);
    const subject = subjectCell ? textOf(subjectCell) : guessSubject(texts);

    return {
      ticketId,
      department,
      status,
      customer,
      subject,
      rawText,
      row,
    };
  }

  function readByHeader(headers, cells, candidates) {
    const index = firstMatchIndex(headers, candidates);
    if (index >= 0 && cells[index]) return textOf(cells[index]);
    return "";
  }

  function guessByKeywords(rawText, keywords) {
    const text = normalizeText(rawText);
    const found = [];
    for (const keyword of keywords || []) {
      const normalizedKeyword = normalizeText(keyword);
      if (normalizedKeyword && text.includes(normalizedKeyword)) {
        found.push(keyword);
      }
    }
    return found;
  }

  function detectPlugins(rawText) {
    return guessByKeywords(rawText, PLUGINS).map((plugin) => String(plugin).toUpperCase());
  }

  function guessLongestText(texts) {
    const cleaned = texts.filter(Boolean).sort((a, b) => b.length - a.length);
    return cleaned[0] || "";
  }

  function guessSubject(texts) {
    const words = texts.filter((text) => {
      const n = normalizeText(text);
      return n && n.length > 5 && !/^\d+$/.test(n);
    });
    return words[0] || "";
  }

  function firstNonEmpty(values) {
    for (const value of values) {
      if (value && String(value).trim()) return String(value).trim();
    }
    return "";
  }

  function extractTicketId(text) {
    const patterns = [
      /#[A-Z0-9-]{3,}/i,
      /\b[A-Z]{2,}-\d{3,}\b/i,
      /\b\d{5,}\b/,
    ];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[0];
    }
    return "";
  }

  function countMatches(text, terms) {
    let score = 0;
    for (const term of terms) {
      if (text.includes(normalizeText(term))) score += 1;
    }
    return score;
  }

  function hasAnyPattern(text, patterns) {
    const normalized = normalizeText(text);
    return patterns.some((pattern) => pattern.test(normalized));
  }

  function detectPlugin(text) {
    const matched = [];
    for (const plugin of PLUGINS) {
      if (text.includes(normalizeText(plugin))) matched.push(plugin.toUpperCase());
    }
    return matched;
  }

  function hasActivationIntent(text) {
    const normalized = normalizeText(text);
    return ACTIVATION_INTENT_PATTERNS.some((pattern) => pattern.test(normalized));
  }

  function hasNegativeReactivation(text) {
    const normalized = normalizeText(text);
    return NEGATIVE_REACTIVATION_PATTERNS.some((pattern) => pattern.test(normalized));
  }

  function classifyTicket(record) {
    const text = normalizeText([record.ticketId, record.department, record.subject, record.customer, record.status, record.rawText].join(" "));
    const plugins = detectPlugins(text);
    const hasPlugin = plugins.length > 0 || /\bplugins?\b/.test(text);
    const hasActivationPhrase = hasActivationIntent(text);
    const hasAction = hasActivationPhrase || hasAnyPattern(text, [/\bativar\b/, /\bativacao\b/, /\bhabilitar\b/, /\bliberar\b/]);
    const doneSignal = countMatches(text, DONE_KEYWORDS) > 0;
    const negativeHits = countMatches(text, NEGATIVE_KEYWORDS);
    const hardNegativeHits = countMatches(text, HARD_NEGATIVE_KEYWORDS);
    const statusText = normalizeText([record.status, record.rawText].join(" "));
    const isOpenStatus = /open|answered|in progress|customer reply|pending/.test(statusText);
    const looksClosed = /closed|resolved/.test(statusText);
    const vpsReactivation = hasNegativeReactivation(text) && !hasActivationPhrase;
    const strongPluginActivation = hasActivationPhrase && plugins.length > 0;
    const priorityBlocked = vpsReactivation || doneSignal || looksClosed;
    const enoughActivationContext = hasActivationPhrase && plugins.length > 0;
    let score = 0;

    const hasActivationWord = /\bativacao\b|\bativar\b|\bhabilitar\b|\bliberar\b/.test(text);
    const hasPluginWord = /\bplugins?\b/.test(text);
    const explicitPluginActivation = !vpsReactivation && hasActivationWord && hasPluginWord && plugins.length > 0;

    if (explicitPluginActivation) {
      score = 100;
      console.debug(`[${PROJECT}]`, {
        ticketId: record.ticketId,
        subject: record.subject,
        normalizedText: text,
        hasActivationWord,
        hasPluginWord,
        pluginsDetected: plugins,
        classification: "ALTA CONFIANÇA",
        priority: "fila_ativacao",
      });
      return {
        score,
        plugins,
        hasAction: true,
        classification: "ALTA CONFIANÇA",
        badgeText: "ATIVAÇÃO PLUGIN",
        priority: "fila_ativacao",
        doneSignal,
        isOpenStatus,
        reason: "Pedido claro de ativação de plugin com plugin conhecido detectado.",
      };
    }

    if (isOpenStatus) score += 30;
    if (hasAction) score += 25;
    if (plugins.length) score += 25;
    if (text.includes("wordpress") || text.includes("wp") || text.includes("site")) score += 10;
    if (doneSignal) score -= 40;
    if (negativeHits) score -= Math.min(20, negativeHits * 5);
    if (hardNegativeHits) score -= Math.min(30, hardNegativeHits * 10);
    if (vpsReactivation) score -= 40;
    if (looksClosed) score -= 50;
    score = Math.max(0, Math.min(100, score));

    let classification = "IGNORAR";
    let badgeText = "";
    let priority = "ignorar";

    if (priorityBlocked) {
      classification = "IGNORAR";
    } else if (isOpenStatus && enoughActivationContext && !hardNegativeHits) {
      classification = "ALTA CONFIANÇA";
      badgeText = "ATIVAÇÃO PLUGIN";
      priority = "fila_ativacao";
    } else if (hasPlugin || hasAction || score >= 40) {
      classification = "REVISAR";
      badgeText = "REVISAR PLUGIN";
      if (plugins.length) {
        priority = "revisar_pedido_generico";
      } else {
        priority = "revisar_pedido_generico";
      }
    }

    if ((negativeHits || vpsReactivation) && !plugins.length && !hasAction) {
      classification = "IGNORAR";
      priority = "ignorar";
    }

    if (classification === "ALTA CONFIANÇA") {
      priority = "fila_ativacao";
      badgeText = "ATIVAÇÃO PLUGIN";
    }

    if (!priorityBlocked && (hasPlugin || hasAction || plugins.length)) {
      console.debug(`[${PROJECT}]`, {
        ticketId: record.ticketId,
        subject: record.subject,
        normalizedText: text,
        hasActivationWord,
        hasPluginWord,
        pluginsDetected: plugins,
        classification,
        priority,
      });
    }

    // Validação rápida:
    // Entrada: "Solicitação de ativação de plugin(s): Elementor PRO, WP Rocket" => ALTA CONFIANÇA
    // Entrada: "Reativação de VPS" => IGNORAR

    return {
      score,
      plugins,
      hasAction,
      classification,
      badgeText,
      priority,
      doneSignal,
      isOpenStatus,
    };
  }

  function ensurePanel() {
    let panel = document.getElementById(PANEL_ID);
    if (panel) return panel;
    panel = document.createElement("aside");
    panel.id = PANEL_ID;
    panel.setAttribute("role", "complementary");
    panel.setAttribute("aria-label", "Scanner visual WHMCS");
    document.body.appendChild(panel);
    return panel;
  }

  function clearMarks() {
    const existingPanel = document.getElementById(PANEL_ID);
    if (existingPanel) existingPanel.remove();
    const existingStyle = document.getElementById(STYLE_ID);
    if (existingStyle) existingStyle.remove();
    document.querySelectorAll(`[data-whmcs-scanner-badge="1"]`).forEach((badge) => badge.remove());
    document.querySelectorAll(`.${ROW_HIGH_CLASS}, .${ROW_REVIEW_CLASS}`).forEach((row) => {
      row.classList.remove(ROW_HIGH_CLASS, ROW_REVIEW_CLASS);
      row.removeAttribute("data-whmcs-scanner-classification");
      row.removeAttribute("data-whmcs-scanner-score");
      row.removeAttribute("data-whmcs-scanner-priority");
    });
    console.info(`[${PROJECT}] Marcações limpas.`);
  }

  function buildQueueText(entries) {
    const lines = ["Fila de ativação de plugins detectada:", ""];
    entries.forEach((entry, index) => {
      lines.push(`${index + 1}. ${entry.ticketId || "(ticket sem id)"}`);
      lines.push(`Assunto: ${entry.subject || "-"}`);
      lines.push(`Classificação: ${entry.classification}`);
      lines.push(`Plugins detectados: ${entry.plugins.length ? entry.plugins.join(", ") : "-"}`);
      lines.push(
        "Próxima ação: revisar ticket e validar autorização/domínio antes de qualquer ativação."
      );
      if (index < entries.length - 1) lines.push("");
    });
    return lines.join("\n");
  }

  async function copyQueue(entries) {
    const text = buildQueueText(entries);
    try {
      await navigator.clipboard.writeText(text);
      console.info(`[${PROJECT}] Fila copiada para a área de transferência.`);
    } catch (error) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      console.info(`[${PROJECT}] Fila copiada pela rotina de fallback.`);
    }
  }

  function renderPanel(summary, entries) {
    const panel = ensurePanel();
    panel.innerHTML = `
      <div class="header">
        <p class="title">Scanner Visual WHMCS</p>
        <p class="subtitle">Leitura apenas do DOM visível da página atual.</p>
      </div>
      <div class="stats">
        <div class="stat"><span class="label">Visíveis</span><span class="value">${summary.visible}</span></div>
        <div class="stat"><span class="label">Alta confiança</span><span class="value">${summary.high}</span></div>
        <div class="stat"><span class="label">Revisar</span><span class="value">${summary.review}</span></div>
        <div class="stat"><span class="label">Ignorados</span><span class="value">${summary.ignore}</span></div>
      </div>
      <div class="actions">
        <button class="copy" type="button">Copiar fila</button>
        <button class="clear" type="button">Limpar marcações</button>
      </div>
      <div class="list">
        ${entries.length
          ? entries
              .map(
                (entry) => `
              <div class="item">
                <strong>${escapeHtml(entry.ticketId || "(sem id)")}</strong>
                <div class="muted">${escapeHtml(entry.subject || "-")}</div>
                <div>Classificação: <strong>${escapeHtml(entry.classification)}</strong></div>
                <div>Plugins: ${escapeHtml(entry.plugins.length ? entry.plugins.join(", ") : "-")}</div>
                <div>Prioridade: ${escapeHtml(entry.priority)}</div>
              </div>
            `
              )
              .join("")
          : '<div class="empty">Nenhum ticket candidato encontrado na página visível.</div>'}
      </div>
    `;

    panel.querySelector(".copy").addEventListener("click", () => copyQueue(entries));
    panel.querySelector(".clear").addEventListener("click", clearMarks);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function annotateRow(row, result) {
    row.classList.remove(ROW_HIGH_CLASS, ROW_REVIEW_CLASS);
    row.removeAttribute("data-whmcs-scanner-badge");
    row.removeAttribute("data-whmcs-scanner-classification");
    row.removeAttribute("data-whmcs-scanner-score");
    row.removeAttribute("data-whmcs-scanner-priority");

    if (result.classification === "ALTA CONFIANÇA") {
      row.classList.add(ROW_HIGH_CLASS);
    } else if (result.classification === "REVISAR") {
      row.classList.add(ROW_REVIEW_CLASS);
    }

    row.setAttribute("data-whmcs-scanner-classification", result.classification);
    row.setAttribute("data-whmcs-scanner-score", String(result.score));
    row.setAttribute("data-whmcs-scanner-priority", result.priority);

    const subjectCell = pickSubjectCell(row, buildHeaderMap(row.closest("table") || document.createElement("table")));
    if (subjectCell && result.badgeText) {
      let badge = subjectCell.querySelector(`[data-whmcs-scanner-badge="1"]`);
      if (!badge) {
        badge = document.createElement("span");
        badge.setAttribute("data-whmcs-scanner-badge", "1");
        badge.className = `${BADGE_CLASS} ${result.classification === "ALTA CONFIANÇA" ? BADGE_HIGH_CLASS : BADGE_REVIEW_CLASS}`;
        badge.textContent = result.badgeText;
        subjectCell.appendChild(badge);
      } else {
        badge.className = `${BADGE_CLASS} ${result.classification === "ALTA CONFIANÇA" ? BADGE_HIGH_CLASS : BADGE_REVIEW_CLASS}`;
        badge.textContent = result.badgeText;
      }
    }
  }

  function scan() {
    clearMarks();
    if (!isTargetPage()) {
      console.warn(
        `[${PROJECT}] A URL atual não parece ser ${EXPECTED_PATH}. Abra a página de tickets e rode novamente.`
      );
      return {
        visible: 0,
        high: 0,
        review: 0,
        ignore: 0,
        entries: [],
      };
    }

    injectStyles();

    const tables = Array.from(document.querySelectorAll("table")).filter(isVisible);
    const rows = [];
    for (const table of tables) {
      const headers = buildHeaderMap(table);
      const tableRows = Array.from(table.querySelectorAll("tr")).filter((row) => {
        return row.querySelectorAll("td").length > 0 && isVisible(row);
      });
      for (const row of tableRows) {
        rows.push({ row, headers });
      }
    }

    const results = [];
    for (const { row, headers } of rows) {
      try {
        const record = inferRecord(row, headers);
        if (!record.rawText || record.rawText.length < 6) continue;
        const result = classifyTicket(record);
        results.push({ ...record, ...result });
        annotateRow(record.row, result);
      } catch (error) {
        console.warn(`[${PROJECT}] Linha ignorada por erro de leitura.`, error);
      }
    }

    const entries = results
      .filter((item) => item.classification !== "IGNORAR")
      .map((item) => ({
        ticketId: item.ticketId,
        subject: item.subject,
        classification: item.classification,
        plugins: item.plugins,
        priority: item.priority,
      }));

    const summary = {
      visible: results.length,
      high: results.filter((item) => item.classification === "ALTA CONFIANÇA").length,
      review: results.filter((item) => item.classification === "REVISAR").length,
      ignore: results.filter((item) => item.classification === "IGNORAR").length,
    };

    renderPanel(summary, entries);
    console.info(`[${PROJECT}] Scan concluído.`, summary, entries);
    return { ...summary, entries };
  }

  window.WHMCSScannerVisual = {
    scan,
    clear: clearMarks,
  };

  scan();
})();
