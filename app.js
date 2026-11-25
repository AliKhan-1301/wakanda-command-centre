(() => {
"use strict";
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const tag = t => `<span class="tag ${t}" data-tip="${esc(D.types[t].desc)}">${D.types[t].label}</span>`;
const src = s => `<span class="src" data-tip="${esc(D.meta.source)}, slide ${s}">Slide ${s}</span>`;
const clk = c => `<span class="clk ${c}">${c}</span>`;
const usd = v => "$" + Math.round(v).toLocaleString("en-US");
const m2 = v => "$" + v.toFixed(2) + "m";
const color = c => `var(--${c.toLowerCase()})`;
const ev = id => D.evidence.find(e => e.id === id);
const dec = n => D.decisions.find(d => d.n === n);
const fmOk = r => Math.abs(r[2] - r[3]) <= Math.max(5000, 0.01 * r[3]); // workbook rule: within 1% or $5,000
const secHead = (h, p, right = "") => `<div class="sec-head"><div><h2>${h}</h2>${p ? `<p>${p}</p>` : ""}</div>${right}</div>`;
const table = (cols, rows, numCols = []) => `<div class="tblwrap"><table class="tbl"><thead><tr>${cols.map((c, i) => `<th class="${numCols.includes(i) ? "num" : ""}">${c}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr class="${r.cls || ""}">${(r.cells || r).map((c, i) => `<td class="${numCols.includes(i) ? "num" : ""}">${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
// Secondary detail stays one click away; state.open keeps it open across re-renders
const more = (k, title, html) => `<details class="ev more" data-k="${k}" ${state.open[k] ? "open" : ""}><summary><span style="flex:1">${title}</span></summary><div class="body">${html}</div></details>`;
const empty = (h, p) => `<div class="emptyst"><h3>${h}</h3><p class="small">${p}</p>${tag("na")}</div>`;

/* ---------- Charts (reusable SVG) ---------- */
function hbars(rows, { fmt = v => v, max, w = 700, lw = 270 } = {}) {
  const h = 30, H = rows.length * h + 4, mx = max || Math.max(...rows.map(r => r.v), 1), bw = w - lw - 90;
  return `<div class="chart"><svg viewBox="0 0 ${w} ${H}" role="img" aria-label="Bar chart">${rows.map((r, i) => {
    const y = i * h + 2, L = Math.max(2, (r.v / mx) * bw);
    return `<text class="lbl" x="${lw - 10}" y="${y + 16}" text-anchor="end">${esc(r.l)}</text>
      <rect class="bar" x="${lw}" y="${y + 4}" width="${L}" height="${h - 12}" rx="2" style="fill:${r.c || "var(--navy)"}" data-tip="${esc(r.tip || r.l + ": " + fmt(r.v))}"/>
      <text class="val" x="${lw + L + 8}" y="${y + 16}">${fmt(r.v)}</text>`;
  }).join("")}</svg></div>`;
}
function stack(cols, series, { fmt = v => v, w = 560, H = 280 } = {}) {
  const tot = cols.map((_, i) => series.reduce((a, s) => a + s.v[i], 0)), mx = Math.max(...tot) * 1.12;
  const pad = 40, bw = 90, gap = (w - pad - cols.length * bw) / (cols.length + 1), ch = H - 40;
  let out = "";
  for (let k = 0; k <= 4; k++) { const y = 10 + ch - (ch * k) / 4; out += `<line x1="${pad}" x2="${w}" y1="${y}" y2="${y}" stroke="#D9D1C2"/><text x="${pad - 6}" y="${y + 4}" text-anchor="end">${fmt((mx * k) / 4)}</text>`; }
  cols.forEach((c, i) => {
    const x = pad + gap + i * (bw + gap); let y = 10 + ch;
    series.forEach(s => {
      const h = (s.v[i] / mx) * ch; y -= h;
      if (h > 0) out += `<rect class="bar" x="${x}" y="${y}" width="${bw}" height="${h}" style="fill:${s.c}" data-tip="${esc(c + " · " + s.n + ": " + fmt(s.v[i]))}"/>`;
    });
    out += `<text class="val" x="${x + bw / 2}" y="${y - 6}" text-anchor="middle">${fmt(tot[i])}</text><text class="lbl" x="${x + bw / 2}" y="${H - 8}" text-anchor="middle">${c}</text>`;
  });
  const legend = series.map(s => `<span style="display:inline-flex;align-items:center;gap:6px;margin-right:14px;font-size:12px;color:var(--ink2)"><i class="dot" style="background:${s.c}"></i>${s.n}</span>`).join("");
  return `<div class="chart"><svg viewBox="0 0 ${w} ${H}" role="img" aria-label="Stacked bar chart">${out}</svg><div style="margin-top:8px">${legend}</div></div>`;
}
function stepLine(pts, { w = 560, H = 220, max = 80, actual = [] } = {}) {
  const pad = 40, ch = H - 40, x = i => pad + 20 + (i * (w - pad - 40)) / (pts.length - 1), y = v => 10 + ch - (v / max) * ch;
  let out = "";
  [0, 20, 40, 60, 80].forEach(v => out += `<line x1="${pad}" x2="${w}" y1="${y(v)}" y2="${y(v)}" stroke="#D9D1C2"/><text x="${pad - 6}" y="${y(v) + 4}" text-anchor="end">${v}%</text>`);
  out += `<polyline fill="none" stroke="var(--gold-hi)" stroke-width="2.5" stroke-dasharray="5 4" points="${pts.map((p, i) => x(i) + "," + y(p.v)).join(" ")}"/>`;
  pts.forEach((p, i) => out += `<circle class="pt" cx="${x(i)}" cy="${y(p.v)}" r="5" style="fill:${p.t === "fact" ? "var(--t-fact)" : "var(--card)"};stroke:${p.t === "fact" ? "var(--t-fact)" : "var(--gold-hi)"};stroke-width:2" data-tip="${esc(p.p + ": " + (p.t === "fact" ? "" : "≤") + p.v + "% — " + D.types[p.t].label)}"/><text class="val" x="${x(i)}" y="${y(p.v) - 12}" text-anchor="middle">${p.t === "fact" ? "" : "≤"}${p.v}%</text><text class="lbl" x="${x(i)}" y="${H - 8}" text-anchor="middle">${p.p}</text>`);
  actual.forEach((v, i) => v != null && (out += `<circle cx="${x(i)}" cy="${y(v)}" r="4" style="fill:var(--navy)"/>`));
  return `<div class="chart"><svg viewBox="0 0 ${w} ${H}" role="img" aria-label="Line chart">${out}</svg></div>`;
}
function matrixSvg(sel) {
  const S = 420, p = 44, c = S - p - 10, x = v => p + ((v - 0.5) / 5) * c, y = v => 10 + c - ((v - 0.5) / 5) * c;
  let out = `<rect x="${p}" y="10" width="${c}" height="${c}" fill="#F7F4EE" stroke="#C9C1B1"/>
    <line x1="${x(3)}" x2="${x(3)}" y1="10" y2="${10 + c}" stroke="#C9C1B1" stroke-dasharray="3 3"/><line x1="${p}" x2="${p + c}" y1="${y(3)}" y2="${y(3)}" stroke="#C9C1B1" stroke-dasharray="3 3"/>
    <text x="${p + 8}" y="26">High impact · lower complexity — move first</text><text x="${p + c - 8}" y="26" text-anchor="end">Major programme</text>
    <text x="${p + 8}" y="${c}">Quick fix</text><text x="${p + c - 8}" y="${c}" text-anchor="end">Question value</text>
    <text x="${p + c / 2}" y="${S - 4}" text-anchor="middle" class="lbl">Implementation complexity →</text>
    <text transform="translate(12 ${10 + c / 2}) rotate(-90)" text-anchor="middle" class="lbl">Impact →</text>`;
  D.decisions.forEach(d => {
    const on = d.n === sel;
    out += `<g class="mpt" data-n="${d.n}" style="cursor:pointer" data-tip="${esc(d.n + ". " + d.h)}"><circle class="pt" cx="${x(d.cx)}" cy="${y(d.impact)}" r="${on ? 19 : 15}" style="fill:${on ? "var(--gold)" : "var(--navy)"}"/><text x="${x(d.cx)}" y="${y(d.impact) + 4}" text-anchor="middle" style="fill:#fff;font-weight:600;font-size:12px;pointer-events:none">${d.n}</text></g>`;
  });
  return `<div class="chart"><svg viewBox="0 0 ${S} ${S}" role="img" aria-label="Prioritisation matrix">${out}</svg></div>`;
}
/* ---------- Views ---------- */
const V = {};
let state = { root: "R1", evType: "all", evClock: "all", evText: "", chain: null, rec: 1, phase: null, kpiTier: "all", kpiClock: "all",
  votes: {}, calc: { cap: 590000, u: 80, m: 6 }, pay: "stack", aff: { cash: "", ceil: 3, sc: 2, lines: {} }, open: {}, cost: "All", sal: 0, extra: 0, seg: 0 };

V.briefing = () => {
  const items = ["3 MONTHS TO LISTING", "590,000 BPD · ONE SITE · RAMPING UP", "≈50 EXECUTIVES · THREE JOBS", "70% OF GROUP EXECUTIVE TIME ON NEP", "$4.70M YEAR ONE AT TARGET (ASSUMPTION)", "5 BOARD DECISIONS · 90 DAYS"];
  const tick = items.map(s => `<span>${s}</span>●`).join("");
  const fact = (v, unit, l, hot) => `<div><span class="v ${hot ? "hot" : ""}">${v}${unit ? `<small>${unit}</small>` : ""}</span><span class="l">${l}</span></div>`;
  const italic = { R1: ["people,", "Authority sits with ", " not roles."], R2: ["three clocks.", "One bench is running ", ""], R3: ["promises,", "Reward is a set of ", " not a system."] };
  const P = D.payout.rows;
  return `
  <div class="ticker" aria-hidden="true"><div>${tick}${tick}</div></div>
  <section class="hero2">
    <div class="l">
      <div class="kicker">00 · Briefing · ${esc(D.meta.event)}</div>
      <h1>Three clocks.<br>One owner each.<br><em>One set of books</em> everyone can trust.</h1>
      <p class="lede" style="margin:0 0 12px;font-size:20px;color:var(--ink)">NEP should reach listing day run by its own operators, with economics its independent directors can verify.</p>
      <div class="small muted">${tag("rec")} ${src("1–3")} · Prepared for ${esc(D.meta.audience)}</div>
    </div>
    <div class="r">
      <div class="dials" aria-hidden="true"><div class="dial solid"><i style="transform:translateX(-50%) rotate(-12deg)"></i><b></b></div><div class="dial"><i style="transform:translateX(-50%) rotate(90deg)"></i><b></b></div><div class="dial dash"><i style="transform:translateX(-50%) rotate(220deg)"></i><b></b></div></div>
      <div class="dial-l"><span><b>LIST</b><br>3 months</span><span><b>RUN</b><br>operate</span><span><b>BUILD</b><br>1.1m bpd</span></div>
      <p class="small muted" style="margin:0;border-top:1px solid var(--ink);padding-top:10px">Deck cover motif: the LIST clock nearly at twelve, inside the PROTECT ring — verify before money moves.</p>
    </div>
  </section>
  <div class="sec">${secHead("<span class=\"kicker\" style=\"color:var(--ink);font-size:13px\">Situation</span>", "", "<span class=\"src\">Case facts · slide 3</span>")}
    <div class="facts2">${fact("3", " mo", "to listing — an independent Board, RemCo and continuous disclosure arrive with it")}${fact("590", "k bpd", "one refinery and petrochemicals site, early ramp-up; ambition ≈1.1m bpd")}${fact("≈50", "", "executives run operations, the IPO and the expansion between them")}${fact("70%", "", "of the Group executive team's time goes to NEP", true)}</div></div>
  <section class="sec price">
    <div style="flex:1 1 340px;display:flex;flex-direction:column;gap:8px"><span class="kicker" style="color:var(--ink);font-size:13px">Year-one price tag</span><span class="bignum">$4.70m</span><span class="mono">At target · $5.88m at maximum payout · ${tag("assumption")} · slides 12, 17</span></div>
    <div style="flex:2 1 520px;display:flex;flex-direction:column;gap:14px">
      <div class="bar3" role="img" aria-label="Transition programme 1.98 million, annual STI 2.01 million, bridge tranche one 0.71 million">
        <div style="flex:${P[0].v[1]};background:var(--ink);color:var(--bg)" data-tip="${P[0].n}"><span>TRANSITION</span><strong>$1.98m</strong></div>
        <div style="flex:${P[1].v[1]};background:var(--gold-hi)" data-tip="${P[1].n} at target"><span>ANNUAL STI</span><strong>$2.01m</strong></div>
        <div style="flex:${P[2].v[1]};background:var(--card);border:2px solid var(--ink);border-left:0;border-radius:0 18px 18px 0" data-tip="${P[2].n} at target"><span>BRIDGE</span><strong>$0.71m</strong></div>
      </div>
      <p style="margin:0">Released only if programme cash at maximum is <b>≤3% of available cash</b> — at least $196.1m. NEP's available cash is <span style="border-bottom:2px dashed var(--gold)">not in the case</span> ${tag("na")}</p>
    </div></section>
  <section class="ask2 sec">
    <div class="five" aria-hidden="true">5</div>
    <div class="t"><h2>Board decisions in the first <em>90 days.</em></h2><p>${esc(D.ask)}</p>
      <div class="row"><a class="btn gold" href="#diagnosis">Start: what is wrong →</a><a class="btn line" href="#decision">Skip to the five decisions</a></div></div>
  </section>
`;
};

V.diagnosis = () => {
  const r = D.roots.find(x => x.id === state.root);
  return `
  <div class="kicker">01 · What is wrong</div><h1>Three causes, three tests</h1>
  <p class="lede">Six symptoms, three causes. Each cause is a hypothesis with a 30-day test that could prove it wrong. Select one.</p>
  <div class="sec">${secHead("Hypothesis tree", "Select a root-cause hypothesis to see its evidence, consequence, intervention and the test that could prove it wrong", src(4))}
    <div class="tree"><div class="rootq"><div class="kicker">Central question</div><p>Why can't NEP's leadership run, build and list at the same time — and what must change before listing day?</p></div>
      <div class="branches">${D.roots.map(x => `<div class="branch"><button class="node ${x.id === r.id ? "on" : ""}" data-root="${x.id}"><span class="k">${x.id} · HYPOTHESIS</span><h3 style="margin:4px 0 0">${x.h}</h3></button><div class="subqs">${x.qs.map(q => `<div>${q}</div>`).join("")}</div></div>`).join("")}</div></div>
    <div class="detail" id="rootDetail">
      <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:16px"><div><span class="kicker">${r.id} · root-cause analysis</span><h2 style="margin-top:4px">${r.h}</h2></div>
        <div><span class="status" data-tip="The deck defines the test; no test result exists yet">● Open — test defined, not yet run</span></div></div>
      <div class="flow">
        <div><h4>Symptoms in the case</h4><p>${r.symptoms}</p>${tag("fact")}</div>
        <div><h4>Business consequence</h4><p>${r.consequence}</p>${tag("analysis")}</div>
        <div><h4>Proposed intervention</h4><p>${r.intervention}</p>${tag("rec")} <span class="src">${r.ref}</span></div>
        <div><h4>Evidence to confirm or reject</h4><p>${r.test}</p>${tag("rec")}</div>
        <div><h4>Board decisions</h4>${r.decisions.map(n => `<p><a href="#recommendations" data-rec="${n}">${n}. ${dec(n).h}</a></p>`).join("")}</div>
      </div></div>
  </div>
  ${more("diag", "More detail: background, scope and design principles", `
  <div class="grid g2">
    <div class="panel"><h3>Business background</h3>
      <ul class="clean"><li>NEP is a 590,000 bpd single-site refinery and petrochemicals complex in early ramp-up, with an ambition of about 1.1 million bpd. ${tag("fact")} ${src(3)}</li>
      <li>NIP is the controlling shareholder; NEP lists in about three months, bringing an independent Board, RemCo and continuous disclosure. ${tag("fact")} ${src(3)}</li>
      <li>About 50 executives run operations, the IPO and the expansion; 70% of Group executive time goes to NEP. ${tag("fact")} ${src(3)}</li></ul></div>
    <div class="panel"><h3>Industry and market context</h3>
      <ul class="clean"><li>A refiner's share price follows the margin cycle — outside management's control. ${tag("analysis")} ${src(11)}</li>
      <li>On a single site, lost barrels cannot be made up at another plant; one utilisation point is ≈2.15m barrels a year. ${tag("assumption")} ${src(21)}</li>
      <li>Peer pay structure: Marathon Petroleum uses mainly performance-based LTI, no options since 2020. ${tag("ext")} ${src(16)}</li></ul>
      <p class="note">No market-sizing, margin or competitor dataset is in the source deck — see Research limitations.</p></div>
  </div>
  <div class="sec">${secHead("Problem statement")}<div class="statement"><p>${esc(D.challenge)}</p></div></div>
  <div class="sec grid g2">
    <div>${secHead("Project objectives")}<ul class="clean">${D.objectives.map(o => `<li>${o}</li>`).join("")}</ul></div>
    <div>${secHead("Scope and limitations", "", src(D.scope.s))}<div class="grid g2"><div><h3>In scope</h3><ul class="clean small">${D.scope.in.map(x => `<li>${x}</li>`).join("")}</ul></div><div><h3>Excluded</h3><ul class="clean small muted">${D.scope.out.map(x => `<li>${x}</li>`).join("")}</ul></div></div></div>
  </div>
  <div class="sec">${secHead("Design principles", "The rules every intervention is tested against", src(4))}
    <div class="grid" style="grid-template-columns:repeat(5,minmax(0,1fr))">${D.principles.map(([k, t]) => `<div class="panel"><div class="kicker">${k}</div><p style="margin:6px 0 0">${t}</p></div>`).join("")}</div></div>`)}`;
};

V.research = () => {
  const list = D.evidence.filter(e => (state.evType === "all" || e.t === state.evType) && (state.evClock === "all" || e.c === state.evClock) && (!state.evText || (e.h + e.d).toLowerCase().includes(state.evText.toLowerCase())));
  const counts = Object.keys(D.types).map(t => ({ l: D.types[t].label, v: D.evidence.filter(e => e.t === t).length, c: `var(--t-${t})`, t }));
  const chips = (key, vals) => vals.map(([v, l]) => `<button class="chip ${state[key] === v ? "on" : ""}" data-f="${key}" data-v="${v}">${l}</button>`).join("");
  return `
  <div class="kicker">Appendix A1</div><h1>Research & Intelligence</h1>
  <p class="lede">Every claim in the engagement, typed by evidence class and traced to its source slide.</p>
  <div class="grid g2">
    <div class="panel"><h3>Evidence register by type</h3><p class="small muted">Click a bar to filter the register.</p><div id="evbars">${hbars(counts.map(c => ({ ...c, tip: c.l + ": " + c.v + " items — click to filter" })), { lw: 120, w: 520 })}</div></div>
    <div class="panel"><h3>External benchmark</h3><p>${ev("E10").d}</p>${tag("ext")} ${src(16)}
      <h3 style="margin-top:16px">Standards referenced</h3><p class="small">${ev("E11").d}</p>${tag("ext")} ${src(6)}</div>
  </div>
  <div class="sec">${secHead("Key assumptions", "What the case gives us, what we assumed, and what changes if we are wrong", src(2))}
    ${table(["Area", "Key assumption", "Basis", "If it is wrong"], D.keyAssumptions.map(r => [`<b>${r[0]}</b>`, r[1], tag(r[2]), r[3]]))}
    <p class="note">Case facts are stated as the case gives them; everything else is a labelled planning assumption the Board can change. Each figure has a formula in the financial defence workbook.</p></div>
  <div class="sec">${secHead("Evidence register", `${list.length} of ${D.evidence.length} items`)}
    <div class="filters">${chips("evType", [["all", "All types"], ...Object.entries(D.types).map(([k, v]) => [k, v.label])])}<span class="sep"></span>
      ${chips("evClock", [["all", "All clocks"], ["RUN", "Run"], ["BUILD", "Build"], ["LIST", "List"], ["PROTECT", "Protect"], ["PEOPLE", "People"]])}
      <input id="evText" class="chip" style="min-width:200px" placeholder="Filter text…" value="${esc(state.evText)}" aria-label="Filter evidence text"></div>
    ${list.length ? list.map(e => `<details class="ev"><summary><span class="id">${e.id}</span>${clk(e.c)}<span style="flex:1">${e.h}</span>${tag(e.t)}</summary><div class="body"><p>${e.d}</p>${src(e.s)} · ${esc(D.meta.source)}</div></details>`).join("") : `<div class="emptyst">No evidence matches these filters.</div>`}
  </div>
  <div class="sec">${secHead("Market, competitor and stakeholder research", "Shown as empty because the source deck does not contain it — nothing is invented here")}
    <div class="grid g3">${empty("Market research", "No market sizing, demand or margin dataset in the deck.")}${empty("Competitor analysis", "Only one peer (Marathon Petroleum) is cited, for pay structure.")}${empty("Customer & stakeholder interviews", "Stakeholder insight comes from the case narrative (slide 4).")}</div></div>
  <div class="sec grid g2">
    <div>${secHead("Source references")}<ul class="clean small">
      <li><b>${esc(D.meta.source)}</b> — Team Wakanda final Board deck, 14 slides plus appendix A1–A8 (primary source for this app)</li>
      <li><b>${esc(D.meta.workbook)}</b> — financial defence workbook; every money figure traces to a formula there (see Workbench)</li></ul>
      ${table(["Source", "Year", "Used for", "Why not directly comparable", ""], D.sources.map(r => [`<b>${r[0]}</b>`, r[1], r[2], r[3], tag(r[4])]))}</div>
    <div>${secHead("Research limitations")}<ul class="clean small">${D.limitations.map(l => `<li>${l}</li>`).join("")}</ul>
      <details class="ev" style="margin-top:14px"><summary><span style="flex:1">What changed from earlier decks, and why (workbook reconciliation)</span></summary><div class="body">${table(["Item", "Earlier", "Final model", "Why it changed"], D.reconciliation.map(r => [`<b>${r[0]}</b>`, `<span class="muted">${r[1]}</span>`, r[2], r[3]]))}</div></details></div>
  </div>`;
};

V.workbench = () => `
  <div class="kicker">03 · The money</div><h1>Move the <em>numbers.</em></h1>
  <p class="lede">Do the numbers hold if I move them? Three questions a director will ask, then the detail behind them. Every input is a labelled planning assumption from the deck — <b>not an NEP result.</b></p>
  <section class="terminal">
    <div class="kicker" style="color:var(--gold-hi)">Q1 · Assumption · appendix A7, slide 21</div>
    <h2 style="font-size:44px;margin:6px 0 4px">What is one point of utilisation worth?</h2>
    <p class="small" style="color:#A3A9B4;margin-bottom:28px">Throughput = capacity × utilisation × 365. Contribution proxy = throughput × assumed margin.</p>
    <div class="calc"><div id="calcCtl"></div><div id="calcOut"></div></div></section>
  <div class="sec">
    <div class="panel">${secHead("<em class=\"q-em\">Q2</em> Can NEP afford it?", "The conditional affordability test", tag("rec") + " " + src(12))}
      <p class="small"><b>Available cash</b> = operating cash flow − maintenance capex − scheduled debt service − contractual obligations − committed expansion funding − liquidity buffer. It is <b>not</b> Q1's contribution proxy.</p>
      <div id="affCtl"></div><div id="affOut"></div>
      <details class="ev"><summary><span style="flex:1">Build it from NEP's own figures ($m)</span></summary><div class="body" id="affLines"></div></details>
      <p class="note">NEP's available cash is not in the case ${tag("na")}. Drag the slider or enter NEP's figures (the workbook's yellow cells). 3% is a proposed Board guardrail, not an industry standard.</p></div>
  </div>
  <div class="sec">${secHead("<em class=\"q-em\">Q4</em> Does every number tie back?", `One set of books. Slide figure as rounded vs the workbook formula result. Passes within 1% or $5,000 — <b>${D.figureMap.filter(fmOk).length}/${D.figureMap.length} OK</b>`, `<span class="src" data-tip="${esc(D.meta.workbook)}, Deck figure map">Workbook</span>`)}
    <div class="grid" style="grid-template-columns:1.6fr 1fr">
      <details class="ev panel" style="padding:0;align-self:start"><summary style="padding:14px 18px"><span style="flex:1"><b>Deck figure map</b> — ${D.figureMap.length} figures with their source cells</span></summary><div class="body">${table(["Slide", "Figure", "On slide", "Workbook", "Source cell", "Check"], D.figureMap.map(r => [r[0], r[1], usd(r[2]), usd(r[3]), `<span class="small">${r[4]}</span>`, fmOk(r) ? `<b style="color:var(--ok)">OK</b>` : `<b style="color:var(--bad)">CHECK</b>`]), [0, 2, 3])}</div></details>
      <div class="panel"><h3>First-year cash by Board decision (target)</h3>${hbars(D.decisionCosts.map((v, i) => ({ l: "Decision " + (i + 1), v: v / 1e6, c: "var(--gold)", tip: dec(i + 1).h + ": " + usd(v) })), { fmt: m2, lw: 100, w: 420 })}<p class="small"><b>Total ${usd(D.decisionCosts.reduce((a, b) => a + b, 0))}</b> = the $4.70m at target.</p>${tag("assumption")} ${src(14)}</div></div></div>
  ${more("wb", "More detail: what moves the cost, payout scenarios, exposure, cohorts and decision rights", `
  <div class="sec">${secHead("<em class=\"q-em\">Q3</em> What moves the cost?", "Itemised build behind the $4.70m at target, and its sensitivities", `<div class="seg" id="costSeg">${["All", "One-off", "Recurring", "Incentive"].map(t => `<button data-c="${t}" class="${state.cost === t ? "on" : ""}">${t}</button>`).join("")}</div>`)}
    <div class="grid" style="grid-template-columns:1.6fr 1fr"><div class="panel" id="costChart"></div>
      <div class="panel"><h3>Salary and cohort sensitivity</h3><div id="salCtl"></div><div id="salOut"></div><p class="note">Transition costs held fixed; STI and bridge scale with salaries. ${src(17)}</p></div></div></div>
  <div class="sec grid g2">
    <div class="panel">${secHead("First-year payout scenarios ($m)", "", `<div class="seg" id="paySeg"><button data-p="stack" class="${state.pay === "stack" ? "on" : ""}">Components</button><button data-p="cash" class="${state.pay === "cash" ? "on" : ""}">Cash needed at 3%</button></div>`)}
      <div id="payChart"></div><p class="note">Downside: performance below threshold; service half of tranche 1 still paid. Maximum: STI and bridge performance at 150%. ${src(12)}</p></div>
    <div class="panel" style="margin-top:16px"><h3>Maximum payout exposure — cash and non-cash separated</h3>
      ${table(["Commitment", "Target", "Maximum", "Timing and form"], [...D.maxExposure.map(r => [r[0], usd(r[1]), usd(r[2]), r[3]]), { cls: "total", cells: ["Total cash commitments shown", usd(D.maxExposure.reduce((a, r) => a + r[1], 0)), usd(D.maxExposure.reduce((a, r) => a + r[2], 0)), ""] }, [`<span class="muted">${D.maxExposureLti[0]}</span>`, usd(D.maxExposureLti[1]), usd(D.maxExposureLti[2]), D.maxExposureLti[3]]], [1, 2])}
      <p class="note">The bridge line is the full 36-month commitment, not the year-one tranche inside the $4.70m. ${tag("assumption")}</p></div>
  </div>
  <div class="sec">${secHead("Segmentation: pay by executive cohort", "Select a cohort. Bridge, STI and LTI opportunity are deck assumptions; mix is derived.", src("10–11, 17"))}
    <div class="seg" id="segSeg" style="margin-bottom:14px">${D.lti.map((s, i) => `<button data-s="${i}" class="${state.seg === i ? "on" : ""}">${s.n}</button>`).join("")}</div>
    <div class="grid g2"><div class="panel" id="segOut"></div><div class="panel"><h3>Performance-share scorecard (60% of LTI)</h3>${hbars(D.scorecard.map(s => ({ l: s.k, v: s.w, c: color(s.c), tip: s.k + " — " + s.w + "%: " + s.m })), { fmt: v => v + "%", lw: 200, w: 520, max: 40 })}<p class="note">Gate: a serious process-safety event or serious compliance failure lets RemCo reduce to zero. ${src(11)}</p></div></div></div>
  <div class="sec">${secHead("Diagnostic framework: decision-rights matrix", "Who decides what once NEP is listed", tag("rec") + " " + src(6))}
    ${table(D.decisionRights.cols, D.decisionRights.rows.map(r => [`<b>${r[0]}</b>`, ...r.slice(1)]))}</div>
  <div class="sec">${secHead("Key analytical findings")}
    <div class="grid g3">
      <div class="panel"><h3>Value at stake is operational</h3><p class="small">At an illustrative $3/bbl, one utilisation point ≈ $6.46m a year; at $9/bbl ≈ $19.38m. Reliability is the first thing pay should reward.</p>${tag("analysis")} ${src(21)}</div>
      <div class="panel"><h3>The programme is small against the value at stake</h3><p class="small">$4.70m first-year cash at target versus $6.46m–$19.38m per utilisation point — but this is a sensitivity, not proof of ROI.</p>${tag("analysis")} ${src("12, 21")}</div>
      <div class="panel"><h3>Affordability is unproven</h3><p class="small">The programme passes only if available cash is at least $196.1m at maximum payout; capacity alone does not show this.</p>${tag("analysis")} ${src(12)}</div>
    </div></div>`)}`;

function mountWorkbench(el) {
  const c = state.calc;
  const drawCtl = () => {
    $("#calcCtl", el).innerHTML = `
      <div class="ctl"><label>Capacity</label><div class="seg" id="capSeg"><button data-cap="590000" class="${c.cap === 590000 ? "on" : ""}">590,000 bpd (today)</button><button data-cap="1100000" class="${c.cap === 1100000 ? "on" : ""}">1.1m bpd (ambition)</button></div></div>
      <div class="ctl"><label>Utilisation <b>${c.u}%</b></label><input type="range" min="50" max="100" value="${c.u}" id="cu" aria-label="Utilisation"></div>
      <div class="ctl"><label>Assumed contribution margin <b>$${c.m}/bbl</b></label><input type="range" min="1" max="12" step="0.5" value="${c.m}" id="cm" aria-label="Margin"></div>
      <div class="small muted">Preset scenarios: ${D.scenarios.map(s => `<button class="chip" data-sc='${s.u},${s.m}'>${s.n}</button>`).join(" ")}</div>`;
  };
  const drawCalc = () => {
    $("#cu", el).previousElementSibling.querySelector("b").textContent = c.u + "%";
    $("#cm", el).previousElementSibling.querySelector("b").textContent = "$" + c.m + "/bbl";
    const tp = c.cap * 365 * c.u / 100 / 1e6, pt = c.cap * 365 * 0.01 / 1e6;
    const ratio = 4.7005 / (pt * c.m);
    $("#calcOut", el).innerHTML = `<div class="kicker" style="color:#A3A9B4">One point of utilisation (${pt.toFixed(3)}m bbl) =</div><div class="readout">$${(pt * c.m).toFixed(2)}m</div><p style="color:#C9CCD2;margin:4px 0 18px">a year of contribution sensitivity</p>
      <div class="out" style="grid-template-columns:1fr 1fr"><div><b>${tp.toFixed(1)}m</b><span>barrels a year</span></div><div><b>$${Math.round(tp * c.m).toLocaleString()}m</b><span>contribution proxy a year</span></div></div>
      <p style="margin:16px 0 8px;color:#C9CCD2">The whole year-one programme ($4.70m) is <b style="color:var(--bg)">${Math.round(ratio * 100)}%</b> of one point at these inputs.</p>
      <div role="img" aria-label="Programme equals ${Math.round(ratio * 100)} percent of one utilisation point" style="height:12px;background:#2A2D33;border-radius:999px;overflow:hidden"><div style="height:100%;width:${Math.min(100, ratio * 100).toFixed(1)}%;background:var(--gold-hi);border-radius:999px;transition:width .2s"></div></div>
      <h3 style="margin-top:18px">Deck scenarios (590,000 bpd)</h3>
      ${table(["Scenario", "Utilisation", "Throughput (m bbl/yr)", "Margin ($/bbl)", "Contribution proxy ($m)", "Value of 1 point ($m)"], D.scenarios.map(s => ({ cls: c.cap === 590000 && s.u === c.u && s.m === c.m ? "total" : "", cells: [s.n, s.u + "%", s.tp, s.m, s.c.toLocaleString(), s.v] })), [1, 2, 3, 4, 5])}
      <p class="note"><b>What this is not:</b> not EBITDA, operating cash flow, a guaranteed saving or proof of incentive ROI. Turning throughput into cash needs NEP's actual margins, operating costs, maintenance spend and debt service.</p>`;
  };
  drawCtl(); drawCalc();
  $("#calcCtl", el).addEventListener("input", e => { if (e.target.id === "cu") c.u = +e.target.value; if (e.target.id === "cm") c.m = +e.target.value; drawCalc(); });
  $("#calcCtl", el).addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; if (b.dataset.cap) c.cap = +b.dataset.cap; if (b.dataset.sc) { [c.u, c.m] = b.dataset.sc.split(",").map(Number); c.cap = 590000; } drawCtl(); drawCalc(); });

  const P = D.payout, cols3 = ["var(--navy)", "var(--gold)", "var(--people)"];
  const drawPay = () => $("#payChart", el).innerHTML = state.pay === "stack"
    ? stack(P.cols, P.rows.map((r, i) => ({ n: r.n, v: r.v, c: cols3[i] })), { fmt: v => "$" + v.toFixed(2) + "m" })
    : stack(P.cols, [{ n: "Available cash needed so programme ≤3%", v: P.cashNeeded, c: "var(--protect)" }], { fmt: v => "$" + v.toFixed(0) + "m" });
  drawPay();
  $("#paySeg", el).addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; state.pay = b.dataset.p; $$("#paySeg button", el).forEach(x => x.classList.toggle("on", x === b)); drawPay(); });

  const a = state.aff;
  $("#affCtl", el).innerHTML = `
    <div class="grid g2"><div class="ctl"><label>Available cash <b id="acashv"></b></label><input type="range" min="0" max="800" step="1" id="acash" value="${a.cash || 0}" aria-label="Available cash in millions of dollars"></div>
    <div class="ctl"><label>Scenario</label><div class="seg" id="ascen">${P.cols.map((n, i) => `<button data-i="${i}" class="${a.sc === i ? "on" : ""}">${n}</button>`).join("")}</div></div></div>
    <div class="ctl"><label>Board ceiling <b id="aceilv">${a.ceil}%</b></label><input type="range" min="1" max="6" step="0.5" value="${a.ceil}" id="aceil" aria-label="Board ceiling"></div>`;
  const drawAff = () => {
    const prog = P.total[a.sc], need = prog / (a.ceil / 100), cash = parseFloat(a.cash);
    $("#aceilv", el).textContent = a.ceil + "%";
    $("#acashv", el).textContent = isNaN(cash) ? "NOT SET" : "$" + cash + "m";
    const at = v => Math.min(100, v / 8).toFixed(1); // gauge spans $0–800m
    $("#affOut", el).innerHTML = `<div class="formula"><b>$${prog.toFixed(2)}m ÷ ${a.ceil}% = $${need.toFixed(1)}m</b> — programme cash (${P.cols[a.sc].toLowerCase()}) may be at most ${a.ceil}% of available cash, so available cash must be at least this.</div>
      <div class="gauge" aria-hidden="true"><div style="width:${at(need)}%;background:#F4DDD2"></div><div style="flex:1;background:#DCE5DD"></div><i style="left:${at(need)}%"></i>${isNaN(cash) ? "" : `<b style="left:${at(cash)}%"></b>`}</div>
      <div class="gauge-l"><span>$0 · fail zone</span><span>line at $${need.toFixed(1)}m</span><span>pass zone · $800m</span></div>
      <div class="out"><div><b>$${prog.toFixed(2)}m</b><span>programme cash (${P.cols[a.sc].toLowerCase()})</span></div><div><b>$${need.toFixed(1)}m</b><span>minimum available cash</span></div><div><b>${isNaN(cash) || cash <= 0 ? "—" : ((prog / cash) * 100).toFixed(2) + "%"}</b><span>programme as share of cash</span></div></div>` +
      (isNaN(cash) || cash <= 0 ? `<div class="verdict none"><span class="stamp">GATED</span>No verified available-cash figure — test cannot run. Funding stays gated.</div>`
        : cash >= need ? `<div class="verdict pass"><span class="stamp">PASS</span>Pass at ${a.ceil}%: $${cash.toLocaleString()}m covers the $${need.toFixed(1)}m minimum.${a.sc !== 2 ? " The deck's test is set at maximum payout." : ""}</div>`
          : `<div class="verdict fail"><span class="stamp">FAIL</span>Fail at ${a.ceil}%: needs $${need.toFixed(1)}m; short by $${(need - cash).toFixed(1)}m. Decision 4 reopens.</div>`);
  };
  drawAff();
  const LINES = [["ocf", "Operating cash flow", 1], ["mcx", "Less: maintenance capex", -1], ["debt", "Less: scheduled debt service", -1], ["obl", "Less: contractual obligations", -1], ["exp", "Less: committed expansion funding", -1], ["buf", "Less: liquidity buffer", -1]];
  $("#affLines", el).innerHTML = `<div class="grid g2">${LINES.map(([k, l]) => `<div class="ctl"><label>${l}</label><input type="number" min="0" step="0.1" inputmode="decimal" data-line="${k}" value="${a.lines[k] ?? ""}" placeholder="not set" aria-label="${l} in $m" class="chip" style="width:100%"></div>`).join("")}</div><p class="small" id="affSum"></p>`;
  const sumLines = () => {
    const v = k => parseFloat(a.lines[k]), ocf = v("ocf");
    if (isNaN(ocf)) { $("#affSum", el).textContent = "Enter operating cash flow to calculate."; return; }
    const cash = LINES.reduce((t, [k, , sg]) => t + sg * (isNaN(v(k)) ? 0 : v(k)), 0), miss = LINES.filter(([k]) => isNaN(v(k))).map(([, l]) => l.replace("Less: ", ""));
    a.cash = String(Math.round(cash * 10) / 10); $("#acash", el).value = Math.max(0, cash); drawAff();
    $("#affSum", el).innerHTML = `Available cash = <b>$${a.cash}m</b>${miss.length ? ` <span style="color:var(--bad)">— ${miss.join(", ")} not entered, counted as zero, so this overstates cash.</span>` : ""}`;
  };
  $("#affLines", el).addEventListener("input", e => { const k = e.target.dataset.line; if (!k) return; a.lines[k] = e.target.value; sumLines(); });
  if (Object.keys(a.lines).length) sumLines();
  $("#affCtl", el).addEventListener("input", e => { if (e.target.id === "acash") a.cash = e.target.value; if (e.target.id === "aceil") a.ceil = +e.target.value; drawAff(); });
  $("#ascen", el).addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; a.sc = +b.dataset.i; $$("#ascen button", el).forEach(x => x.classList.toggle("on", x === b)); drawAff(); });

  const typeC = { "One-off": "var(--build)", Recurring: "var(--run)", Incentive: "var(--people)" };
  const drawCost = () => {
    const rows = D.costBuild.filter(r => state.cost === "All" || r.type === state.cost).sort((x, y) => y.v - x.v);
    const sum = rows.reduce((s, r) => s + r.v, 0);
    $("#costChart", el).innerHTML = hbars(rows.map(r => ({ l: r.n, v: r.v, c: typeC[r.type], tip: `${r.n} — ${r.type}: ${usd(r.v)}` })), { fmt: v => v >= 1e6 ? m2(v / 1e6) : "$" + Math.round(v / 1000) + "k", max: 2010000 }) +
      `<div style="display:flex;justify-content:space-between;margin-top:10px;font-size:13px"><span>${tag("assumption")} ${src(17)}</span><b>${state.cost === "All" ? "First-year gross programme cash at target" : state.cost + " subtotal"}: ${usd(sum)}</b></div>
      <p class="note">Memo: $2,580,000 annual equity grant target value is not cash at grant and is excluded.</p>`;
  };
  drawCost();
  $("#costSeg", el).addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; state.cost = b.dataset.c; $$("#costSeg button", el).forEach(x => x.classList.toggle("on", x === b)); drawCost(); });

  $("#salCtl", el).innerHTML = `<div class="ctl"><label>Salary change <b id="salv"></b></label><input type="range" min="-20" max="20" value="${state.sal}" id="sal" aria-label="Salary change"></div>
    <div class="ctl"><label>Extra pivotal executives at $240,000 <b id="extv"></b></label><input type="range" min="0" max="10" value="${state.extra}" id="ext" aria-label="Extra pivotal executives"></div>`;
  const drawSal = () => {
    const f = 1 + state.sal / 100, tot = 1.978 + (2.01 + 0.7125) * f + state.extra * 0.084;
    $("#salv", el).textContent = (state.sal > 0 ? "+" : "") + state.sal + "%"; $("#extv", el).textContent = state.extra;
    $("#salOut", el).innerHTML = `<div class="out" style="grid-template-columns:1fr 1fr"><div><b>${m2(tot)}</b><span>first-year cash at target</span></div><div><b>${m2(2.58 * f + state.extra * 0.072)}</b><span>annual grant value (not cash)</span></div></div>
      <div class="out" style="grid-template-columns:1fr;margin-top:8px"><div><b>${m2(2.1375 * f + state.extra * 0.072)}</b><span>bridge commitment over 36 months (named 16 + additions)</span></div></div>
      <p class="small muted" style="margin-top:8px">Workbook checks: ±20% salaries → $4.16m to $5.25m (bridge $1.71m to $2.57m); each extra pivotal → +$84,000 first-year cash, +$72,000 grant value, +$72,000 bridge over 36 months. More than six additions needs Board approval and a new affordability test.</p>`;
  };
  drawSal();
  $("#salCtl", el).addEventListener("input", e => { if (e.target.id === "sal") state.sal = +e.target.value; if (e.target.id === "ext") state.extra = +e.target.value; drawSal(); });

  const drawSeg = () => {
    const l = D.lti[state.seg], s = D.sti[state.seg], bridgePct = state.seg < 2 ? 52.5 : 30;
    const base = l.base, stiV = base * s.pct / 100, ltiV = l.tv / 1e6, br = base * bridgePct / 100;
    const fixed = base / (base + stiV + ltiV);
    $("#segOut", el).innerHTML = `<h3>${l.n} — combined base $${base.toFixed(3)}m</h3>` +
      hbars([{ l: "Base salary", v: base, c: "var(--gates)" }, { l: `Annual STI at target (${s.pct}%)`, v: stiV, c: "var(--gold)" }, { l: `LTI grant at target (${l.pct}%)`, v: ltiV, c: "var(--navy)" }, { l: `Bridge over 36 months (${bridgePct}%)`, v: br, c: "var(--people)" }], { fmt: m2, lw: 210, w: 540 }) +
      `<p class="small" style="margin-top:10px">Pay mix at target (base + STI + LTI): <b>${Math.round(fixed * 100)}% fixed / ${Math.round((1 - fixed) * 100)}% variable</b> ${tag("analysis")} <span class="muted">— derived; the deck states 38/62 for the CEO.</span></p>${tag("assumption")} ${src("10, 11, 17")}`;
  };
  drawSeg();
  $("#segSeg", el).addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; state.seg = +b.dataset.s; $$("#segSeg button", el).forEach(x => x.classList.toggle("on", x === b)); drawSeg(); });
}

