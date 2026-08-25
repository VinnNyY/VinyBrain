// ==UserScript==
// @name         WHMCS Autonomous Scanner
// @namespace    viny-brain
// @version      1.0.1
// @description  Scanner read-only de tickets WHMCS para ativação de plugins
// @match        https://painel.staycloud.com.br/gestor/supporttickets.php*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  console.info("[WHMCS Autonomous Scanner] userscript carregado", location.href);

  var ALLOWED_HOST = "painel.staycloud.com.br";
  var LIST_PATH = "/gestor/supporttickets.php";
  var PROJECT = "WHMCS Autonomous Scanner";
  var PANEL_ID = "whmcs-autonomous-scanner-panel";
  var STYLE_ID = "whmcs-autonomous-scanner-style";
  var MAX_PAGES_DEFAULT = 5;

  var PLUGINS = [
    { name: "Elementor Pro", aliases: ["elementor pro", "elementor"], type: "premium", allowed: true, requiresLicense: true },
    { name: "WP Rocket", aliases: ["wp rocket"], type: "premium", allowed: true, requiresLicense: true },
    { name: "Rank Math SEO Pro", aliases: ["rank math seo pro", "rank math"], type: "premium", allowed: true, requiresLicense: true },
    { name: "Crocoblock", aliases: ["crocoblock"], type: "premium", allowed: true, requiresLicense: true },
    { name: "JetEngine", aliases: ["jetengine", "jet engine"], type: "premium", allowed: true, requiresLicense: true },
    { name: "JetFormBuilder", aliases: ["jetformbuilder", "jet form builder"], type: "premium", allowed: true, requiresLicense: true },
    { name: "Premium Addons", aliases: ["premium addons"], type: "premium", allowed: true, requiresLicense: true },
    { name: "Essential Addons", aliases: ["essential addons"], type: "premium", allowed: true, requiresLicense: true },
    { name: "Happy Addons", aliases: ["happy addons"], type: "premium", allowed: true, requiresLicense: true },
  ];

  var ACTIVATION_PHRASES = [
    /\bsolicitacao de ativacao de plugins?\b/,
    /\bativacao de plugins?\b/,
    /\bativar plugins?\b/,
    /\bliberar plugins?\b/,
    /\bhabilitar plugins?\b/,
    /\bfavor ativar\b/,
    /\bpreciso ativar\b/,
    /\bpode ativar\b/,
    /\bsolicito ativacao\b/,
  ];

  var NEGATIVE_TOPIC_PATTERNS = [
    /\breativacao de vps\b/,
    /\breativar vps\b/,
    /\bmigracao\b/,
    /\bredirecionamento\b/,
    /\bencerramento\b/,
    /\bnota fiscal\b/,
    /\bemail\b/,
    /\be-mail\b/,
    /\bdns\b/,
    /\bssl\b/,
    /\bfinanceiro\b/,
    /\bdominio\b/,
    /\bdominio sem plugin\b/,
  ];

  var COMPLETION_PATTERNS = [
    /\bativado com sucesso\b/,
    /\bplugin ativado\b/,
    /\bja esta ativo\b/,
    /\bconcluido\b/,
    /\bresolvido\b/,
    /\bsuporte ja ativou\b/,
  ];

  var AUTH_POSITIVE_PATTERNS = [
    /\bpode ativar\b/,
    /\bautorizo\b/,
    /\bpode fazer\b/,
    /\bpode seguir\b/,
    /\bsim,? pode ativar\b/,
    /\bfavor ativar\b/,
    /\bpreciso ativar\b/,
    /\bsolicito ativacao\b/,
  ];

  var AUTH_NEGATIVE_PATTERNS = [
    /\bsomente pergunta\b/,
    /\bso pergunta\b/,
    /\bquanto custa\b/,
    /\bpreco\b/,
    /\bvalor\b/,
    /\borcamento\b/,
    /\bnao sei\b/,
    /\bnao autorizo\b/,
  ];

  var SUPPORT_REPLY_PATTERNS = [
    /\bsuporte respondeu\b/,
    /\bstaff\b/,
    /\badministrador\b/,
    /\bresposta do suporte\b/,
    /\breplied by staff\b/,
    /\blast reply by.*staff\b/,
  ];

  var state = {
    listPagesScanned: 0,
    detailPagesScanned: 0,
    candidatesFound: 0,
    readyForApproval: 0,
    reviewManual: 0,
    ignored: 0,
    errors: 0,
    pageLimit: MAX_PAGES_DEFAULT,
    statusMessage: "Pronto para escanear.",
    results: [],
    errorsList: [],
    scannedUrls: new Set(),
    deepScannedUrls: new Set(),
    pendingTasks: [],
  };

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

  function rawText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function isAllowedPage() {
    return window.location.hostname === ALLOWED_HOST && window.location.pathname === LIST_PATH;
  }

  function isViewTicketPage() {
    return /[?&]action=viewticket\b/i.test(window.location.search);
  }

  function sameOriginUrl(url) {
    var parsed = new URL(url, window.location.href);
    return parsed.origin === window.location.origin ? parsed.toString() : "";
  }

  function absoluteUrl(url) {
    try {
      return sameOriginUrl(url);
    } catch (error) {
      return "";
    }
  }

  function unique(values) {
    var seen = new Set();
    var out = [];
    values.forEach(function (value) {
      if (!value || seen.has(value)) return;
      seen.add(value);
      out.push(value);
    });
    return out;
  }

  function textOf(node) {
    return rawText((node && (node.innerText || node.textContent)) || "");
  }

  function visible(el) {
    return !!el && el.getClientRects().length > 0;
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      "#"+PANEL_ID+"{position:fixed;top:16px;right:16px;z-index:999999;width:min(520px,calc(100vw - 32px));max-height:min(84vh,940px);overflow:auto;background:#0f172a;color:#e2e8f0;border:1px solid rgba(148,163,184,.28);border-radius:16px;box-shadow:0 20px 60px rgba(15,23,42,.35);font:12px/1.45 system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}",
      "#"+PANEL_ID+" *{box-sizing:border-box}",
      "#"+PANEL_ID+" .header{padding:14px 16px 10px;border-bottom:1px solid rgba(148,163,184,.15)}",
      "#"+PANEL_ID+" .title{margin:0 0 4px;font-size:14px;font-weight:800;color:#f8fafc}",
      "#"+PANEL_ID+" .subtitle{margin:0;color:#94a3b8}",
      "#"+PANEL_ID+" .grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;padding:12px 16px 0}",
      "#"+PANEL_ID+" .stat{padding:10px;border-radius:12px;background:rgba(30,41,59,.92);border:1px solid rgba(148,163,184,.14)}",
      "#"+PANEL_ID+" .stat .label{display:block;color:#94a3b8;font-size:10px;text-transform:uppercase;letter-spacing:.06em}",
      "#"+PANEL_ID+" .stat .value{display:block;color:#fff;font-size:18px;font-weight:800;margin-top:3px}",
      "#"+PANEL_ID+" .controls{display:flex;flex-wrap:wrap;gap:8px;padding:12px 16px}",
      "#"+PANEL_ID+" button{appearance:none;border:0;border-radius:10px;padding:9px 12px;cursor:pointer;font-weight:700}",
      "#"+PANEL_ID+" .primary{background:#38bdf8;color:#082f49}",
      "#"+PANEL_ID+" .secondary{background:#334155;color:#e2e8f0}",
      "#"+PANEL_ID+" .danger{background:#ef4444;color:#fff}",
      "#"+PANEL_ID+" .limit{display:flex;align-items:center;gap:8px;padding:0 16px 12px;color:#cbd5e1}",
      "#"+PANEL_ID+" .limit input{width:72px;padding:6px 8px;border-radius:8px;border:1px solid rgba(148,163,184,.2);background:#111827;color:#e2e8f0}",
      "#"+PANEL_ID+" .message{padding:0 16px 12px;color:#94a3b8}",
      "#"+PANEL_ID+" .list{padding:0 16px 16px}",
      "#"+PANEL_ID+" .item{margin-top:10px;padding:10px 12px;border-radius:12px;background:rgba(15,23,42,.92);border:1px solid rgba(148,163,184,.14)}",
      "#"+PANEL_ID+" .item strong{color:#f8fafc}",
      "#"+PANEL_ID+" .muted{color:#94a3b8}",
      "#"+PANEL_ID+" .tag{display:inline-flex;align-items:center;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:800;letter-spacing:.04em;margin-left:6px}",
      "#"+PANEL_ID+" .tag.high{background:#dc2626;color:#fff}",
      "#"+PANEL_ID+" .tag.review{background:#f59e0b;color:#1f2937}",
      "#"+PANEL_ID+" .tag.ignore{background:#475569;color:#fff}",
      "#"+PANEL_ID+" .small{font-size:11px;color:#94a3b8}",
      ".whmcs-autonomous-high{background:rgba(239,68,68,.13)!important;box-shadow:inset 0 0 0 2px rgba(220,38,38,.95)!important}",
      ".whmcs-autonomous-review{background:rgba(245,158,11,.12)!important;box-shadow:inset 0 0 0 2px rgba(245,158,11,.95)!important}",
      ".whmcs-autonomous-badge{display:inline-flex;align-items:center;gap:.35rem;margin-left:.5rem;padding:.15rem .45rem;border-radius:999px;font-size:10px;font-weight:700;letter-spacing:.04em;white-space:nowrap;border:1px solid transparent}",
      ".whmcs-autonomous-badge.high{background:#dc2626;color:#fff;border-color:#991b1b}",
      ".whmcs-autonomous-badge.review{background:#f59e0b;color:#1f2937;border-color:#b45309}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function renderSmokePanel() {
    var panel = document.getElementById(PANEL_ID);
    if (!panel) {
      panel = document.createElement("div");
      panel.id = PANEL_ID;
      panel.setAttribute("data-mode", "smoke");
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-label", "Scanner Autonomo WHMCS");
      panel.style.position = "fixed";
      panel.style.right = "20px";
      panel.style.bottom = "20px";
      panel.style.zIndex = "9999999";
      panel.style.background = "#0f172a";
      panel.style.color = "#ffffff";
      panel.style.padding = "16px";
      panel.style.borderRadius = "14px";
      panel.style.maxWidth = "360px";
      panel.style.width = "calc(100vw - 40px)";
      panel.style.boxShadow = "0 16px 48px rgba(15,23,42,0.45)";
      panel.style.border = "1px solid rgba(148,163,184,0.25)";
      panel.style.font = "13px/1.45 system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      panel.innerHTML = [
        '<div style="display:flex;flex-direction:column;gap:10px">',
        '<div>',
        '<div style="font-size:15px;font-weight:800;margin-bottom:4px">Scanner Autonomo WHMCS</div>',
        '<div data-smoke-message>Script carregado com sucesso.</div>',
        "</div>",
        '<button type="button" data-smoke-life style="border:0;border-radius:10px;padding:9px 12px;font-weight:700;background:#38bdf8;color:#082f49;cursor:pointer">Teste de vida</button>',
        "</div>",
      ].join("");
      document.body.appendChild(panel);
      panel.querySelector("[data-smoke-life]").addEventListener("click", function () {
        var message = panel.querySelector("[data-smoke-message]");
        if (message) message.textContent = "Scanner ativo e respondendo.";
      });
      return panel;
    }

    if (panel.getAttribute("data-mode") === "smoke") {
      var smokeMessage = panel.querySelector("[data-smoke-message]");
      if (smokeMessage && !smokeMessage.textContent) smokeMessage.textContent = "Script carregado com sucesso.";
    }
    return panel;
  }

  function setMessage(text) {
    state.statusMessage = text;
    var node = document.querySelector("#" + PANEL_ID + " [data-message]");
    if (node) node.textContent = text;
  }

  function updateStats() {
    var panel = createPanel();
    panel.querySelector('[data-stat="list"]').textContent = String(state.listPagesScanned);
    panel.querySelector('[data-stat="candidates"]').textContent = String(state.candidatesFound);
    panel.querySelector('[data-stat="deep"]').textContent = String(state.detailPagesScanned);
    panel.querySelector('[data-stat="ready"]').textContent = String(state.readyForApproval);
    panel.querySelector('[data-stat="review"]').textContent = String(state.reviewManual);
    panel.querySelector('[data-stat="ignored"]').textContent = String(state.ignored);
    panel.querySelector('[data-stat="errors"]').textContent = String(state.errors);
    panel.querySelector('[data-stat="limit"]').textContent = String(state.pageLimit);
    panel.querySelector("[data-limit]").value = String(state.pageLimit);
  }

  function candidateListForPanel() {
    return state.results.filter(function (item) {
      return item.finalClassification !== "IGNORAR";
    });
  }

  function currentOperationalClassification(item) {
    return item.deepScanned ? item.finalClassification : item.initialClassification;
  }

  function updatePanelList() {
    var list = document.querySelector("#" + PANEL_ID + " [data-list]");
    if (!list) return;
    var entries = candidateListForPanel();
    if (!entries.length) {
      list.innerHTML = '<div class="small">Nenhum candidato com fila operacional por enquanto.</div>';
      return;
    }
    list.innerHTML = entries.map(function (item) {
      var classification = currentOperationalClassification(item);
      var tagClass = classification === "PRONTO PARA APROVACAO" || classification === "ALTA CONFIANCA" ? "high" : "review";
      return [
        '<div class="item">',
        '<div><strong>' + escapeHtml(item.ticket_id || "(sem id)") + '</strong><span class="tag ' + tagClass + '">' + escapeHtml(classification) + '</span></div>',
        '<div class="muted">' + escapeHtml(item.subject || "-") + '</div>',
        '<div>Departamento: <strong>' + escapeHtml(item.department || "-") + '</strong></div>',
        '<div>Solicitante: <strong>' + escapeHtml(item.requester || "-") + '</strong></div>',
        '<div>Status: <strong>' + escapeHtml(item.status || "-") + '</strong></div>',
        '<div>Plugins: <strong>' + escapeHtml(item.pluginsDetected.length ? item.pluginsDetected.join(", ") : "-") + '</strong></div>',
        '<div>Dominio: <strong>' + escapeHtml(item.domainDetected || "nao detectado") + '</strong></div>',
        '<div>Autorizacao: <strong>' + escapeHtml(item.authorizationDetected) + '</strong></div>',
        '<div>Proxima acao: <strong>' + escapeHtml(item.nextAction || "-") + '</strong></div>',
        '</div>'
      ].join("");
    }).join("");
  }

  function updatePanel() {
    ensureStyles();
    updateStats();
    updatePanelList();
    setMessage(state.statusMessage);
  }

  function renderPanel() {
    ensureStyles();
    createPanel();
    updatePanel();
  }

  function collectHeaders(table) {
    var headerRows = Array.from(table.querySelectorAll("tr"));
    for (var i = 0; i < headerRows.length; i += 1) {
      var ths = Array.from(headerRows[i].querySelectorAll("th"));
      if (!ths.length) continue;
      return ths.map(function (cell, index) {
        return { index: index, key: normalizeText(textOf(cell)) };
      });
    }
    return [];
  }

  function headerIndex(headers, candidates) {
    for (var i = 0; i < candidates.length; i += 1) {
      var needle = normalizeText(candidates[i]);
      for (var j = 0; j < headers.length; j += 1) {
        if (headers[j].key.indexOf(needle) !== -1) return headers[j].index;
      }
    }
    return -1;
  }

  function cellByHeader(headers, cells, candidates) {
    var index = headerIndex(headers, candidates);
    if (index >= 0 && cells[index]) return textOf(cells[index]);
    return "";
  }

  function guessSubject(texts) {
    var best = "";
    texts.forEach(function (value) {
      if (!value) return;
      var cleaned = normalizeText(value);
      if (!cleaned || cleaned.length < 8 || /^\d+$/.test(cleaned)) return;
      if (cleaned.indexOf("supporttickets") !== -1) return;
      if (value.length > best.length) best = value;
    });
    return rawText(best);
  }

  function extractTicketId(text) {
    var candidates = [
      /#[A-Z0-9-]{3,}/i,
      /\b[A-Z]{2,}-\d{3,}\b/i,
      /\b\d{5,}\b/
    ];
    for (var i = 0; i < candidates.length; i += 1) {
      var match = text.match(candidates[i]);
      if (match) return match[0];
    }
    return "";
  }

  function extractTicketLink(row) {
    var links = Array.from(row.querySelectorAll("a[href]"));
    for (var i = 0; i < links.length; i += 1) {
      var href = links[i].getAttribute("href") || "";
      if (/supporttickets\.php/i.test(href) && /viewticket/i.test(href)) {
        return absoluteUrl(href);
      }
    }
    for (var j = 0; j < links.length; j += 1) {
      var href2 = links[j].getAttribute("href") || "";
      if (/ticketid=|viewticket/i.test(href2)) return absoluteUrl(href2);
    }
    return "";
  }

  function extractVisibleRows(doc) {
    var rows = [];
    var tables = Array.from(doc.querySelectorAll("table"));
    if (doc === document) {
      tables = tables.filter(visible);
    }
    tables.forEach(function (table) {
      var headers = collectHeaders(table);
      Array.from(table.querySelectorAll("tr")).forEach(function (row) {
        if (!row.querySelectorAll("td").length) return;
        if (doc === document && !visible(row)) return;
        try {
          var cells = Array.from(row.cells);
          if (!cells.length) return;
          var texts = cells.map(function (cell) {
            return textOf(cell);
          });
          var rowText = rawText(texts.join(" | "));
          if (!rowText) return;
          var ticketId = cellByHeader(headers, cells, ["ticket", "ticket id", "id", "#"]) || extractTicketId(rowText);
          var subjectCellIndex = headerIndex(headers, ["subject", "assunto", "topic", "title"]);
          var subject = subjectCellIndex >= 0 && cells[subjectCellIndex] ? textOf(cells[subjectCellIndex]) : guessSubject(texts);
          var department = cellByHeader(headers, cells, ["department", "departamento", "dept"]) || guessByKeywords(rowText, ["suporte", "billing", "financeiro", "wordpress"])[0] || "";
          var status = cellByHeader(headers, cells, ["status", "state"]) || guessByKeywords(rowText, ["open", "answered", "customer reply", "in progress", "closed", "resolved", "pending"])[0] || "";
          var requester = cellByHeader(headers, cells, ["requester", "solicitante", "cliente", "customer", "name", "user"]) || "";
          var lastReply = cellByHeader(headers, cells, ["last reply", "ultima resposta", "última resposta", "reply"]);
          var ticketLink = extractTicketLink(row);
          rows.push({
            ticket_id: ticketId,
            subject: subject,
            department: department,
            requester: requester,
            status: status,
            lastReply: lastReply,
            ticketLink: ticketLink,
            rawText: rowText,
            sourceUrl: doc.location ? doc.location.href : window.location.href,
            sourceType: doc === document ? "live-list" : "fetched-list"
          });
        } catch (error) {
          state.errors += 1;
          state.errorsList.push(String(error && error.message ? error.message : error));
        }
      });
    });
    return rows;
  }

  function guessByKeywords(raw, keywords) {
    var text = normalizeText(raw);
    var found = [];
    (keywords || []).forEach(function (keyword) {
      if (text.indexOf(normalizeText(keyword)) !== -1) found.push(keyword);
    });
    return found;
  }

  function detectPluginsFromText(text) {
    var normalized = normalizeText(text);
    var found = [];
    PLUGINS.forEach(function (plugin) {
      var matched = false;
      for (var i = 0; i < plugin.aliases.length; i += 1) {
        if (normalized.indexOf(normalizeText(plugin.aliases[i])) !== -1) {
          matched = true;
          break;
        }
      }
      if (matched) found.push(plugin.name);
    });
    return unique(found);
  }

  function detectActivationIntent(text) {
    var normalized = normalizeText(text);
    return ACTIVATION_PHRASES.some(function (pattern) {
      return pattern.test(normalized);
    });
  }

  function detectNegativeTopic(text) {
    var normalized = normalizeText(text);
    return NEGATIVE_TOPIC_PATTERNS.some(function (pattern) {
      return pattern.test(normalized);
    });
  }

  function detectCompletion(text) {
    var normalized = normalizeText(text);
    return COMPLETION_PATTERNS.some(function (pattern) {
      return pattern.test(normalized);
    });
  }

  function detectAuthorization(text) {
    var normalized = normalizeText(text);
    if (AUTH_POSITIVE_PATTERNS.some(function (pattern) { return pattern.test(normalized); })) return "sim";
    if (AUTH_NEGATIVE_PATTERNS.some(function (pattern) { return pattern.test(normalized); })) return "nao";
    return "incerto";
  }

  function detectSupportReply(text) {
    var normalized = normalizeText(text);
    return SUPPORT_REPLY_PATTERNS.some(function (pattern) {
      return pattern.test(normalized);
    });
  }

  function extractDomains(text) {
    var raw = String(text || "");
    var matches = raw.match(/\b(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\.[a-z]{2,})?\b/gi) || [];
    var filtered = matches.filter(function (domain) {
      var lower = String(domain || "").toLowerCase();
      if (lower.indexOf("staycloud.com.br") !== -1) return false;
      if (lower.indexOf("supporttickets") !== -1) return false;
      return domain.length >= 6;
    });
    return unique(filtered);
  }

  function initialClassify(record) {
    var text = [
      record.ticket_id,
      record.department,
      record.subject,
      record.requester,
      record.status,
      record.lastReply,
      record.rawText
    ].join(" ");
    var plugins = detectPluginsFromText(text);
    var hasPluginWord = /\bplugins?\b/i.test(text);
    var hasActivation = detectActivationIntent(text);
    var negativeTopic = detectNegativeTopic(text);
    var completion = detectCompletion(text);
    var statusText = normalizeText(record.status || record.rawText || "");
    var openStatus = /\b(open|answered|in progress|customer reply|pending)\b/.test(statusText);
    var closedStatus = /\b(closed|resolved)\b/.test(statusText);
    var vpsReactivation = /\breativacao de vps\b|\breativar vps\b|\bvps\b/.test(normalizeText(text)) && !hasActivation;

    if (vpsReactivation || completion || closedStatus) {
      return {
        initialClassification: "IGNORAR",
        initialReason: vpsReactivation ? "Reativacao de VPS nao relacionada a plugin." : "Sinal de conclusao ou ticket fechado.",
      };
    }

    if (negativeTopic && !hasActivation && !plugins.length && !hasPluginWord) {
      return {
        initialClassification: "IGNORAR",
        initialReason: "Tema nao relacionado a plugin WordPress.",
      };
    }

    if (openStatus && hasActivation && plugins.length) {
      return {
        initialClassification: "ALTA CONFIANCA",
        initialReason: "Pedido claro de ativacao com plugin conhecido na listagem.",
      };
    }

    if (plugins.length || hasActivation || hasPluginWord || negativeTopic) {
      return {
        initialClassification: "REVISAR",
        initialReason: "Pode ser ativacao, instalacao, licenca, erro ou pedido generico.",
      };
    }

    return {
      initialClassification: "IGNORAR",
      initialReason: "Tema nao relacionado a plugin WordPress.",
    };
  }

  function parseListPage(doc, sourceUrl) {
    var rows = extractVisibleRows(doc);
    return rows.map(function (record) {
      var initial = initialClassify(record);
      var plugins = detectPluginsFromText([record.subject, record.rawText].join(" "));
      var candidate = initial.initialClassification !== "IGNORAR";
      var ticketUrl = record.ticketLink || "";
      var normalizedStatus = normalizeText(record.status || "");
      var openStatus = /\b(open|answered|in progress|customer reply|pending)\b/.test(normalizedStatus);
      var displayClassification = initial.initialClassification;
      var nextAction = displayClassification === "ALTA CONFIANCA"
        ? "Escanear em profundidade e validar dominio/autorizacao."
        : (candidate ? "Revisar manualmente a listagem e abrir o ticket." : "Ignorar.");
      return {
        ticket_id: record.ticket_id,
        subject: record.subject,
        department: record.department,
        requester: record.requester,
        status: record.status,
        lastReply: record.lastReply,
        ticketLink: ticketUrl,
        sourceUrl: sourceUrl,
        sourceType: record.sourceType,
        initialClassification: displayClassification,
        initialReason: initial.initialReason,
        pluginsDetected: plugins,
        candidate: candidate,
        openStatus: openStatus,
        deepScanned: false,
        finalClassification: candidate ? "REVISAR MANUALMENTE" : "IGNORAR",
        domainDetected: "nao detectado",
        authorizationDetected: "incerto",
        detailStatus: "nao analisado",
        supportReplyDetected: "incerto",
        nextAction: nextAction,
        notes: initial.initialReason,
        htmlTitle: "",
      };
    });
  }

  function getTicketTitle(doc) {
    var candidates = [
      doc.querySelector("h1"),
      doc.querySelector("h2"),
      doc.querySelector("title"),
      doc.querySelector(".breadcrumb"),
    ];
    for (var i = 0; i < candidates.length; i += 1) {
      if (candidates[i]) {
        var text = textOf(candidates[i]);
        if (text) return text;
      }
    }
    return textOf(doc.body).slice(0, 180);
  }

  function parseDetailPage(doc, sourceUrl, fallbackRecord) {
    var bodyText = textOf(doc.body);
    var subject = fallbackRecord && fallbackRecord.subject ? fallbackRecord.subject : getTicketTitle(doc);
    var ticketId = fallbackRecord && fallbackRecord.ticket_id ? fallbackRecord.ticket_id : extractTicketId(getTicketTitle(doc) + " " + bodyText);
    var department = fallbackRecord && fallbackRecord.department ? fallbackRecord.department : "";
    var status = fallbackRecord && fallbackRecord.status ? fallbackRecord.status : "";
    var requester = fallbackRecord && fallbackRecord.requester ? fallbackRecord.requester : "";
    var plugins = detectPluginsFromText(subject + " " + bodyText);
    var domains = extractDomains(bodyText);
    var authorization = detectAuthorization(bodyText);
    var completion = detectCompletion(bodyText);
    var supportReply = detectSupportReply(bodyText);
    var activation = detectActivationIntent(subject + " " + bodyText);
    var negativeTopic = detectNegativeTopic(subject + " " + bodyText);
    var vpsReactivation = /\breativacao de vps\b|\breativar vps\b|\bvps\b/.test(normalizeText(subject + " " + bodyText)) && !activation;
    var openStatus = /\b(open|answered|in progress|customer reply|pending)\b/.test(normalizeText(status + " " + bodyText));
    var finalClassification = "REVISAR MANUALMENTE";
    var nextAction = "Revisar manualmente antes de qualquer acao.";
    var reason = "Candidato precisa de validacao adicional.";

    if (vpsReactivation || completion || /\b(closed|resolved)\b/.test(normalizeText(status + " " + bodyText)) || supportReply && completion) {
      finalClassification = "IGNORAR";
      nextAction = "Ignorar. Nao e candidato operacional.";
      reason = vpsReactivation ? "Reativacao de VPS ou tema equivalente." : "Sinal de conclusao ou ticket fechado.";
    } else if (openStatus && activation && plugins.length && domains.length && authorization === "sim") {
      finalClassification = "PRONTO PARA APROVACAO";
      nextAction = "Validar dominio/servico antes de ativar.";
      reason = "Ativacao clara, plugin conhecido, dominio e autorizacao detectados.";
    } else if (!plugins.length && !activation) {
      finalClassification = "IGNORAR";
      nextAction = "Ignorar. Tema nao relacionado a plugin.";
      reason = "Nao ha pedido claro de plugin WordPress.";
    } else {
      if (!domains.length) reason = "Falta dominio no ticket.";
      else if (authorization !== "sim") reason = "Autorizacao ausente ou incerta.";
      else if (!plugins.length) reason = "Plugin nao identificado.";
      else if (negativeTopic) reason = "Assunto ambíguo ou fora do escopo.";
      nextAction = "Revisar manualmente antes de qualquer acao.";
    }

    return {
      ticket_id: ticketId,
      subject: subject,
      department: department,
      requester: requester,
      status: status,
      lastReply: fallbackRecord && fallbackRecord.lastReply ? fallbackRecord.lastReply : "",
      ticketLink: sourceUrl,
      sourceUrl: sourceUrl,
      sourceType: "detail",
      initialClassification: fallbackRecord ? fallbackRecord.initialClassification : "REVISAR",
      initialReason: fallbackRecord ? fallbackRecord.initialReason : "",
      pluginsDetected: plugins,
      candidate: true,
      openStatus: openStatus,
      deepScanned: true,
      finalClassification: finalClassification,
      domainDetected: domains.length ? domains[0] : "nao detectado",
      authorizationDetected: authorization,
      detailStatus: completion ? "concluido" : (supportReply ? "resposta do suporte detectada" : "em aberto"),
      supportReplyDetected: supportReply ? "sim" : "nao",
      nextAction: nextAction,
      notes: reason,
      htmlTitle: getTicketTitle(doc),
    };
  }

  function upsertResult(result) {
    var index = state.results.findIndex(function (item) {
      return item.ticket_id && result.ticket_id && item.ticket_id === result.ticket_id;
    });
    if (index >= 0) {
      state.results[index] = Object.assign({}, state.results[index], result);
    } else {
      state.results.push(result);
    }
  }

  function annotateVisibleRows(records) {
    if (!document.querySelector("table")) return;
    var candidates = Array.from(document.querySelectorAll("table tr")).filter(function (row) {
      return row.querySelectorAll("td").length > 0 && visible(row);
    });
    candidates.forEach(function (row) {
      var text = textOf(row);
      var ticketId = extractTicketId(text);
      var record = records.find(function (item) {
        return item.ticket_id && ticketId && item.ticket_id === ticketId;
      });
      if (!record) return;
      row.classList.remove("whmcs-autonomous-high", "whmcs-autonomous-review");
      row.removeAttribute("data-whmcs-autonomous-badge");
      if (record.initialClassification === "ALTA CONFIANCA") {
        row.classList.add("whmcs-autonomous-high");
      } else if (record.initialClassification === "REVISAR") {
        row.classList.add("whmcs-autonomous-review");
      }
      row.setAttribute("data-whmcs-autonomous-classification", record.initialClassification);
      row.setAttribute("data-whmcs-autonomous-ticket", record.ticket_id || "");
      var subjectCell = row.querySelectorAll("td")[2] || row.querySelector("td");
      if (subjectCell && (record.initialClassification === "ALTA CONFIANCA" || record.initialClassification === "REVISAR")) {
        var badge = subjectCell.querySelector("[data-whmcs-autonomous-badge='1']");
        if (!badge) {
          badge = document.createElement("span");
          badge.setAttribute("data-whmcs-autonomous-badge", "1");
          badge.className = "whmcs-autonomous-badge " + (record.initialClassification === "ALTA CONFIANCA" ? "high" : "review");
          badge.textContent = record.initialClassification === "ALTA CONFIANCA" ? "ATENCAO PLUGIN" : "REVISAR PLUGIN";
          subjectCell.appendChild(badge);
        }
      }
    });
  }

  function parseHtmlDocument(html, url) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, "text/html");
    Object.defineProperty(doc, "location", {
      value: new URL(url, window.location.href),
      configurable: true
    });
    return doc;
  }

  function getCurrentListLikeDocument() {
    return document;
  }

  function recordResults(records) {
    records.forEach(function (record) {
      upsertResult(record);
      if (record.candidate) state.candidatesFound += 1;
      if (record.finalClassification === "PRONTO PARA APROVACAO") state.readyForApproval += 1;
      else if (record.finalClassification === "REVISAR MANUALMENTE") state.reviewManual += 1;
      else state.ignored += 1;
    });
  }

  function refreshCountersFromResults() {
    state.readyForApproval = state.results.filter(function (item) {
      return item.finalClassification === "PRONTO PARA APROVACAO";
    }).length;
    state.reviewManual = state.results.filter(function (item) {
      return item.finalClassification === "REVISAR MANUALMENTE";
    }).length;
    state.ignored = state.results.filter(function (item) {
      return item.finalClassification === "IGNORAR";
    }).length;
    state.candidatesFound = state.results.filter(function (item) {
      return item.candidate;
    }).length;
  }

  function runCurrentScan() {
    try {
      if (!isAllowedPage()) {
        setMessage("URL fora do escopo permitido. Nenhuma acao executada.");
        return;
      }
      var doc = getCurrentListLikeDocument();
      if (!doc.querySelector("table")) {
        setMessage("Scanner carregado. Nenhuma tabela de tickets encontrada ainda.");
        updatePanel();
        return;
      }
      state.results = [];
      state.errorsList = [];
      state.listPagesScanned = 0;
      state.detailPagesScanned = 0;
      state.errors = 0;
      state.candidatesFound = 0;
      state.readyForApproval = 0;
      state.reviewManual = 0;
      state.ignored = 0;
      state.scannedUrls = new Set();
      state.deepScannedUrls = new Set();
      var records;
      if (isViewTicketPage()) {
        records = [parseDetailPage(doc, window.location.href, null)];
        state.detailPagesScanned = 1;
        recordResults(records);
      } else {
        records = parseListPage(doc, window.location.href);
        state.listPagesScanned = 1;
        recordResults(records);
        annotateVisibleRows(records);
      }
      refreshCountersFromResults();
      updatePanel();
      setMessage("Pagina atual escaneada em modo read-only.");
    } catch (error) {
      state.errors += 1;
      state.errorsList.push(String(error && error.message ? error.message : error));
      setMessage("Falha ao escanear pagina atual.");
      updatePanel();
    }
  }

  function collectPaginationUrls(doc) {
    var anchors = Array.from(doc.querySelectorAll("a[href]"));
    var urls = [];
    anchors.forEach(function (anchor) {
      var href = anchor.getAttribute("href") || "";
      var abs = absoluteUrl(href);
      if (!abs) return;
      var parsed = new URL(abs);
      if (parsed.origin !== window.location.origin) return;
      if (parsed.pathname !== LIST_PATH) return;
      var normalizedText = normalizeText(textOf(anchor));
      var query = parsed.search.toLowerCase();
      var looksPaged = /page=|p=|start=|offset=|paged=/.test(query) || /\bnext\b|\bproximo\b|\bseguinte\b/.test(normalizedText) || />/.test(textOf(anchor));
      if (!looksPaged) return;
      if (abs === window.location.href) return;
      urls.push(abs);
    });
    urls = unique(urls);
    urls.sort(function (a, b) {
      var pa = new URL(a).searchParams;
      var pb = new URL(b).searchParams;
      var na = parseInt(pa.get("page") || pa.get("p") || pa.get("start") || "0", 10) || 0;
      var nb = parseInt(pb.get("page") || pb.get("p") || pb.get("start") || "0", 10) || 0;
      return na - nb;
    });
    return urls;
  }

  async function runNextPagesScan() {
    setMessage("Varredura de proximas paginas desativada nesta etapa smoke test.");
    updatePanel();
  }

  async function runDeepScan() {
    setMessage("Leitura em profundidade desativada nesta etapa smoke test.");
    updatePanel();
  }

  function buildQueueText() {
    var entries = state.results.filter(function (item) {
      var classification = currentOperationalClassification(item);
      return classification === "PRONTO PARA APROVACAO" || classification === "REVISAR MANUALMENTE" || classification === "ALTA CONFIANCA";
    });
    var lines = [
      "Fila de ativacao de plugins - WHMCS",
      "",
    ];
    entries.forEach(function (item, index) {
      lines.push((index + 1) + ". Ticket: " + (item.ticket_id || "(sem id)"));
      lines.push("Assunto: " + (item.subject || "-"));
      lines.push("Plugins: " + (item.pluginsDetected.length ? item.pluginsDetected.join(", ") : "-"));
      lines.push("Dominio detectado: " + (item.domainDetected || "nao detectado"));
      lines.push("Autorizacao: " + (item.authorizationDetected || "incerto"));
      lines.push("Classificacao: " + currentOperationalClassification(item));
      lines.push("Proxima acao: " + (item.nextAction || "-"));
      if (index < entries.length - 1) lines.push("");
    });
    lines.push("");
    lines.push("Alertas:");
    lines.push("- Nenhum plugin foi ativado.");
    lines.push("- Nenhum ticket foi alterado.");
    lines.push("- A automacao apenas leu paginas do WHMCS.");
    return lines.join("\n");
  }

  async function copyQueue() {
    var text = buildQueueText();
    try {
      await navigator.clipboard.writeText(text);
      setMessage("Fila copiada para a area de transferencia.");
    } catch (error) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      setMessage("Fila copiada com fallback local.");
    }
  }

  function buildMarkdownReport() {
    var list = state.results.slice();
    var lines = [
      "# Scanner Autonomo WHMCS",
      "",
      "## Resumo",
      "- Paginas de listagem lidas: " + state.listPagesScanned,
      "- Paginas internas lidas: " + state.detailPagesScanned,
      "- Candidatos encontrados: " + state.candidatesFound,
      "- Prontos para aprovacao: " + state.readyForApproval,
      "- Revisar manualmente: " + state.reviewManual,
      "- Ignorados: " + state.ignored,
      "- Erros de leitura: " + state.errors,
      "",
      "## Candidatos",
      "",
      "| Ticket ID | Assunto | Departamento | Solicitante | Status | Plugins | Dominio | Autorizacao | Classificacao Final | Proxima Acao |",
      "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |"
    ];
    list.forEach(function (item) {
      if (item.finalClassification === "IGNORAR") return;
      var classification = currentOperationalClassification(item);
      lines.push(
        "| " +
          escapeMarkdown(item.ticket_id || "-") +
          " | " +
          escapeMarkdown(item.subject || "-") +
          " | " +
          escapeMarkdown(item.department || "-") +
          " | " +
          escapeMarkdown(item.requester || "-") +
          " | " +
          escapeMarkdown(item.status || "-") +
          " | " +
          escapeMarkdown(item.pluginsDetected.length ? item.pluginsDetected.join(", ") : "-") +
          " | " +
          escapeMarkdown(item.domainDetected || "nao detectado") +
          " | " +
          escapeMarkdown(item.authorizationDetected || "incerto") +
          " | " +
          escapeMarkdown(classification || "-") +
          " | " +
          escapeMarkdown(item.nextAction || "-") +
          " |"
      );
    });
    lines.push("");
    lines.push("## Alertas de seguranca");
    lines.push("- Nenhum plugin foi ativado.");
    lines.push("- Nenhum ticket foi alterado.");
    lines.push("- Nenhum formulario foi submetido.");
    lines.push("- Nenhum clique em botao de acao foi executado.");
    lines.push("- A leitura ocorreu apenas por pagina same-origin do painel staycloud.");
    return lines.join("\n");
  }

  function escapeMarkdown(value) {
    return String(value || "").replace(/\|/g, "\\|").replace(/\n/g, " ");
  }

  function downloadText(filename, text) {
    var blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function exportReport() {
    var stamp = new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);
    var text = buildMarkdownReport();
    downloadText("scanner-autonomo-whmcs-" + stamp + ".md", text);
    setMessage("Relatorio exportado localmente.");
  }

  function clearAnnotations() {
    document.querySelectorAll(".whmcs-autonomous-high, .whmcs-autonomous-review").forEach(function (row) {
      row.classList.remove("whmcs-autonomous-high", "whmcs-autonomous-review");
    });
    document.querySelectorAll("[data-whmcs-autonomous-badge='1']").forEach(function (badge) {
      badge.remove();
    });
  }

  function clearAll() {
    state.listPagesScanned = 0;
    state.detailPagesScanned = 0;
    state.candidatesFound = 0;
    state.readyForApproval = 0;
    state.reviewManual = 0;
    state.ignored = 0;
    state.errors = 0;
    state.results = [];
    state.errorsList = [];
    state.scannedUrls = new Set();
    state.deepScannedUrls = new Set();
    state.statusMessage = "Marcacoes limpadas.";
    clearAnnotations();
    updatePanel();
  }

  function detectCurrentPageAndSeed() {
    if (!isAllowedPage()) {
      return false;
    }
    return true;
  }

  function safeInit() {
    try {
      if (!detectCurrentPageAndSeed()) return;
      renderSmokePanel();
      var doc = getCurrentListLikeDocument();
      if (!doc.querySelector("table")) {
        var panel = renderSmokePanel();
        var message = panel.querySelector("[data-smoke-message]");
        if (message) message.textContent = "Scanner carregado. Nenhuma tabela de tickets encontrada ainda.";
        return;
      }
      renderPanel();
      runCurrentScan();
    } catch (error) {
      console.error("[WHMCS Autonomous Scanner] erro no init", error);
      try {
        var panel = renderSmokePanel();
        var message = panel.querySelector("[data-smoke-message]");
        if (message) message.textContent = "Erro no init: " + String(error && error.message ? error.message : error);
      } catch (secondaryError) {
        console.error("[WHMCS Autonomous Scanner] erro ao exibir falha de init", secondaryError);
      }
    }
  }

  function bootstrap() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", safeInit, { once: true });
    }
    setTimeout(safeInit, 500);
    setTimeout(safeInit, 1500);
    setTimeout(safeInit, 3000);
    safeInit();
  }

  window.WHMCSTicketsAutonomousScanner = {
    scanCurrentPage: runCurrentScan,
    scanNextPages: runNextPagesScan,
    scanCandidatesInDepth: runDeepScan,
    copyQueue: copyQueue,
    exportReport: exportReport,
    clear: clearAll,
    renderPanel: renderPanel,
    safeInit: safeInit,
  };

  bootstrap();
})();
