/* Theme toggle, PT/EN switch and the inline-SVG charts. No build step, no dependencies. */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];

  // ---- theme: follows the OS until the visitor picks one ----
  const root = document.documentElement;
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  $('#theme').addEventListener('click', () => {
    root.dataset.theme = isDark() ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
  });

  // ---- mobile menu ----
  const top = $('#top'), menuBtn = $('#menu');
  const setMenu = open => { top.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', String(open)); };
  menuBtn.addEventListener('click', () => setMenu(!top.classList.contains('open')));
  document.addEventListener('click', ev => { if (top.classList.contains('open') && !ev.target.closest('#nav') && !ev.target.closest('#menu')) setMenu(false); });
  $('#nav').addEventListener('click', ev => { if (ev.target.closest('a')) setMenu(false); });

  // ---- i18n: the HTML is Portuguese; English comes from this table ----
  const EN = {
    skip: 'Skip to content', nav_problem: 'Problem', nav_how: 'How it works', nav_results: 'Results', nav_tasks: 'Activities', nav_team: 'Team',
    hero_kick: 'Applied AI Laboratory · UNIPAMPA · 2026',
    hero_h1: 'From the scanner PDF to structured data, with the model inside the organization.',
    hero_lead: 'MulitaMiner reads PDF reports from vulnerability scanners and returns one record per finding, in a single schema. The language model that does the extraction runs locally, fine-tuned on data from the scanner itself.',
    hero_cta: 'See the results', hero_cta2: 'How it works',
    st_scanners: 'scanners supported', st_train: 'training examples, no manual labelling', st_test: 'vulnerabilities in the test set, 8 reports', st_recall: 'found by the fine-tuned local model (recall)',
    pb_kick: 'The problem', pb_h2: 'The report arrives as text, not as data.',
    pb1_h: 'One format per tool', pb1_p: 'Summary in OpenVAS, Synopsis in Nessus. Same information, different names and layouts.',
    pb2_h: 'Triage is manual reading', pb2_p: 'Consolidating, comparing and prioritising means transcribing findings by hand, report by report.',
    pb3_h: 'The cloud is no easy way out', pb3_p: 'The report is the map of the attack surface: hosts, ports and flaws. Sending it out is a risk (Brazilian data protection law, art. 46).',
    ob_kick: 'Goal', ob_h: 'One PDF in. One schema out.', ob_p: 'Ten fields shared by every scanner, filled by the model from the report text.',
    f_name: 'name', f_sev: 'severity', f_port: 'port', f_proto: 'protocol', f_desc: 'description', f_sol: 'solution', f_imp: 'impact', f_ref: 'references', f_src: 'source',
    ob_cap: 'Different formats in, the same fields out. A real example from both scanners on the same service.',
    how_kick: 'How it works', how_h2: 'Fixed pipeline, swappable model.',
    how_sub: 'Five stages. The finding count is fixed before any call to the model, and only one stage uses AI.',
    s1_h: 'Read', s1_p: 'Text comes out of the PDF without OCR (pypdfium2). Page headers and breaks are removed before the model sees anything.',
    s2_h: 'Segment', s2_p: 'One regular expression per scanner finds the line that opens each finding. One block per finding, with a fixed id: 34 blocks in the PDF, 34 rows in the scanner\'s spreadsheet.',
    s3_h: 'Extract', s3_p: 'Whole blocks go to the model in batches, with a JSON schema. Block 21 comes back as block 21, or the answer is rejected and redone in smaller batches.',
    s4_h: 'Consolidate', s4_p: 'Severity and CVSS normalised, duplicates merged. Host, port and protocol come from rules, not from the model.',
    s5_h: 'Export', s5_p: 'One record per finding, as JSON, XLSX, CSV, SARIF, CSAF or DefectDojo. Switching models is switching one argument.',
    how_note_b: 'A new scanner:', how_note: 'one JSON configuration file and one prompt, no code changes.',
    me_kick: 'Method', me_h2: 'The ground truth comes from the tool itself.',
    me_sub: 'The scanner exports the PDF and the spreadsheet of the same scan. Pairing the two by host and finding id turns every vulnerability into a question-and-answer pair, with no manual labelling.',
    me_data_h: 'Training data', me_t1: 'reports: PDF + machine export', me_t2: 'examples · 6,187 train / 654 validation',
    ch_train_t: 'Training examples per scanner',
    me_cap: '80% is OpenVAS: that is why evaluation is reported per scanner, not only in aggregate.',
    me_models_h: 'Three models, the same test',
    m_local: 'Local', m_local_p: 'Qwen2.5 1.5B, no training. Runs on a GPU inside the organization; it only gets examples in the prompt.',
    m_tuned: 'Fine-tuned', m_tuned_p: 'The same Qwen2.5 1.5B, fine-tuned with 4-bit QLoRA on the 6,841 examples. The proposed system.',
    m_cloud: 'Cloud', m_cloud_p: 'DeepSeek V4.1 Flash through the API, few-shot. The quality ceiling, at the cost of the report leaving the organization.',
    me_test: 'Test: 8 unseen reports, held out of training, with 1,028 vulnerabilities. OpenVAS 318 (3 reports), Nessus 268 (1), Qualys 419 (1), ZAP 23 (3).',
    re_kick: 'Results', re_h2: 'Almost as good as the cloud, in a third of the time, without the report leaving.',
    re_sub: 'Average of 5 runs over the 8 test reports. Fine-tuning recovers almost all of the gap between the local model and the cloud one.',
    cmp_t: 'The three side by side', cmp_s: '8 test reports · average of 5 runs', cmp_tag: 'proposed system',
    c_found: 'Vulnerabilities found', c_invented: 'Vulnerabilities invented', c_blank: 'Blank fields', c_time: 'Time for the 8 reports', c_cost: 'API cost', c_inside: 'Inside the organization', yes: 'yes', no: 'no', cost96: 'US$ 0.96',
    ch_recall_t: 'Vulnerabilities found, per scanner', ch_recall_s: 'Recall: findings in the ground truth that became a record, in percent.',
    ch_text_t: 'Description: how closely the text matches', ch_text_s: 'ROUGE-L between the extracted description and the one in the scanner report, from 0 to 1: word-level overlap.',
    tb_short_t: 'Short fields: exact match', tb_short_s: 'Equal to the ground truth or wrong. A dash: the scanner has no such field.',
    tb_field: 'Field', f_sev_c: 'Severity', f_port_c: 'Port', f_id_c: 'Test id', na: 'not applicable',
    tb_err_t: 'Errors by type', tb_err_s: 'Occurrences across the 8 reports. The fine-tuned model trades blank fields for a new error: the block number.',
    tb_type: 'Type', e_blank: 'Blank field', e_cut: 'Truncated text', e_sev: 'Wrong severity', e_block: 'Wrong block number', e_lost: 'Vulnerability missed', e_extra: 'Extra text',
    fd1_b: 'Where the fine-tuned model fails.', fd1: 'On OpenVAS, the scanner with the most training examples, the description is left blank in half of the findings (local 90%, cloud 100% filled).',
    fd2_b: 'Counting instead of reading.', fd2: 'In 166 batches the model answered "block 1, block 2" for blocks 6 and 7. A number outside the batch is discarded and the batch redone, so it never becomes a wrong record.',
    ph_prop: 'Proposal', ph_build: 'Build', ph_res: 'Results',
    at_kick: 'Activities', at_h2: 'The project, task by task.', at_sub: 'The course deliverables, in order: documents, presentations and code.',
    t1_h: 'Ideation with AI', t1_p: 'Choosing the topic and the first proposal, using AI tools to explore problems and solutions.',
    t2_h: 'Investigation and feasibility', t2_p: 'Problem, data, AI approach, related work and feasibility: the revised proposal.',
    t3_h: 'Specification and plan', t3_p: 'Problem specification, data, architecture, MVP, experimental plan, success criteria, schedule and risks.',
    t4_h: 'Proposal', t4_p: 'Problem, goal, architecture, AI decisions, data and an eight-step experimental plan.',
    t5_h: 'Initial development', t5_p: 'The first working version of the tool, delivered as a code repository.',
    t6_h: 'Context', t6_p: 'What a vulnerability scanner is and why its reports became a problem.',
    t7_h: 'How it works', t7_p: 'How a PDF becomes data, stage by stage, following one real finding, and how we will measure it.',
    t8_h: 'Results with a cloud model', t8_p: 'DeepSeek V4.1 Flash on the 8 test reports: the quality reference.',
    t9_h: 'Results with a local model', t9_p: 'Qwen2.5 1.5B without training: the same test, without the report leaving the organization.',
    t10_h: 'Results with the fine-tuned model', t10_p: 'The local model trained on the ground truth, and the three side by side.',
    tm_kick: 'Team', tm_h2: 'Who made it.',
    tm_cap: 'Applied AI Laboratory course, Federal University of Pampa, 2026. MulitaMiner is also a research project of the group; the code and the model are public.',
    lk_demo: 'Try the demo ↗', hero_demo: 'Try the demo ↗',
    lk_code: 'Code on GitHub ↗', lk_model: 'Model on Hugging Face ↗',
    ft: 'Applied AI Laboratory · UNIPAMPA · 2026', ft_fine: 'Beatriz Machado, Cristhian Kapelinski and Guilherme Klauberg',
    title: 'MulitaMiner · Applied AI Laboratory', table: 'Table', chart: 'Chart', slides: 'slides', pages: 'pages',
  };
  // Portuguese strings that live only in the script (everything else is read from the HTML).
  const PT = { title: document.title, table: 'Tabela', chart: 'Gráfico', slides: 'slides', pages: 'páginas', ch_train_t: 'Exemplos de treino por scanner',
    tb_field: 'Campo', f_sev_c: 'Severidade', f_port_c: 'Porta', f_id_c: 'Id do teste', na: 'não se aplica' };
  $$('[data-i18n]').forEach(el => { PT[el.dataset.i18n] = el.innerHTML; });
  let lang = root.lang === 'en' ? 'en' : 'pt-BR';
  const t = key => (lang === 'en' ? EN : PT)[key] ?? PT[key] ?? key;
  function fmt(v, d) { return v.toLocaleString(lang === 'en' ? 'en-US' : 'pt-BR', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }
  const applyLang = () => {
    root.lang = lang;
    document.title = t('title');
    $$('[data-i18n]').forEach(el => { const v = t(el.dataset.i18n); if (v !== undefined) el.innerHTML = v; });
    $$('.task .meta').forEach(el => { el.textContent = el.textContent.replace(/slides|pages/, t('slides')).replace(/páginas|pages/, t('pages')); });
    $$('[data-num]').forEach(el => { el.textContent = fmt(+el.dataset.num); });
    $$('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    // model name over each cell when the comparison table stacks on narrow screens
    $$('.cmp tbody tr').forEach(tr => $$('td', tr).forEach((td, k) => { td.dataset.model = SERIES[k].name(); }));
    drawCharts();
  };
  $$('.lang button').forEach(b => b.addEventListener('click', () => {
    lang = b.dataset.lang; try { localStorage.setItem('lang', lang === 'en' ? 'en' : 'pt'); } catch (e) {}
    applyLang();
  }));

  // ---- charts: thin grouped columns, 4px rounded caps, hairline grid, legend, hover tooltip, table twin ----
  const SERIES = [
    { key: 'local', name: () => t('m_local') },
    { key: 'tuned', name: () => t('m_tuned') },
    { key: 'cloud', name: () => t('m_cloud') },
  ];
  const SCANNERS = ['OpenVAS', 'Nessus', 'Qualys', 'ZAP'];
  const DATA = {
    recall: { cats: SCANNERS, max: 100, step: 25, unit: '%', dec: 0,
      values: { local: [95, 90, 90, 96], tuned: [99, 97, 96, 100], cloud: [97, 100, 100, 100] } },
    text: { cats: SCANNERS, max: 1, step: 0.25, unit: '', dec: 2,
      values: { local: [0.86, 0.00, 0.75, 0.70], tuned: [0.50, 0.99, 0.95, 1.00], cloud: [0.79, 1.00, 0.98, 1.00] } },
    train: { cats: ['OpenVAS', 'Qualys', 'Nessus', 'ZAP'], max: 6000, step: 2000, unit: '', dec: 0, single: true,
      values: { tuned: [5459, 910, 381, 89] } },
  };
  // Short fields, exact match per scanner; null = the scanner has no such field.
  const SHORT = [
    { g: 'f_sev_c', values: { local: [100, 96, 57, 100], tuned: [100, 99, 95, 100], cloud: [100, 100, 100, 100] } },
    { g: 'f_port_c', values: { local: [100, 0, 0, null], tuned: [100, 68, 67, null], cloud: [99, 100, 100, null] } },
    { g: 'f_id_c', values: { local: [null, 99, 87, 77], tuned: [null, 93, 79, 96], cloud: [null, 100, 100, 100] } },
  ];
  const tip = $('#tip');
  const showTip = (ev, text) => { tip.textContent = text; tip.hidden = false; moveTip(ev); };
  const moveTip = ev => { tip.style.left = (ev.clientX + 12) + 'px'; tip.style.top = (ev.clientY - 30) + 'px'; };
  const hideTip = () => { tip.hidden = true; };

  // Column with a 4px rounded top, square at the baseline.
  const bar = (x, y, w, h, cls) => {
    if (h <= 0) return '';
    const r = Math.min(4, w / 2, h);
    return `<path class="bar ${cls}" d="M${x} ${y + h} V${y + r} Q${x} ${y} ${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h} Z"/>`;
  };
  const width = el => Math.max(300, Math.min(560, el.clientWidth || 560));

  // One grouped-column plot. Returns the SVG markup and the hover targets.
  function plot(spec, W, H, series) {
    const padL = 44, padR = 8, padT = 16, padB = 30;
    const plotW = W - padL - padR, plotH = H - padT - padB;
    const slot = plotW / spec.cats.length;
    const gap = 2, barW = Math.min(24, (slot * 0.62 - gap * (series.length - 1)) / series.length);
    const groupW = barW * series.length + gap * (series.length - 1);
    const y = v => padT + plotH - (v / spec.max) * plotH;
    let g = '<g class="grid">';
    for (let v = 0; v <= spec.max + 1e-9; v += spec.step) g += `<line x1="${padL}" x2="${W - padR}" y1="${y(v)}" y2="${y(v)}"/><text x="${padL - 8}" y="${y(v) + 4}" text-anchor="end">${fmt(v, spec.max <= 1 ? 2 : 0)}${spec.unit}</text>`;
    g += '</g>';
    let bars = '', labels = '', cats = '';
    const hits = [];
    spec.cats.forEach((c, i) => {
      const gx = padL + slot * i + (slot - groupW) / 2, cx = padL + slot * i + slot / 2;
      cats += `<text class="cat" x="${cx}" y="${H - 8}" text-anchor="middle">${c}</text>`;
      if (series.every(s => spec.values[s.key][i] == null)) {   // the scanner has no such field
        labels += `<text class="na" x="${cx}" y="${y(0) - 8}" text-anchor="middle">—</text>`;
        hits.push({ x: gx - gap, w: groupW + gap * 2, text: `${c}: ${t('na')}` });
        return;
      }
      const parts = [];
      series.forEach((s, k) => {
        const v = spec.values[s.key][i], x = gx + k * (barW + gap);
        if (v == null) return;
        const tp = y(v);
        bars += bar(x, tp, barW, padT + plotH - tp, s.key);
        if (spec.single || s.key === 'tuned' || v === 0) labels += `<text class="val" x="${x + barW / 2}" y="${tp - 5}" text-anchor="middle">${fmt(v, spec.dec)}${spec.unit}</text>`;
        parts.push(`${s.name()} ${fmt(v, spec.dec)}${spec.unit}`);
      });
      hits.push({ x: gx - gap, w: groupW + gap * 2, text: `${c}: ${spec.single ? parts[0].replace(/^\S+ /, '') : parts.join(' · ')}` });
    });
    const hitRects = hits.map((h, i) => `<rect class="hit" data-i="${i}" x="${h.x}" y="${padT}" width="${h.w}" height="${plotH}" tabindex="0"><title>${h.text}</title></rect>`).join('');
    const svg = `<svg viewBox="0 0 ${W} ${H}" role="img">${g}<g class="axis"><line x1="${padL}" x2="${W - padR}" y1="${y(0)}" y2="${y(0)}"/></g>${bars}${labels}${cats}${hitRects}</svg>`;
    return { svg, hits };
  }
  const legendOf = series => `<div class="legend">${series.map(s => `<span><i class="sw ${s.key}"></i>${s.name()}</span>`).join('')}</div>`;
  const cell = (v, spec) => v == null ? '—' : fmt(v, spec.dec) + spec.unit;
  function wire(el, hitsBySvg) {
    $$('svg', el).forEach((svg, n) => {
      svg.addEventListener('mousemove', ev => { const r = ev.target.closest('.hit'); if (r) showTip(ev, hitsBySvg[n][+r.dataset.i].text); else hideTip(); });
      svg.addEventListener('mouseleave', hideTip);
    });
    const table = $('table.twin', el), toggle = $('.toggle', el), plots = $('.plots', el);
    toggle.addEventListener('click', () => { table.hidden = !table.hidden; plots.hidden = !table.hidden; toggle.textContent = table.hidden ? t('table') : t('chart'); });
  }

  function drawChart(el, spec) {
    const series = spec.single ? [SERIES[1]] : SERIES;
    const { svg, hits } = plot(spec, width(el), 260, series);
    const title = el.dataset.titleKey ? `<div class="kick" style="margin:0 0 .5rem">${t(el.dataset.titleKey)}</div>` : '';
    const twin = `<table class="twin" hidden><thead><tr><th></th>${series.map(s => `<th>${spec.single ? t('ch_train_t') : s.name()}</th>`).join('')}</tr></thead><tbody>${spec.cats.map((c, i) => `<tr><th>${c}</th>${series.map(s => `<td>${cell(spec.values[s.key][i], spec)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    el.innerHTML = `${title}${spec.single ? '' : legendOf(series)}<div class="plots">${svg}</div><button type="button" class="toggle">${t('table')}</button>${twin}`;
    wire(el, [hits]);
  }

  // Short fields: three small multiples (one per field), same scale and legend.
  function drawMultiples(el) {
    const hitsBySvg = [];
    const plots = SHORT.map(f => {
      const spec = { cats: SCANNERS, max: 100, step: 50, unit: '%', dec: 0, values: f.values };
      const { svg, hits } = plot(spec, width(el), 150, SERIES);
      hitsBySvg.push(hits);
      return `<div class="multi"><div class="kick">${t(f.g)}</div>${svg}</div>`;
    }).join('');
    const spec = { unit: '%', dec: 0 };
    const twin = `<table class="twin" hidden><thead><tr><th>${t('tb_field')}</th><th>Scanner</th>${SERIES.map(s => `<th>${s.name()}</th>`).join('')}</tr></thead><tbody>${SHORT.map(f => SCANNERS.map((c, i) => `<tr><th>${i === 0 ? t(f.g) : ''}</th><td style="text-align:left">${c}</td>${SERIES.map(s => `<td>${cell(f.values[s.key][i], spec)}</td>`).join('')}</tr>`).join('')).join('')}</tbody></table>`;
    el.innerHTML = `${legendOf(SERIES)}<div class="plots">${plots}</div><button type="button" class="toggle">${t('table')}</button>${twin}`;
    wire(el, hitsBySvg);
  }

  function drawCharts() {
    drawChart($('#chart-train'), DATA.train);
    drawChart($('#chart-recall'), DATA.recall);
    drawChart($('#chart-text'), DATA.text);
    drawMultiples($('#chart-short'));
  }
  // Activities strip: arrows move one card; the right-edge fade goes away at the end.
  const strip = $('#tasks'), prev = $('#tasks-prev'), next = $('#tasks-next');
  const stepOf = () => { const c = strip.querySelector('.task'); return c ? c.getBoundingClientRect().width + 16 : 300; };
  const syncStrip = () => {
    const max = strip.scrollWidth - strip.clientWidth - 1;
    prev.disabled = strip.scrollLeft <= 0; next.disabled = strip.scrollLeft >= max;
    strip.classList.toggle('at-end', strip.scrollLeft >= max);
  };
  prev.addEventListener('click', () => strip.scrollBy({ left: -stepOf(), behavior: 'smooth' }));
  next.addEventListener('click', () => strip.scrollBy({ left: stepOf(), behavior: 'smooth' }));
  strip.addEventListener('scroll', syncStrip, { passive: true });
  addEventListener('resize', syncStrip);
  syncStrip();

  let resizeTimer;
  addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(drawCharts, 150); });
  applyLang();
})();