V.insights = () => {
  const ch = D.chains.find(c => c.id === state.chain);
  const cols = ["Business problem", "Evidence", "Analysis", "Insight", "Strategic implication"];
  return `
  <div class="kicker">Appendix A2</div><h1>Strategic Insights</h1>
  <p class="lede">How each piece of evidence becomes a decision. Select any row to trace a chain end to end.</p>
  ${secHead("Insight map", "Business Problem → Evidence → Analysis → Insight → Strategic Implication", ch ? `<button class="btn ghost" id="clearChain">Show all chains</button>` : "")}
  <div class="imap ${ch ? "focus" : ""}">${cols.map(c => `<div class="colh">${c}</div>`).join("")}
    ${D.chains.map(c => [
      `<span class="rowlbl">${c.id}</span>${c.p}`,
      c.e.map(id => `• ${ev(id).h}`).join("<br>"),
      c.a, c.i, c.m + `<br><span class="small muted">→ Decision ${c.d.join(", ")}</span>`,
    ].map(x => `<div class="cell ${ch && ch.id === c.id ? "hl" : ""}" data-chain="${c.id}" tabindex="0">${x}</div>`).join("")).join("")}
  </div>
  ${ch ? `<div class="detail"><div class="kicker">${ch.id} · evidence trail</div><h2 style="margin:4px 0 14px">${ch.i}</h2>
    <div class="grid g3">${ch.e.map(id => { const e = ev(id); return `<div class="panel"><div style="display:flex;justify-content:space-between">${clk(e.c)} ${tag(e.t)}</div><h3 style="margin-top:10px">${e.id} · ${e.h}</h3><p class="small">${e.d}</p>${src(e.s)}</div>`; }).join("")}</div>
    <p style="margin-top:14px"><b>Implication:</b> ${ch.m} ${tag("rec")} <span class="src">Slides ${ch.s}</span></p>
    <p>${ch.d.map(n => `<a class="btn ghost" href="#recommendations" data-rec="${n}" style="margin-right:8px">Decision ${n} →</a>`).join("")}</p></div>` : ""}
  <div class="sec grid g2">
    <div>${secHead("Root-cause hypotheses: status", "The deck defines a disconfirming test for each; none has been run yet")}
      ${D.roots.map(r => `<div class="panel" style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;gap:10px"><h3>${r.id} · ${r.h}</h3><span class="status">Open</span></div><p class="small muted" style="margin:0"><b>Test:</b> ${r.test}</p></div>`).join("")}</div>
    <div>${secHead("Rejected options", "Alternatives the team considered and dropped")}
      ${D.rejected.map(r => `<div class="panel" style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;gap:10px"><h3><s style="color:var(--ink3)">${r.h}</s></h3>${src(r.s)}</div><p class="small" style="margin:0">${r.why}</p></div>`).join("")}</div>
  </div>
  <div class="sec">${secHead("Identified opportunities")}
    <div class="grid g3">
      <div class="panel"><h3>Free the Group bench</h3><p class="small">Cut Group executive time on NEP from 70% to a proposed ≤30% by +12 months, restoring decision speed in non-NEP businesses.</p>${tag("rec")} ${src(8)}</div>
      <div class="panel"><h3>Build national talent</h3><p class="small">Pair each international specialist in a critical role with a national successor, subject to capability and eligibility.</p>${tag("rec")} ${src(7)}</div>
      <div class="panel"><h3>A Group governance reference</h3><p class="small">Use NEP's listed-company guardrails — gates, malus, clawback, affordability — across all four NIP archetypes.</p>${tag("rec")} ${src(13)}</div>
    </div></div>`;
};

V.recommendations = () => {
  const d = dec(state.rec);
  const quad = d.impact >= 4 && d.cx <= 3 ? "Move first" : d.impact >= 4 ? "Major programme — sequence carefully" : d.cx <= 3 ? "Quick fix" : "Question value";
  const chains = D.chains.filter(c => c.d.includes(d.n));
  return `
  <div class="kicker">04 · Reward</div><h1>Pay people to stay, then to perform</h1>
  <div class="statement" style="margin:6px 0 28px"><p>${esc(D.recommendation)}</p></div>
  <div class="sec">${secHead("Three plans, three purposes", "Every outcome is paid once, by one plan", src(9))}
    ${table(["", ...D.plans.map(p => p.n)], [["Purpose", "purpose"], ["Pays for", "pays"], ["Never pays for", "never"], ["Horizon", "horizon"], ["Vehicle", "vehicle"]].map(([l, k]) => [`<b>${l}</b>`, ...D.plans.map(p => p[k])]))}</div>
  <div class="sec grid g2">
    <div>${secHead("Pre-IPO retention bridge", "$2.14m cash bridge for 16 named executives over 36 months, inside a hard $2.57m pool cap", tag("assumption") + " " + src(10))}
      ${(() => { const R = D.bridgeReserve, P = D.bridgePool, tv = D.bridge.reduce((a, b) => a + b.tv, 0), mx = D.bridge.reduce((a, b) => a + b.mx, 0);
        return table(["Cohort", "Execs", "Base", "Target (36m)", "Target value", "Max value"], [...D.bridge.map(b => [b.n, b.e, "$" + b.base.toFixed(3) + "m", b.pct + "%", usd(b.tv), usd(b.mx)]), { cls: "total", cells: ["Named cohort", 16, "$5.100m", "–", usd(tv), usd(mx)] }, [R.n, "up to " + R.e, "$" + R.base.toFixed(3) + "m", R.pct + "%", usd(R.tv), usd(R.mx)], { cls: "total", cells: ["Pool cap (hard)", "up to 22", "$" + P.payroll.toFixed(3) + "m", "–", usd(P.tv), usd(P.mx)] }], [1, 2, 3, 4, 5]); })()}
      <p class="note">Three equal annual tranches of $712,500 at 12, 24 and 36 months from grant (listing +9, +21, +33) — 17.5% and 10% of base a year. Service half pays for verified continuity; performance half 0/50/100/150%. Anyone beyond the cap needs Board approval and a new affordability test; unused reserve lapses at listing +6 months. Accounted as an employee benefit (IAS 19 under IFRS), not IFRS 2.</p></div>
    <div>${secHead("Post-IPO LTI annual grant", "60% performance shares, 40% restricted shares", tag("assumption") + " " + src(11))}
      ${table(["Participant", "Base", "Grant", "Target value"], [...D.lti.map(l => [l.n, "$" + l.base.toFixed(3) + "m", l.pct + "%", usd(l.tv)]), { cls: "total", cells: ["Total", "$5.100m", "–", usd(2580000)] }], [1, 2, 3])}
      <h3 style="margin-top:16px">What the CEO receives, at grant price</h3>
      ${table(["Performance outcome", "Shares that vest", "CEO LTI value", "vs target"], D.ltiOutcomes.map(r => [r[0], r[1], usd(r[2]), r[3] + "%"]), [2, 3])}
      ${(() => { const t = D.ceoMix.reduce((a, r) => a + r[1], 0), fx = Math.round(D.ceoMix[0][1] / t * 100); return `<p class="small">CEO target pay <b>${usd(t)}</b>: ${D.ceoMix.map(r => `${r[0]} ${Math.round(r[1] / t * 100)}%`).join(" · ")} — <b>${fx}% fixed, ${100 - fx}% variable</b>.</p>`; })()}
      <p class="note">A 40% floor even at zero performance; 130% ceiling. Performance shares cliff-vest after three years; restricted shares vest a third a year to month 36. Relative TSR: 25th percentile 50%, median 100%, 75th 150%; capped at 100% if absolute TSR is negative. Why no options: a refiner's share price follows the margin cycle. RemCo discretion within ±20% with reasons disclosed.</p></div>
  </div>
  <div class="sec">${secHead("For the wider Group", "NEP is the governance reference point, not the pay template", tag("rec") + " " + src(13))}
    ${table(["", ...D.archetypes.cols], D.archetypes.rows.map(r => [`<b>${r[0]}</b>`, ...r.slice(1)]))}</div>
  ${more("rec", "More detail: prioritisation matrix, PROTECT safeguards and bridge terms", `
  ${secHead("Prioritisation matrix", "Impact against implementation complexity. Select a decision.", tag("analysis"))}
  <p class="note" style="margin:-6px 0 16px">The deck makes all five first-90-day decisions and does not score them. Positions here are this app's interpretation from each decision's cost, dependencies and legal conditions — challenge them.</p>
  <div class="matrix">
    <div class="panel">${matrixSvg(d.n)}</div>
    <div class="reclist">${D.decisions.map(x => `<button data-rec="${x.n}" class="${x.n === d.n ? "on" : ""}"><span class="num-badge">${x.n}</span><span><b style="font-weight:500">${x.h}</b><br><span class="small muted">Impact ${x.impact}/5 · Complexity ${x.cx}/5</span></span></button>`).join("")}</div>
  </div>
  <div class="rec-card sec" style="margin-top:20px">
    <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap"><div><div class="kicker">Decision ${d.n} · ${quad}</div><h2 style="margin-top:4px">${d.h}</h2></div><div>${tag("rec")} ${src(14)}</div></div>
    <dl>
      <dt>Rationale</dt><dd>${d.roots.map(r => `Addresses <b>${r}</b>: ${D.roots.find(x => x.id === r).h}.`).join(" ")} ${chains.map(c => `Insight ${c.id}: ${c.i}`).join(" ")}</dd>
      <dt>Expected benefit</dt><dd>${d.benefit} ${tag("analysis")}</dd>
      <dt>Owner</dt><dd>${d.own}</dd>
      <dt>Immediate action</dt><dd>${d.act}</dd>
      <dt>Financial implication</dt><dd>${d.fin} ${tag("assumption")}</dd>
      <dt>Evidence required</dt><dd>${d.ev}</dd>
      <dt>Success measure</dt><dd>${d.ok}</dd>
      <dt>Risk / reconsider if</dt><dd>${d.re}</dd>
      <dt>Dependencies</dt><dd>${d.deps} ${tag("analysis")}</dd>
      <dt>Priority</dt><dd>First 90 days (deck) · ${quad} (matrix)</dd>
    </dl>
  </div>
  <div class="sec">${secHead("Supporting recommendation: five PROTECT safeguards", "Due-diligence safeguards, not findings that current arrangements are defective", tag("rec") + " " + src(6))}
    ${table(["Safeguard", "What it requires", "Accountable", "Evidence required", "Deadline"], D.safeguards.map((s, i) => [`<b>${i + 1}. ${s.n}</b>`, s.req, s.own, s.ev, s.due]))}</div>
  <div class="sec">${secHead("Bridge terms if circumstances change", "", src(15))}
    <details class="ev"><summary><span style="flex:1">Delay, cancellation, leaver, safety-gate and clawback terms (Appendix A1)</span></summary><div class="body">${table(["If", "Then"], D.bridgeTerms)}</div></details></div>`)}`;
};

V.implementation = () => {
  const ph = state.phase;
  return `
  <div class="kicker">02 · The answer</div><h1>One owner per clock</h1>
  <p class="lede">Authority moves before listing, governance switches on at listing, and money is released gate by gate.</p>
  <div class="sec" style="margin-top:0">${secHead("Who owns each clock", "The NEP CEO owns all three, with no Group approval line. PROTECT runs across them", tag("rec") + " " + src(5))}
    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">${D.clocks.map(c => `<div class="panel">${clk(c.id)}<h3 style="margin:10px 0 4px">${c.owner}</h3><p class="small" style="margin:0">${c.desc}</p></div>`).join("")}</div></div>
  <div class="sec">${secHead("Where each Group executive goes", "NIP keeps capital, related-party approvals and enterprise risk through reserved matters and nominees", tag("rec") + " " + src(5))}
    ${table(["Category", "Executive", "Role and end date"], D.transitions)}</div>
  <p class="small muted">All ${D.timeline.length * 5} roadmap activities are proposed; none is reported complete.</p>
  ${secHead("Roadmap", "Select a phase to focus it", tag("rec") + " " + src(8))}
  <div class="tl ${ph != null ? "focus" : ""}">
    <div class="ph" style="cursor:default">Workstream</div>${D.phases.map((p, i) => `<button class="ph ${ph === i ? "on" : ""}" data-ph="${i}">${p}</button>`).join("")}
    ${D.timeline.map(r => `<div class="ws">${clk(r.ws)}<small style="margin-top:6px">${r.own}</small></div>${r.cells.map((c, i) => `<div class="c ${ph === i ? "on" : ""}"><span class="state">Proposed</span><br>${c}</div>`).join("")}`).join("")}
  </div>
  ${ph != null ? `<div class="detail"><div class="kicker">Phase ${ph + 1} of 5</div><h2 style="margin:4px 0 12px">${D.phases[ph]}</h2>
    <p class="small">Group executive time on NEP: <b>${(D.groupTime[ph].t === "fact" ? "" : "≤") + D.groupTime[ph].v}%</b> ${tag(D.groupTime[ph].t)}</p>
    ${table(["Workstream", "Owner", "Milestone"], D.timeline.map(r => [clk(r.ws), r.own, r.cells[ph]]))}
    <p style="margin-top:12px">${ph > 0 ? `<button class="btn ghost" data-ph="${ph - 1}">← ${D.phases[ph - 1]}</button> ` : ""}${ph < 4 ? `<button class="btn ghost" data-ph="${ph + 1}">${D.phases[ph + 1]} →</button>` : ""}</p></div>` : ""}
  <div class="sec">${secHead("Succession: emergency cover by day 30", "Two-deep cover for COO and Technical by listing +6 months. Cover is by role; the case names no individuals.", tag("rec") + " " + src(7))}
    ${table(["Role", "Emergency cover (day 30)", "Ready-now criteria", "External search trigger", "Ready-later pipeline", "Readiness evidence"], D.succession.map(r => [`<b>${r[0]}</b>`, ...r.slice(1)]))}
    <p class="note">If succession fails: a COO or Technical vacancy in ramp-up leaves no one with authority to stop or restart units, and one site cannot move the volume elsewhere. Assessment and development: $138,000 in year one. ${src("7, 18")}</p></div>
  ${more("impl", "More detail: Group time, spending gates, communication, resources and risks", `
  <div class="sec grid g2">
    <div class="panel">${secHead("Group executive time on NEP", "70% today (fact); proposed ceilings thereafter")}${stepLine(D.groupTime)}</div>
    <div class="panel">${secHead("Spending gates", "Money is released only when each gate passes")}
      ${D.timeline.find(r => r.ws === "GATES").cells.map((c, i) => `<p class="small"><b>${D.phases[i]}</b> — ${c}</p>`).join("")}${tag("rec")} ${src(8)}</div>
  </div>
  <div class="sec">${secHead("Communication: named individuals first, in writing", "Nobody learns their terms in a group or from a rumour", tag("rec") + " " + src("9, 22"))}
    ${table(["Audience", "What they need to hear", "Messenger", "When", "Channel"], D.comms.map(r => [`<b>${r[0]}</b>`, ...r.slice(1)]))}
    <p class="note">Feedback loop: 30-day pulse check of all 50 executives; regretted exits and open questions reported to RemCo monthly until listing +6 months.</p></div>
  <div class="sec grid g2">
    <div>${secHead("Resource requirements", "", tag("assumption") + " " + src("5, 17"))}${table(["Resource", "Cost", "Implication"], D.resources)}</div>
    <div>${secHead("Risk mitigation", "Each decision carries a reopening trigger")}${table(["Decision", "Reconsider if"], D.decisions.map(d => [d.n + ". " + d.h.split(" ").slice(0, 6).join(" ") + "…", d.re]))}</div>
  </div>`)}`;
};

V.performance = () => {
  const list = D.kpiDefs.filter(k => (state.kpiTier === "all" || k.tier === state.kpiTier) && (state.kpiClock === "all" || k.c === state.kpiClock));
  const chip = (key, v, l) => `<button class="chip ${state[key] === v ? "on" : ""}" data-f="${key}" data-v="${v}">${l}</button>`;
  return `
  <div class="kicker">Appendix A3</div><h1>Performance Intelligence</h1>
  <p class="lede">How the Board will know the solution is working. Targets come from the deck; there is no actual performance data yet.</p>
  <div class="verdict none" style="margin-bottom:24px">No actual results are shown anywhere on this page. Baselines depend on the 30-day time and escalation logs, which have not been reported.</div>
  <div class="filters">${chip("kpiTier", "all", "All KPIs")}${chip("kpiTier", "Strategic", "Strategic")}${chip("kpiTier", "Operational", "Operational")}<span class="sep"></span>
    ${["all", "RUN", "BUILD", "LIST", "PROTECT", "PEOPLE"].map(c => chip("kpiClock", c, c === "all" ? "All clocks" : c[0] + c.slice(1).toLowerCase())).join("")}</div>
  <div class="grid g2">${list.map(k => `<div class="panel">
    <div style="display:flex;justify-content:space-between;gap:8px;align-items:center">${clk(k.c)}<span class="small muted">${k.tier}</span></div>
    <h3 style="margin:10px 0 12px">${k.k}</h3>
    <div class="out" style="grid-template-columns:1fr 1fr 1fr"><div><span>Target</span><p class="small" style="margin:4px 0 0;color:var(--ink)"><b>${k.target}</b></p></div><div><span>Baseline</span><p class="small" style="margin:4px 0 0;color:var(--ink)">${k.base}</p></div><div style="border-style:dashed"><span>Actual</span><p class="small muted" style="margin:4px 0 0">No data yet</p></div></div>
    <p class="small" style="margin-top:12px"><b>Method:</b> ${k.how}</p>
    <p class="small"><b>Frequency:</b> ${k.freq} · <b>Owner:</b> ${k.owner}</p>
    <p class="small" style="color:var(--bad)"><b>Escalate:</b> ${k.esc}</p>${tag("rec")} ${src(k.s)}</div>`).join("") || `<div class="emptyst">No KPIs match.</div>`}</div>
  <div class="sec grid g2">
    <div class="panel">${secHead("Trajectory: Group time on NEP", "Dashed = proposed ceiling. Only the 70% starting point is a fact.")}${stepLine(D.groupTime)}<p class="note">Actual monthly readings will plot here once the time log runs.</p></div>
    <div class="panel">${secHead("Measurement methodology", "", src("11, 12, 14"))}
      <ul class="clean small"><li>Measures in gold on slide 14 are re-tested at the next Board meeting and stay provisional until 30-day baselines are confirmed.</li>
      <li>LTI payout: 0% below threshold, 50% at threshold, 100% at target, 150% maximum, straight line between.</li>
      <li>Outcomes independently certified before vesting; RemCo sets targets before each cycle.</li>
      <li>Annual reliability (STI) and three-year average reliability (LTI) are different outcomes; RemCo discloses both.</li>
      <li>Affordability: programme cash at maximum ≤3% of available cash, tested at each spending gate.</li></ul></div>
  </div>
  <div class="sec">${secHead("Reporting structure", "", tag("rec") + " " + src("5, 6, 8"))}${table(["Forum", "Reviews", "Frequency"], D.reporting)}</div>`;
};

V.decision = () => {
  const gateWhen = ["Now", "At listing", "Listing +3m", "Listing +12m"], gates = D.timeline.find(r => r.ws === "GATES").cells.filter(c => /^Gate/.test(c));
  const v = state.votes, nA = D.decisions.filter(d => v[d.n] === "a").length, nH = D.decisions.filter(d => v[d.n] === "h").length;
  const step = (roman, k, body, cls = "") => `<div class="${cls}"><span class="roman">${roman}</span><span class="kicker">${k}</span><p>${body}</p></div>`;
  return `
  <div class="stance" role="status" aria-label="Board stance simulation"><b>BOARD STANCE · SIMULATION</b><span>${nA} APPROVED</span><span>${nH} HELD</span><span>${5 - nA - nH} UNDECIDED</span>
    <div class="track" aria-hidden="true"><div style="width:${nA * 20}%;background:var(--ink)"></div><div style="width:${nH * 20}%;background:var(--card)"></div></div>
    <button class="btn ghost" data-vote="reset">RESET</button></div>
  <div class="kicker">05 · The ask</div>
  <h1>Approve the architecture.<br><em>Verify</em> before money moves.</h1>
  <div class="sec">${secHead("<span class=\"kicker\" style=\"color:var(--ink);font-size:13px\">The five decisions · first 90 days</span>", "", "<span class=\"src\">Recommendation · slide 14 · stances are a simulation, not a record</span>")}
    ${D.decisions.map(d => { const s = v[d.n] || ""; return `<article class="dcard ${s}"><div class="bigN" aria-hidden="true">${d.n}</div>
      <div class="main"><h3>${d.h}</h3><p class="src" style="border:0">OWNER · ${d.own}</p><p><b>Next:</b> ${d.act}</p><p class="small"><b>Success:</b> ${d.ok}</p><p><a href="#recommendations" data-rec="${d.n}" class="src">Why this decision →</a></p></div>
      <div class="aside"><div class="cells"><div><span class="k">YEAR ONE · ASSUMPTION</span><b style="font-family:var(--mono)">${d.fin.split(":")[0]}</b></div><div><span class="k">EVIDENCE FIRST</span>${d.ev}</div></div>
        <p class="re" style="margin:0"><span class="k">REOPEN IF · </span>${d.re}</p>
        <div class="vote" role="group" aria-label="Board stance on decision ${d.n}"><button class="a ${s === "a" ? "on" : ""}" aria-pressed="${s === "a"}" data-vote="${d.n}:a">Approve</button><button class="h ${s === "h" ? "on" : ""}" aria-pressed="${s === "h"}" data-vote="${d.n}:h">Hold</button></div></div></article>`; }).join("")}</div>
  <section class="closer"><p><em>$4.70m</em> at target, $5.88m at maximum — <i>paid only once it's verified.</i></p><a class="btn gold" href="#briefing">← Back to the briefing</a></section>
  ${more("dec", "More detail: the argument in four steps and how money is released", `
  <section class="argument sec" aria-label="The argument in four steps">
    ${step("i.", "The challenge", esc(D.challenge))}
    ${step("ii.", "What we established", "70% of Group executive time goes to NEP, decisions escalate to Group, and retention promises are inconsistent. " + tag("fact"))}
    ${step("iii.", "What it means", "Key-person risk is value risk on one site, and every outcome must be paid once, by one plan. " + tag("analysis"))}
    ${step("iv.", "Our direction", esc(D.recommendation), "last")}
  </section>
  <div class="sec">${secHead("<span class=\"kicker\" style=\"color:var(--ink);font-size:13px\">How money is released</span>", "", "<span class=\"src\">All proposed · none passed · slide 8</span>")}
    <ol class="gates">${gates.map((g, i) => `<li><div class="st"><b>${i}</b>${i < 3 ? "<i></i>" : ""}</div><span class="when">${gateWhen[i].toUpperCase()}</span><span>${g.split(": ").slice(1).join(": ").replace(/^./, c => c.toUpperCase())}.</span></li>`).join("")}</ol></div>
`)}`;
};

// Main routes follow the Board pitch; `app` routes are reference material outside the guided path
const ROUTES = [
  { id: "briefing", n: "00", short: "Briefing", t: "Executive Briefing", d: "What is the answer?" },
  { id: "diagnosis", n: "01", short: "What's wrong", t: "Diagnosis", d: "What is actually wrong?" },
  { id: "implementation", n: "02", short: "The answer", t: "The Answer", d: "Who owns what, and by when?" },
  { id: "workbench", n: "03", short: "The money", t: "The Money", d: "Can NEP afford it, and do the numbers hold?", mount: mountWorkbench },
  { id: "recommendations", n: "04", short: "Reward", t: "Reward", d: "How are people paid to stay and perform?" },
  { id: "decision", n: "05", short: "The ask", t: "Decision Room", d: "What must the Board decide?" },
  { id: "research", n: "A1", short: "Evidence", t: "Research & Evidence", d: "What do we know, and from where?", app: true },
  { id: "insights", n: "A2", short: "Insights", t: "Strategic Insights", d: "How does evidence become a decision?", app: true },
  { id: "performance", n: "A3", short: "KPIs", t: "Performance Intelligence", d: "How will we know it works?", app: true },
];
const MAIN = ROUTES.filter(r => !r.app);

/* ---------- Shell: nav, router, events ---------- */
const navA = r => `<a href="#${r.id}" data-id="${r.id}"><b>${r.n}</b>${r.short}</a>`;
$("#nav").innerHTML = MAIN.map(navA).join("") + `<span class="nav-sep">Appendix</span>` + ROUTES.filter(r => r.app).map(navA).join("");
$("#legend").innerHTML = `<strong>EVIDENCE KEY</strong>` + Object.keys(D.types).map(tag).join("") + `<span class="note2">${esc(D.meta.caveat)}</span>`;

const cur = () => ROUTES.find(r => r.id === location.hash.slice(1)) || ROUTES[0];
function render(keepScroll) {
  const r = cur(), view = $("#view"), y = scrollY;
  view.innerHTML = V[r.id]();
  r.mount && r.mount(view);
  $$("#nav a").forEach(a => a.classList.toggle("on", a.dataset.id === r.id));
  $("#crumbs").innerHTML = r.id === "briefing" ? `<strong>Executive Briefing</strong>` : `<a href="#briefing">Executive Briefing</a><span>/</span>${r.app ? "Appendix" : "Step"} ${r.n}<span>/</span><strong>${r.t}</strong>`;
  const i = MAIN.indexOf(r), nx = MAIN[i + 1];
  $("#step").textContent = r.app ? "Appendix" : `${i + 1} / ${MAIN.length}`;
  $("#progress div").style.width = r.app ? "0%" : ((i + 1) / MAIN.length) * 100 + "%";
  $("#prev").disabled = i <= 0; $("#next").disabled = !r.app && !nx;
  $("#next").textContent = r.app ? "Back to the pitch →" : nx ? `Next: ${nx.short} →` : "Next →";
  document.title = `${r.t} · Wakanda Command Centre`;
  keepScroll ? scrollTo(0, y) : scrollTo(0, 0);
}
const rerender = () => render(true);
addEventListener("hashchange", () => { render(); $("#view").focus({ preventScroll: true }); });

// Delegated interactions inside views
$("#view").addEventListener("click", e => {
  const t = e.target.closest("[data-vote],[data-root],[data-f],[data-chain],[data-rec],[data-ph],.mpt,#clearChain,#evbars rect");
  if (!t) return;
  if (t.dataset.vote) { const [n, s] = t.dataset.vote.split(":"); if (n === "reset") state.votes = {}; else state.votes = { ...state.votes, [n]: state.votes[n] === s ? undefined : s }; rerender(); }
  else if (t.dataset.root) { state.root = t.dataset.root; rerender(); }
  else if (t.dataset.f) { state[t.dataset.f] = t.dataset.v; rerender(); }
  else if (t.dataset.chain) { state.chain = state.chain === t.dataset.chain ? null : t.dataset.chain; rerender(); }
  else if (t.dataset.rec) { state.rec = +t.dataset.rec; state.open.rec = true; if (cur().id === "recommendations") { e.preventDefault(); rerender(); } }
  else if (t.dataset.ph) { state.phase = state.phase === +t.dataset.ph && t.classList.contains("ph") ? null : +t.dataset.ph; rerender(); }
  else if (t.classList.contains("mpt")) { state.rec = +t.dataset.n; rerender(); }
  else if (t.id === "clearChain") { state.chain = null; rerender(); }
  else if (t.tagName === "rect") { const i = $$("#evbars rect").indexOf(t); const k = Object.keys(D.types)[i]; state.evType = state.evType === k ? "all" : k; rerender(); }
});
$("#view").addEventListener("toggle", e => { if (e.target.dataset && e.target.dataset.k) state.open[e.target.dataset.k] = e.target.open; }, true);
$("#view").addEventListener("keydown", e => { if (e.key === "Enter" && e.target.dataset.chain) e.target.click(); });
$("#view").addEventListener("input", e => { if (e.target.id === "evText") { state.evText = e.target.value; rerender(); const i = $("#evText"); i.focus(); i.setSelectionRange(i.value.length, i.value.length); } });

// Tooltips
const tip = $("#tip");
document.addEventListener("mouseover", e => { const t = e.target.closest("[data-tip]"); if (t) { tip.textContent = t.dataset.tip; tip.classList.add("on"); } else tip.classList.remove("on"); });
document.addEventListener("mousemove", e => { if (!tip.classList.contains("on")) return; const x = Math.min(e.clientX + 14, innerWidth - tip.offsetWidth - 8); tip.style.left = x + "px"; tip.style.top = e.clientY + 16 + "px"; });

// Presentation mode
const go = d => { const i = MAIN.indexOf(cur()); location.hash = (i < 0 ? MAIN[0] : MAIN[i + d] || MAIN[i]).id; };
const setPresent = on => { document.body.classList.toggle("present", on); $("#present").setAttribute("aria-pressed", on); $("#present").textContent = on ? "Exit guided briefing" : "Start guided briefing"; if (on && cur().id !== "briefing") location.hash = "briefing"; };
$("#present").onclick = () => setPresent(!document.body.classList.contains("present"));
$("#prev").onclick = () => go(-1); $("#next").onclick = () => go(1);

// Search: index every view's rendered text, so search always matches what is on screen
const q = $("#q"), res = $("#results");
let index = null, sel = -1;
function buildIndex() {
  const saved = JSON.stringify(state), tmp = document.createElement("div"); index = [];
  ROUTES.forEach(r => {
    tmp.innerHTML = V[r.id]();
    const seen = new Set();
    $$("h1,h2,h3,p,li,td,summary,dd,.cell,.node,.subqs div,.kpi .l", tmp).forEach(n => {
      const s = n.textContent.replace(/\s+/g, " ").trim();
      if (s.length > 3 && !seen.has(s)) { seen.add(s); index.push({ r, s }); }
    });
  });
  // hidden detail states (other roots, chains, decisions, phases) are indexed via the data directly
  D.roots.forEach(x => index.push({ r: ROUTES.find(r => r.id === "diagnosis"), s: `${x.id} ${x.h}: ${x.consequence} ${x.test}`, set: { root: x.id } }));
  D.chains.forEach(x => index.push({ r: ROUTES.find(r => r.id === "insights"), s: `${x.id} ${x.i} ${x.m}`, set: { chain: x.id } }));
  D.decisions.forEach(x => index.push({ r: ROUTES.find(r => r.id === "recommendations"), s: `Decision ${x.n}: ${x.h} — ${x.benefit}. ${x.deps}`, set: { rec: x.n } }));
  Object.assign(state, JSON.parse(saved));
}
function search() {
  const term = q.value.trim().toLowerCase(); sel = -1;
  if (term.length < 2) { res.classList.remove("open"); return; }
  index || buildIndex();
  const hits = index.filter(h => h.s.toLowerCase().includes(term)).slice(0, 25);
  const hl = s => { const i = s.toLowerCase().indexOf(term), a = Math.max(0, i - 50); return (a ? "…" : "") + esc(s.slice(a, i)) + "<mark>" + esc(s.slice(i, i + term.length)) + "</mark>" + esc(s.slice(i + term.length, i + term.length + 90)) + "…"; };
  res.innerHTML = hits.length ? hits.map((h, i) => `<a href="#${h.r.id}" data-i="${i}"><small>${h.r.n} · ${h.r.t}</small>${hl(h.s)}</a>`).join("") : `<div class="empty">No matches for “${esc(q.value)}”.</div>`;
  res._hits = hits; res.classList.add("open");
}
function openHit(i) {
  const h = res._hits[i]; if (!h) return;
  if (h.set) Object.assign(state, h.set);
  res.classList.remove("open"); q.blur();
  const term = q.value.trim().toLowerCase();
  if (location.hash.slice(1) === h.r.id) render(); else location.hash = h.r.id;
  setTimeout(() => { // scroll to and flash the matching element
    const n = $$("#view h2,#view h3,#view p,#view li,#view td,#view summary,#view dd,#view .cell").find(n => n.textContent.toLowerCase().includes(term));
    if (n) { n.scrollIntoView({ block: "center", behavior: "smooth" }); n.style.transition = "background .6s"; n.style.background = "var(--gold-soft)"; setTimeout(() => n.style.background = "", 1600); }
  }, 60);
}
q.addEventListener("input", search);
q.addEventListener("focus", search);
res.addEventListener("click", e => { const a = e.target.closest("a"); if (a) { e.preventDefault(); openHit(+a.dataset.i); } });
q.addEventListener("keydown", e => {
  const items = $$("a", res);
  if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(0, Math.min(items.length - 1, sel + (e.key === "ArrowDown" ? 1 : -1))); items.forEach((a, i) => a.classList.toggle("sel", i === sel)); items[sel] && items[sel].scrollIntoView({ block: "nearest" }); }
  if (e.key === "Enter") openHit(sel < 0 ? 0 : sel);
  if (e.key === "Escape") { res.classList.remove("open"); q.blur(); }
});
document.addEventListener("click", e => { if (!e.target.closest(".search")) res.classList.remove("open"); });
document.addEventListener("keydown", e => {
  const typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
  if (e.key === "/" && !typing) { e.preventDefault(); q.focus(); }
  if (typing) return;
  if (document.body.classList.contains("present") && (e.key === "ArrowRight" || e.key === "PageDown")) go(1);
  if (document.body.classList.contains("present") && (e.key === "ArrowLeft" || e.key === "PageUp")) go(-1);
  if (e.key === "Escape" && document.body.classList.contains("present")) setPresent(false);
});

// sticky Decision Room stance bar sits under the masthead, whose height varies with wrapping
const setHdr = () => document.documentElement.style.setProperty("--hdr", $("#top").offsetHeight + 8 + "px");
addEventListener("resize", setHdr); setHdr();
render();
})();
