// Single source of truth. Every item carries `t` (evidence type) and `s` (source slide in the final deck PDF, 23 pages incl. appendix A1–A8).
// Money figures reconcile to NEP_Financial_Calculations_Final.xlsx (run `node check.js`).
// Types: fact = case fact, assumption = labelled planning assumption, rec = recommendation,
// analysis = analytical interpretation, ext = external research, na = unavailable.
window.D = {
  meta: {
    title: "RUN. BUILD. LIST.",
    sub: "An IPO-ready operating model, executive reward architecture and financially governed leadership transition for NIP and NEP",
    client: "NIP Group (controlling shareholder) and NEP, its refinery and petrochemicals business preparing to list",
    audience: "NIP Group Chief People Officer and NEP's incoming independent directors",
    event: "MDX Human Capital Consulting Challenge 2026 — Team Wakanda",
    tagline: "Three clocks. One owner each. One set of books everyone can trust.",
    caveat: "All NEP figures are case facts or labelled planning assumptions. No actual NEP payroll, earnings or cash data is used.",
    source: "RUN_BUILD_LIST_Final_HCCC_with_Appendix.pdf",
    workbook: "NEP_Financial_Calculations_Final.xlsx",
  },

  types: {
    fact: { label: "Case fact", desc: "Stated in the case" },
    assumption: { label: "Assumption", desc: "Planning assumption labelled in the deck; not NEP results" },
    rec: { label: "Recommendation", desc: "Team Wakanda's proposal" },
    analysis: { label: "Interpretation", desc: "Analytical reasoning drawn from facts and assumptions" },
    ext: { label: "External", desc: "Outside research or benchmark" },
    na: { label: "Unavailable", desc: "Not in the case or deck" },
  },

  kpis: [
    { v: "3 months", l: "to listing; independent Board, RemCo and continuous disclosure arrive with it", t: "fact", s: 3 },
    { v: "590,000 bpd", l: "single-site refinery and petrochemicals complex in early ramp-up; ambition ≈1.1m bpd", t: "fact", s: 3 },
    { v: "≈50", l: "executives run operations, the IPO and the expansion between them", t: "fact", s: 3 },
    { v: "70%", l: "of the Group executive team's time goes to NEP", t: "fact", s: 3 },
    { v: "$4.70m", l: "illustrative first-year gross programme cash at target ($5.88m at maximum)", t: "assumption", s: 3 },
    { v: "5", l: "Board decisions required in the first 90 days", t: "rec", s: 14 },
  ],

  challenge: "NEP has three jobs on one leadership bench: run a single-site refinery that is still ramping up, build the expansion to about 1.1 million barrels a day, and list in about three months.",
  recommendation: "Give each job one owner under the NEP CEO, pay executives only for what they control, and make NEP's economics verifiable before any money is released.",
  ask: "Approve the architecture now. Release funding only when the economics, people risks and legal conditions have been independently verified.",

  clocks: [
    { id: "RUN", owner: "NEP COO", what: "Operate the plant", desc: "Independently accountable refinery operations under the NEP COO, with stop-work authority and process-safety assurance that never escalates to Group.", risk: "Unsafe operations, unplanned downtime and weak reliability while maintenance systems mature", why: "One site: lost barrels cannot be made up at another plant.", s: 21 },
    { id: "BUILD", owner: "Expansion Director", what: "Grow to 1.1m bpd", desc: "Expansion accountability separated from daily operations under an Expansion Director, governed by capital and project stage gates.", risk: "Cost overruns, schedule slippage and unsafe work on live units during expansion", why: "The path to about 1.1 million bpd is what the IPO is raising money to fund.", s: 21 },
    { id: "LIST", owner: "NEP CFO", what: "Listing in 3 months", desc: "IPO readiness, public-company controls and transparent executive incentives: a selective cash bridge, then a performance-led share plan.", risk: "Reporting, disclosure, governance and investor confidence", why: "After listing, an outage or control failure is a disclosure event.", s: 21 },
    { id: "PROTECT", owner: "NEP CFO + legal lead", what: "Enabling principle", desc: "Independently verifiable economics: related-party governance, financial transparency and funding released only after verification. An enabling principle across all three clocks, not a fourth clock.", risk: "Economics that independent directors cannot verify", why: "Funding is released only after verification.", s: 3 },
  ],

  findings: [
    { k: "R1", h: "Authority sits with people, not roles", b: "NEP operating decisions escalate to Group leaders; other businesses report slower decisions.", t: "analysis", s: 4 },
    { k: "R2", h: "One bench is running three clocks", b: "The same executives run the IPO, operations and expansion; successors exist on paper, few are ready.", t: "analysis", s: 4 },
    { k: "R3", h: "Reward is a set of promises, not a system", b: "Similar roles hold different retention promises; executives ask whether upside disappears at listing.", t: "analysis", s: 4 },
  ],

  objectives: [
    "Design an IPO-ready operating model that separates running, building and listing (Challenge 1)",
    "Design an executive reward architecture across pre-IPO, annual and post-IPO horizons (Challenge 2)",
    "Set a financially governed leadership transition and differentiated variable pay across NIP (Challenge 3)",
  ],
  scope: {
    in: ["NEP operating model and decision rights", "Group executive transition and time allocation", "Succession for six critical roles", "Retention bridge, STI and LTI design for 16 named-by-role executives", "Variable-pay guardrails across NIP's four business archetypes", "Funding gates and affordability test"],
    out: ["Actual NEP payroll, earnings or cash data (not available)", "IPO transaction and adviser fees not already covered", "Existing retention obligations and current bonus spend", "Financing and tax effects", "Other Group companies' incentive costs (costed later)"],
    s: 17,
  },

  principles: [
    ["P1", "Authority follows accountability for the barrel"],
    ["P2", "One clock, one owner; no dual-hatting after listing"],
    ["P3", "Pay for what each business controls, on its own clock"],
    ["P4", "Safety and integrity gate every award"],
    ["P5", "Verify the economics before releasing money"],
  ],

  // Hypothesis tree (slide 3). Status is honest: tests are defined, not yet run.
  roots: [
    { id: "R1", h: "Authority sits with people, not roles",
      symptoms: "NEP operating decisions escalate to Group leaders. Other businesses report slower decisions and less Group access.",
      consequence: "Group leaders become NEP's bottleneck. After listing, informal escalation mixes inside information with Group roles.",
      intervention: "Run–Build–List accountability under the NEP CEO; decision-rights matrix; NIP acts through reserved matters.",
      test: "30-day escalation log: share of escalations that are routine operating calls; decision turnaround in non-NEP businesses.",
      qs: ["Are routine operating calls escalating to Group?", "Is non-NEP decision speed suffering?", "Would post-listing escalation breach inside-information rules?"],
      decisions: [1, 2], s: 4, ref: "slides 5–6" },
    { id: "R2", h: "One bench is running three clocks",
      symptoms: "The same executives run the IPO, operations and expansion. Successors exist on paper; few are ready. 70% of Group executive time goes to NEP.",
      consequence: "Key-person exposure while a single-site plant ramps up; execution risk on both the IPO and the expansion.",
      intervention: "One owner per clock; temporary IPO office; six-role succession with two-deep cover for COO and Technical.",
      test: "Time log by clock for the top executives; independent readiness assessment of each named successor.",
      qs: ["How is top-executive time split across Run, Build and List?", "Are named successors ready now?", "Which absence could stop the plant?"],
      decisions: [1, 3], s: 4, ref: "slides 5, 7–8" },
    { id: "R3", h: "Reward is a set of promises, not a system",
      symptoms: "Similar roles hold different retention promises. Executives ask whether private-company upside disappears at listing.",
      consequence: "Fairness and legal-obligation risk; regretted exits of scarce operators when NEP can least absorb them.",
      intervention: "Register and reconcile promises; selective cash bridge; share plan with one rulebook.",
      test: "Register of every existing promise with legal status and value; retention-risk review of all 50 executives.",
      qs: ["What promises exist, and are they binding?", "Who is at real risk of leaving?", "Does any outcome get paid twice?"],
      decisions: [4, 5], s: 4, ref: "slides 9–11" },
  ],

  // Research & evidence register. clock: RUN/BUILD/LIST/PROTECT/PEOPLE
  evidence: [
    { id: "E1", t: "fact", c: "LIST", s: 3, h: "Listing is three months away", d: "An independent Board, RemCo and continuous disclosure arrive with listing." },
    { id: "E2", t: "fact", c: "RUN", s: 3, h: "590,000 bpd single-site complex in early ramp-up", d: "Refinery and petrochemicals complex on one site; ambition of about 1.1 million bpd." },
    { id: "E3", t: "fact", c: "PEOPLE", s: 3, h: "About 50 executives run three jobs", d: "Operations, the IPO and the expansion are run by the same ~50 executives." },
    { id: "E4", t: "fact", c: "PEOPLE", s: 3, h: "70% of Group executive time goes to NEP", d: "Used as the baseline for the proposed Group-time ceilings (≤50% at listing to ≤30% at +12 months)." },
    { id: "E5", t: "fact", c: "RUN", s: 4, h: "NEP operating decisions escalate to Group leaders", d: "Other businesses report slower decisions and less Group access." },
    { id: "E6", t: "fact", c: "PEOPLE", s: 4, h: "Successors exist on paper; few are ready", d: "Key-person exposure while a single-site plant ramps up." },
    { id: "E7", t: "fact", c: "PEOPLE", s: 4, h: "Similar roles hold different retention promises", d: "Executives ask whether private-company upside disappears at listing. The case shows inconsistent promises (slide 13)." },
    { id: "E8", t: "assumption", c: "RUN", s: 21, h: "One utilisation point ≈ 2.15m barrels a year", d: "590,000 bpd × 365 × 1% = 2.1535m bbl. At an illustrative $3/bbl margin ≈ $6.46m a year of contribution sensitivity. After expansion: 4.015m barrels per point. Not EBITDA or cash." },
    { id: "E9", t: "assumption", c: "RUN", s: 21, h: "Three-scenario operating sensitivity", d: "Utilisation 70/80/90% and margins $3/$6/$9 per barrel are planning assumptions, not NEP results." },
    { id: "E10", t: "ext", c: "PEOPLE", s: 16, h: "Benchmark: Marathon Petroleum 2025 proxy", d: "LTI mix generally 60% PSUs, 20% RSUs, 20% MPLX phantom units; no stock options since 2020. Supports the structure, not NEP pay levels." },
    { id: "E11", t: "ext", c: "PROTECT", s: 6, h: "Accounting standards referenced", d: "IAS 24 related-party disclosure applies only if NEP reports under IFRS. Bridge accounted as an employee benefit (IAS 19), not IFRS 2; share grants measured under IFRS 2 with TSR valued by Monte Carlo." },
    { id: "E12", t: "analysis", c: "RUN", s: 21, h: "Each clock carries a different risk to value", d: "RUN: downtime on a single site; BUILD: overruns and unsafe live-unit work; LIST: an outage or control failure becomes a disclosure event." },
    { id: "E13", t: "analysis", c: "PEOPLE", s: 11, h: "Options pay most for what management controls least", d: "A refiner's share price follows the margin cycle, so options were excluded; upside comes from performance shares paying up to 150%." },
    { id: "E14", t: "analysis", c: "PROTECT", s: 12, h: "Capacity does not prove affordability", d: "Affordability needs available cash after maintenance capex, debt service, obligations, committed expansion funding and a liquidity buffer." },
    { id: "E15", t: "analysis", c: "PROTECT", s: 6, h: "Safeguards are due diligence, not findings of defect", d: "The five PROTECT safeguards are not findings that current intercompany arrangements are defective. Subject to jurisdiction-specific legal confirmation." },
    { id: "E16", t: "analysis", c: "PEOPLE", s: 13, h: "Four archetypes create value on different clocks", d: "Start-ups, listed entities, mature non-listed businesses and the Group centre need different measures, vehicles and horizons under common guardrails." },
    { id: "E17", t: "na", c: "PROTECT", s: 12, h: "NEP actual cash, margins and operating costs", d: "Not in the case. Needed to run the affordability test and to turn throughput into cash." },
    { id: "E18", t: "na", c: "PEOPLE", s: 17, h: "Current bonus spend and existing retention obligations", d: "Unknown; excluded from the cost build." },
    { id: "E19", t: "na", c: "LIST", s: 16, h: "NEP share count", d: "Needed for a dilution ratio; none is claimed." },
  ],
  limitations: [
    "No actual NEP payroll, earnings, margins or cash data is used; all money figures are planning assumptions.",
    "The case names no individuals, so succession cover is by role; names follow the day-60 assessment.",
    "Legal conclusions are subject to jurisdiction-specific confirmation.",
    "Only one external pay benchmark (Marathon Petroleum, 2025 proxy) is cited, and only for structure.",
    "No primary customer or stakeholder interviews; stakeholder insight comes from the case narrative.",
    "No market-sizing or competitor dataset is in the deck.",
  ],

  scenarios: [
    { n: "Downside", u: 70, tp: 150.7, m: 3, c: 452, v: 6.46 },
    { n: "Base", u: 80, tp: 172.3, m: 6, c: 1034, v: 12.92 },
    { n: "Upside", u: 90, tp: 193.8, m: 9, c: 1744, v: 19.38 },
  ],

  payout: { // $m, slide 12
    cols: ["Downside", "Target", "Maximum"],
    rows: [
      { n: "Transition programme", v: [1.978, 1.978, 1.978] },
      { n: "Annual STI", v: [0, 2.01, 3.015] },
      { n: "Bridge tranche 1", v: [0.356, 0.713, 0.891] },
    ],
    total: [2.334, 4.701, 5.884],
    cashNeeded: [77.8, 156.7, 196.1],
  },

  costBuild: [ // slide 17
    { n: "IPO programme staffing (6 months)", type: "One-off", v: 630000 },
    { n: "Succession assessment and development", type: "One-off", v: 138000 },
    { n: "Reporting and disclosure lead", type: "Recurring", v: 320000 },
    { n: "Related-party and treasury controller", type: "Recurring", v: 260000 },
    { n: "Independent reliability assurance", type: "Recurring", v: 180000 },
    { n: "Legal and contract diligence", type: "One-off", v: 240000 },
    { n: "Reward valuation and accounting", type: "Recurring", v: 140000 },
    { n: "Systems and communication", type: "One-off", v: 70000 },
    { n: "Annual target STI (16 executives)", type: "Incentive", v: 2010000 },
    { n: "Retention bridge tranche 1 at target", type: "Incentive", v: 712500 },
  ],

  bridge: [
    { n: "Critical roles (six succession roles)", e: 6, base: 2.7, pct: 52.5, tv: 1417500, mx: 1771875 },
    { n: "Pivotal executives", e: 10, base: 2.4, pct: 30, tv: 720000, mx: 900000 },
  ],
  // slide 10: reserve for up to 6 more from the other 34, at pivotal terms; hard pool cap = named 16 + reserve
  bridgeReserve: { n: "Reserve: up to 6 from the other 34", e: 6, base: 1.44, pct: 30, tv: 432000, mx: 540000 },
  bridgePool: { tv: 2569500, mx: 3211875, payroll: 6.54 },

  // slide 11: CEO LTI value by performance outcome, at grant price
  ltiOutcomes: [
    ["Below threshold", "Restricted 40% only", 240000, 40],
    ["Threshold", "40% + 60% × 50%", 420000, 70],
    ["Target", "40% + 60% × 100%", 600000, 100],
    ["Maximum", "40% + 60% × 150%", 780000, 130],
  ],
  ceoMix: [ ["Base salary", 600000], ["Target STI", 360000], ["Target LTI", 600000] ], // $1.56m: 38% fixed, 62% variable

  // slide 2: key assumptions, what changes if they are wrong
  keyAssumptions: [
    ["Case facts", "IPO in about three months; about 50 NEP executives; 590,000 bpd capacity, ambition about 1.1m bpd; 70% of Group executive time on NEP; founder majority control after listing", "fact", "The case is the only source; no outside company data drives a number"],
    ["Data gaps", "No payroll, current bonus spend, margins, cash flow, share count or listing jurisdiction in the case", "na", "Every figure is a labelled planning number; legal points are subject to jurisdiction-specific confirmation"],
    ["Salaries", "CEO $600,000; five other critical roles $2.1m; ten pivotal executives $2.4m ($5.1m for the 16)", "assumption", "±20% moves first-year cash at target to $4.16m–$5.25m"],
    ["Incentive levels", "STI 60/50/25% of base; retention bridge 52.5%/30% over 36 months; LTI grant 100/60/30% a year; payouts 0–150% of target", "rec", "Not market medians; RemCo calibrates against benchmarking before any grant"],
    ["Transition cost", "$1.978m in year one across eight items; IPO adviser and transaction fees excluded", "assumption", "Drop the $0.24m legal diligence if the IPO advisers already cover related-party contracts"],
    ["Bonus baseline", "What the 16 are paid in bonuses today is unknown, so the $2.01m STI is a gross figure", "na", "New money at target is between $2.69m and $4.70m"],
    ["Affordability", "Programme cash at maximum must not exceed 3% of available cash, so at least $196.1m is needed", "rec", "Not an industry standard; the Board can set a different ceiling, and grants wait until it is tested"],
    ["Governance timing", "Incoming independent directors act as a shadow RemCo before listing; NEP reports under IFRS", "assumption", "NIP Board approves and the NEP RemCo ratifies at listing; accounting treatment re-checked"],
  ],

  // Workbook "Deck figure map": slide figure as rounded on the slide vs the workbook formula result.
  // Check passes within 1% or $5,000 (workbook rule). [slide, figure, shown, workbook value, source cell]
  figureMap: [
    [2, "First-year cash at target, salaries −20%", 4160000, 4156000, "Sensitivity!B4"],
    [2, "First-year cash at target, salaries +20%", 5250000, 5245000, "Sensitivity!D4"],
    [2, "Available cash needed at maximum (3% ceiling)", 196100000, 196120833.33, "Affordability!B15"],
    [3, "Transition programme", 1980000, 1978000, "Transition costs!C12"],
    [3, "Annual target STI (gross)", 2010000, 2010000, "Post-IPO STI-LTI!D7"],
    [3, "Retention bridge, tranche 1", 710000, 712500, "Pre-IPO retention!E6"],
    [3, "First-year gross cash at target", 4700000, 4700500, "Scenarios!C7"],
    [3, "First-year gross cash at maximum", 5880000, 5883625, "Scenarios!D7"],
    [3, "Certainly new money at target", 2690000, 2690500, "Scenarios!C15"],
    [3, "Annual equity grant target value", 2580000, 2580000, "Post-IPO STI-LTI!F7"],
    [4, "Barrels per utilisation point a year", 2150000, 2153500, "Operating sensitivity!C8"],
    [10, "Critical roles, target over 36 months", 1417500, 1417500, "Pre-IPO retention!D4"],
    [10, "Pivotal executives, target over 36 months", 720000, 720000, "Pre-IPO retention!D5"],
    [10, "Named cohort (16), target", 2137500, 2137500, "Pre-IPO retention!D6"],
    [10, "Named cohort (16), maximum", 2671875, 2671875, "Pre-IPO retention!F6"],
    [10, "Reserve (up to 6), target", 432000, 432000, "Pre-IPO retention!D16"],
    [10, "Pool cap, target", 2569500, 2569500, "Pre-IPO retention!D17"],
    [10, "Pool cap, maximum", 3211875, 3211875, "Pre-IPO retention!F17"],
    [10, "Each tranche (named cohort)", 712500, 712500, "Pre-IPO retention!E6"],
    [11, "Annual grant: CEO", 600000, 600000, "Post-IPO STI-LTI!F4"],
    [11, "Annual grant: 5 other critical", 1260000, 1260000, "Post-IPO STI-LTI!F5"],
    [11, "Annual grant: 10 pivotal", 720000, 720000, "Post-IPO STI-LTI!F6"],
    [11, "CEO LTI below threshold", 240000, 240000, "Post-IPO STI-LTI!C25"],
    [11, "CEO LTI at threshold", 420000, 420000, "Post-IPO STI-LTI!C26"],
    [11, "CEO LTI at maximum", 780000, 780000, "Post-IPO STI-LTI!C28"],
    [11, "CEO target pay", 1560000, 1560000, "Post-IPO STI-LTI!B19"],
    [12, "Downside first-year cash", 2334000, 2334250, "Scenarios!B7"],
    [12, "Maximum STI", 3015000, 3015000, "Scenarios!D5"],
    [12, "Bridge tranche 1 at maximum", 891000, 890625, "Scenarios!D6"],
    [12, "Available cash needed at target", 156700000, 156683333.33, "Scenarios!C8"],
    [12, "Extra cash if reserve fully used", 140000, 144000, "Scenarios!C17"],
    [14, "Decision 1 year-one cost", 810000, 810000, "Decision costs!B4"],
    [14, "Decision 2 year-one cost", 820000, 820000, "Decision costs!B5"],
    [14, "Decision 3 year-one cost", 140000, 138000, "Decision costs!B6"],
    [14, "Decision 4 year-one cost", 920000, 922500, "Decision costs!B7"],
    [14, "Decision 5 year-one cost (NEP STI, gross)", 2010000, 2010000, "Decision costs!B8"],
  ],

  // Workbook "Max exposure": commitments at target and maximum, cash and non-cash separated
  maxExposure: [
    ["Pre-IPO bridge, full 36 months", 2137500, 2671875, "Cash: listing +9, +21 and +33 months"],
    ["Annual STI, one year", 2010000, 3015000, "Cash, annually"],
    ["Transition programme, first year", 1978000, 1978000, "Cash, year one"],
  ],
  maxExposureLti: ["Annual LTI grant, face value at vesting (non-cash if share-settled)", 2580000, 3354000, "Shares; vests over three years; dilution needs share count"],

  // Workbook "Decision costs": how the $4.70m maps to the five decisions
  decisionCosts: [810000, 820000, 138000, 922500, 2010000],

  // Workbook "Reconciliation": what changed from earlier decks and why
  reconciliation: [
    ["Pre-IPO cohort", "50 executives in three tiers", "16 (6 critical, 10 pivotal); others by retention-risk review", "Automatic broad participation is costly and weakly targeted"],
    ["Bridge vesting (Nov 2026 revision)", "24 months, two tranches; $1.425m target", "36 months, three tranches; $2.1375m target; same annual rate", "Handbook defines LTI as vesting over three or more years"],
    ["Eligibility and cap (Nov 2026 revision)", "16 named; RemCo could add names, but no cap defined", "Hard pool cap $2.5695m target: 16 named + reserve for up to 6 more", "Removes the open-ended promise; additions are pre-funded"],
    ["Bridge measures", "Operating measures included", "Transition measures only", "Prevents paying for the same operating outcome twice"],
    ["Offset between plans", "Performance half deducted from share grants", "No offset; separation by measure", "Valuation basis, timing, enforceability and accounting could not be shown"],
    ["Post-IPO grant", "$8.55m face value a year (50 people)", "$2.58m target value a year (16 people)", "Smaller cohort; CEO 100%, critical 60%, pivotal 30%"],
    ["Post-IPO mix", "50/25/25 with options (earlier draft)", "60% performance / 40% restricted; no options", "Options pay for the margin cycle"],
    ["Transition cost", "$768k (IPO office + succession)", "$1.978m (eight items)", "Adds permanent controls, assurance, diligence, valuation and comms"],
    ["STI", "Not costed for NEP", "$2.01m target, gross", "Board needs total first-year cash"],
    ["Affordability", "Stated as not proven", "Formal test: 3% ceiling on available cash, tested at maximum", "Gives the Board a release condition"],
  ],

  // Workbook "Sources register"
  sources: [
    ["MDX HCCC 2026 Case Book", "2026", "IPO in ~3 months; ~50 executives; ~590,000 bpd; ~1.1m bpd ambition; 70% Group time on NEP; founder majority control; project debt", "Anonymised; no financial data", "fact"],
    ["ADNOC Gas Integrated Report 2025", "2025", "Salary and allowances: CEO ≈$746.5k; CFO ≈$555.3k; COO ≈$573.0k (pp. 54–55)", "Much larger; includes allowances; bonuses are paid, not target", "ext"],
    ["Robert Walters Middle East Salary Survey 2025", "2025", "UAE Group CFO AED 120k+/month (≈$392k+/yr); Finance Director AED 60–80k (≈$196k–$261k/yr)", "Survey ranges, base pay only", "ext"],
    ["Marathon Petroleum 2025 Proxy Statement", "2025", "LTI mix generally 60% PSUs, 20% RSUs, 20% MPLX phantom units; no options since 2020", "US-listed, far larger; supports structure, not pay levels", "ext"],
    ["ADNOC Distribution Annual Report 2024", "2024", "Discloses related-party transactions and executive remuneration as a listed subsidiary of a controlling parent", "Retail fuel business; different regulator and scale", "ext"],
    ["IFRS 2; IAS 19; IAS 24", "Current", "Share-based payment at grant-date fair value; cash awards as employee benefits; related-party disclosure", "Applies only if NEP reports under IFRS", "ext"],
  ],

  // Appendix A8: communication plan
  comms: [
    ["16 named executives", "Your role, your bridge award and share-plan terms; what happens to promises you already hold", "NEP CEO and Group CPO", "Within 30 days, before any announcement", "One-to-one; one-page personal statement"],
    ["Other 34 executives", "How eligibility and the reserve work; the retention-risk review; bonus unchanged until new scorecards", "NEP CEO and Head of People", "Days 30 to 45", "Small-group briefings; written FAQ"],
    ["Group executives and BU heads", "New roles, adviser terms and exit dates; how NIP governs NEP after listing", "Group CEO", "Before listing", "Group forum; role letters"],
    ["NEP workforce", "Why NEP is listing, what stays the same, and that safety authority stays at site", "NEP CEO and COO", "At listing", "Town hall; manager toolkit"],
    ["Directors and investors", "Governance, pay policy and how pay links to reliability, safety and TSR", "NEP Chair and RemCo chair", "Prospectus, then annually", "Prospectus; remuneration report"],
  ],
  lti: [
    { n: "CEO", base: 0.6, pct: 100, tv: 600000 },
    { n: "5 other critical", base: 2.1, pct: 60, tv: 1260000 },
    { n: "10 pivotal", base: 2.4, pct: 30, tv: 720000 },
  ],
  sti: [ // slide 17 assumptions
    { n: "CEO", base: 0.6, pct: 60 },
    { n: "5 other critical", base: 2.1, pct: 50 },
    { n: "10 pivotal", base: 2.4, pct: 25 },
  ],
  scorecard: [
    { k: "Operational reliability", w: 30, m: "Average utilisation against plan; unplanned downtime", c: "RUN" },
    { k: "Controllable cash performance", w: 25, m: "Unit cash cost and cash conversion against plan, excluding margin moves", c: "LIST" },
    { k: "Expansion milestones", w: 25, m: "Stage gates met on schedule and budget", c: "BUILD" },
    { k: "Relative TSR", w: 20, m: "Against a refining peer group set by RemCo before grant", c: "LIST" },
  ],
  plans: [
    { n: "Pre-IPO retention bridge", purpose: "Keep critical people through listing and ramp-up", pays: "Verified continuity in critical roles; governance handover; successor development; approved transition milestones", never: "Operating or financial results", horizon: "36 months: tranches at listing +9, +21 and +33", vehicle: "Cash, not linked to share price" },
    { n: "Annual STI", purpose: "Deliver this year's plan safely", pays: "One year's safety, production, cost and individual goals", never: "Bridge milestones while the bridge runs", horizon: "12 months", vehicle: "Cash" },
    { n: "Post-IPO LTI", purpose: "Sustainable shareholder value", pays: "Three-year reliability, controllable cash, expansion milestones, relative TSR", never: "IPO completion or transition milestones", horizon: "3 years, plus 2-year hold for critical roles", vehicle: "60% performance shares, 40% restricted shares" },
  ],

  decisionRights: {
    cols: ["Decision", "NEP management", "NEP Board", "NIP Group"],
    rows: [
      ["Stop or slow a unit for safety", "Decides at site, immediately", "Informed via the Safety and Operations committee", "No role"],
      ["Maintenance and shutdown plan", "COO and Technical propose and execute", "Approves; deferring safety-critical work needs Technical sign-off", "No role"],
      ["Crude supply, trading and product sales", "Commercial decides within risk limits", "Sets risk limits; approves material contracts", "As counterparty only, through the related-party route"],
      ["Expansion stage gates and capital", "Expansion Director proposes", "Approves each stage gate", "Reserved matter: funding envelope"],
      ["Executive appointments and pay", "Below executive committee", "Decides on RemCo advice", "Nominee rights; Group guardrails"],
      ["Disclosure and inside information", "Disclosure committee prepares", "Approves material announcements", "Informed when the market is"],
    ], s: 6,
  },
  safeguards: [
    { n: "Feedstock and offtake contracts", req: "Transparent pricing methodology; independent conflict review", own: "Head of Commercial", ev: "Methodology referenced to observable prices; independent review report", due: "Before prospectus" },
    { n: "Shared services", req: "SLAs, documented cost allocation, termination rights", own: "NEP CFO", ev: "Signed SLAs; cost-allocation schedule", due: "By listing" },
    { n: "Financing and capital allocation", req: "Treasury controls, lender covenants, cash-allocation rules", own: "NEP CFO", ev: "Treasury policy; covenant compliance check; cash-pooling rules", due: "Covenants day 30" },
    { n: "Related-party transactions", req: "Conflict identification, recusal, independent approval", own: "NEP legal lead", ev: "Related-party register; conflict declarations; recusal minutes", due: "Register day 30" },
    { n: "Disclosure and inside information", req: "Documented access controls; compliant reporting procedures", own: "NEP CFO, disclosure committee", ev: "Insider list; access logs; disclosure policy", due: "By listing" },
  ],
  transitions: [
    ["Remain at NIP", "Group CEO", "NIP nominee on the NEP Board; out of NEP operating decisions from listing"],
    ["Remain at NIP", "Group CFO", "Sponsors the IPO office to listing +3 months, then hands reporting to the NEP CFO"],
    ["Remain at NIP", "Chief Legal Officer", "Owns Group related-party policy; NEP appoints its own legal lead"],
    ["Remain at NIP", "Chief People Officer", "Owns Group reward philosophy; NEP Head of People owns NEP succession"],
    ["Temporary adviser", "Chief Strategy Officer", "Adviser to the Expansion Director to listing +6 months; written remit, no decision rights"],
    ["Transfer into NEP", "Group staff mainly working on NEP", "Offered permanent NEP roles where the 30-day time log and role fit confirm it"],
    ["Return to portfolio", "Business-unit heads", "Back in their own businesses before listing, each with a named Group sponsor"],
  ],
  succession: [
    ["CEO", "COO acts; NEP Chair oversees", "Has led an operating company; credible with lenders, regulators and investors", "No internal candidate meets the criteria at day 60", "Board and investor exposure for COO and CFO", "Independent assessment; Board interviews"],
    ["COO", "Senior operations manager acts; Technical keeps assurance", "Has run a large continuous-process site through start-up or a major shutdown", "Fewer than two credible internal candidates at day 60", "Area operations managers rotate through shutdown leadership", "Shutdown and incident record; simulation"],
    ["CFO", "Interim listed-company finance specialist; Audit and Risk oversight", "Has closed a listed reporting cycle and managed project debt", "No candidate with listed-company reporting experience", "Financial controller through the first reporting cycle", "Reporting record; external auditor feedback"],
    ["Technical", "Senior integrity or reliability lead acts", "Can hold process-safety accountability, including refusing a restart", "Any gap in integrity accountability: search at once", "Inspection and maintenance leaders on the expansion", "External technical assessor review"],
    ["Commercial", "Deputy head of supply and trading", "Has run crude supply, trading and sales within risk limits", "No candidate who has run a risk-limited book", "Product and chemicals marketing leaders", "Trading record against risk limits"],
    ["People", "Group CPO nominee as interim", "Can run a localisation pipeline and listed-company reward", "No candidate with listed-company reward experience", "Operations HR business partners", "Assessment; RemCo working sessions"],
  ],

  phases: ["Now (listing −3m)", "At listing", "Listing +3m", "Listing +6m", "Listing +12m"],
  timeline: [ // slide 8
    { ws: "RUN", own: "NEP COO", cells: ["Decision rights and stop-work rule live; emergency cover named; time and escalation logs start", "NEP Board and Safety and Operations committee in force", "First review of escalations and outages", "Two-deep cover for COO and Technical", "Effectiveness review of the operating model"] },
    { ws: "BUILD", own: "Expansion Director", cells: ["Expansion Director named; project team separated from operations", "Stage-gate process approved; NIP sets funding envelope", "Live-unit work rules tested with Run", "Chief Strategy Officer's adviser term ends", "Next stage gate decided under listed governance"] },
    { ws: "LIST", own: "NEP CFO", cells: ["IPO office live; disclosure controls and insider list built", "Listing; disclosure committee live", "IPO office hands over and closes", "Liquidity guidance once any lock-up ends", "First annual and remuneration reports"] },
    { ws: "PROTECT", own: "NEP CFO, legal lead", cells: ["Contract inventory; related-party register by day 30; covenant review", "Pricing methods, SLAs and treasury policy approved by independents", "First independent review of related-party transactions", "Audit and Risk review of shared-service costs", "Related-party disclosure; legal sign-off"] },
    { ws: "PEOPLE", own: "Head of People, RemCo", cells: ["Promise register; 16 named, up to 6 more from reserve; bridge approved", "RemCo constituted; share plan adopted subject to approvals; first grant", "First STI cycle on new scorecards", "Retention and pool review", "Bridge tranche 1 certified (month 9 of 36); year-one review"] },
    { ws: "GATES", own: "NIP and NEP Boards", cells: ["Gate 0: release $0.77m for IPO office and succession", "Gate 1: affordability test and legal and accounting sign-off before permanent hires and first grant", "Gate 2: STI funding confirmed against available cash", "Mid-year affordability checkpoint", "Gate 3: tranche 1 paid only after certification and cash test"] },
  ],
  groupTime: [ { p: "Today", v: 70, t: "fact" }, { p: "At listing", v: 50, t: "rec" }, { p: "+3m", v: 40, t: "rec" }, { p: "+6m", v: 35, t: "rec" }, { p: "+12m", v: 30, t: "rec" } ],
  resources: [
    ["Temporary IPO office (6 months)", "$630,000 one-off", "Fast to stand up; knowledge leaves at +3 months unless handover is a condition of closing"],
    ["Permanent reporting lead + related-party/treasury controller", "$580,000 a year, recurring", "Capabilities a listed NEP must keep; slower to hire, so recruit now"],
    ["Succession assessment and development", "$138,000 year one", "Independent readiness assessments; names follow day 60"],
  ],

  decisions: [
    { n: 1, h: "Approve the Run–Build–List accountability model and executive allocation", own: "NIP Board; NEP Board adopts charters", act: "Adopt decision rights; name IPO Director and four leads; start time and escalation logs", fin: "$0.81m year one: IPO office, reliability assurance", ev: "30-day time and escalation logs", ok: "Escalations to Group −50% vs baseline by +6m; Group time on NEP ≤50% at listing, ≤30% at +12m", re: "Escalations not falling by +3m", roots: ["R1", "R2"], impact: 5, cx: 3, deps: "None — foundation for decisions 2–4", benefit: "Removes Group bottleneck; keeps inside information inside NEP after listing" },
    { n: 2, h: "Approve independently governed economic and related-party controls", own: "NEP independent directors; NIP for reserved matters", act: "Contract inventory; related-party register by day 30; covenant review", fin: "$0.82m year one: reporting lead, controller, legal diligence", ev: "Contract pricing methods; legal opinion on the listing rules", ok: "All material Group contracts independently reviewed before listing; no unapproved related-party deals", re: "A contract falls outside its pricing method", roots: ["R1"], impact: 5, cx: 4, deps: "Decision 1 (NEP CFO and legal lead named); jurisdiction-specific legal confirmation", benefit: "Independent directors can verify NEP's economics before the prospectus" },
    { n: 3, h: "Approve succession and transition readiness for six critical roles", own: "NEP Board", act: "Name emergency cover by day 30; assess ready-now by day 60", fin: "$0.14m year one", ev: "Independent readiness assessments", ok: "6 of 6 roles covered; two-deep COO and Technical by +6m", re: "A critical role falls vacant with no cover", roots: ["R2"], impact: 4, cx: 2, deps: "Decision 1 (roles defined per clock)", benefit: "No single absence can stop or restart units on a single site" },
    { n: 4, h: "Conditionally approve the pre-IPO retention and post-IPO LTI frameworks", own: "NEP Board with NIP consent; shadow RemCo advises; RemCo ratifies at listing", act: "Validate the 16; reconcile existing promises; commission valuation and legal review", fin: "$0.92m year one; bridge $2.14m target over 36 months ($2.67m max) inside a $2.57m pool cap; $2.58m annual grant value", ev: "Promise register; available-cash test; legal approvals for share issuance", ok: "No regretted exits among the 16 to +12m; payouts within the pool cap", re: "Affordability fails at maximum, or a serious safety event", roots: ["R3"], impact: 4, cx: 5, deps: "Gate 1 affordability test; legal and accounting sign-off; Decision 3 (critical roles named)", benefit: "Keeps scarce operators through listing and ramp-up; every outcome paid once" },
    { n: 5, h: "Approve differentiated variable pay across NIP's four archetypes", own: "NIP Board on Group RemCo advice", act: "Adopt common guardrails; document the Group centre scorecard", fin: "$2.01m NEP STI at target (gross); other archetypes costed later", ev: "Archetype cost and affordability; benchmarking", ok: "Guardrails in all four within 6 months; non-NEP decision speed vs baseline", re: "An archetype cannot fund its own pool", roots: ["R3"], impact: 3, cx: 3, deps: "Decision 4 (NEP reward design as the reference point)", benefit: "Consistent guardrails replace inconsistent promises; each business paid on its own clock" },
  ],

  // Business Problem → Evidence → Analysis → Insight → Strategic Implication
  chains: [
    { id: "C1", p: "Decisions escalate to Group leaders", e: ["E5", "E4"], a: "R1: authority sits with people, not roles. After listing, informal escalation mixes inside information with Group roles.", i: "Authority must follow accountability for the barrel (P1).", m: "Decision-rights matrix; NIP acts only through reserved matters and Board nominees.", d: [1, 2], s: "4, 5, 6" },
    { id: "C2", p: "One bench runs three clocks on a single site", e: ["E3", "E6", "E8"], a: "R2: on one site, lost barrels cannot be made up elsewhere; one utilisation point ≈ $6.46m a year (illustrative).", i: "Key-person risk is value risk: one clock, one owner (P2).", m: "Named owner per clock; temporary IPO office; two-deep cover for COO and Technical.", d: [1, 3], s: "4, 7, 21" },
    { id: "C3", p: "Retention promises are inconsistent", e: ["E7", "E13", "E10"], a: "R3: reward is a set of promises, not a system; options would pay for the margin cycle.", i: "Three plans with three purposes: every outcome is paid once, by one plan (P3, P4).", m: "$2.14m selective cash bridge inside a $2.57m pool cap; 60/40 performance/restricted share LTI with safety gate.", d: [4], s: "4, 9–11, 16" },
    { id: "C4", p: "Economics must be verifiable to independents", e: ["E15", "E14", "E17"], a: "Capacity does not prove affordability; NEP cash data is not available.", i: "Verify the economics before releasing money (P5).", m: "Five PROTECT safeguards; spending gates 0–3; 3% available-cash guardrail.", d: [2, 4], s: "6, 8, 12" },
    { id: "C5", p: "Group pay lacks a common system", e: ["E7", "E16"], a: "Four archetypes create value on different clocks; most have no share price or disclosure duty.", i: "NEP is the governance reference point, not the universal pay template.", m: "Common guardrails in all four archetypes; business-specific measures and vehicles.", d: [5], s: "13" },
  ],
  rejected: [
    { h: "Offset bridge value against share grants", why: "Valuation basis, timing, enforceability and accounting could not be shown. Separating measures prevents double pay instead.", s: 9 },
    { h: "Stock options in the LTI", why: "A refiner's share price follows the margin cycle, so options would pay most for what management controls least.", s: 11 },
    { h: "100% performance shares", why: "Can pay zero for margin moves; weak retention when it matters. 60/40 keeps a retention floor in ramp-up.", s: 16 },
    { h: "NEP as the universal Group pay template", why: "Most businesses have no share price or disclosure duty. Also not fully separate, because common guardrails fix inconsistent promises.", s: 13 },
    { h: "PROTECT as a fourth clock", why: "PROTECT is an enabling principle across all three clocks, not a fourth clock.", s: 3 },
  ],

  archetypes: {
    cols: ["Start-ups", "Listed entities incl. NEP", "Mature non-listed", "Group centre"],
    rows: [
      ["STI measures", "Milestones: proof of concept, customer validation, team build", "Safety, production, cost, financial and individual goals", "Profit, cash generation, operating stability", "Portfolio performance, capital allocation, enterprise risk, bench depth"],
      ["LTI vehicle", "Phantom equity; cash only at a defined liquidity event", "Performance and restricted shares", "Deferred cash or phantom units on EBITDA, cash conversion, ROC; no TSR", "NIP-level value units; no NEP shares"],
      ["Vesting horizon", "Milestone-based; lapses if milestones miss a set date", "Three years; two-year hold for critical roles", "Three years", "Three to four years"],
      ["Opportunity (assumption)", "STI 10–20% of base; phantom pool per venture", "STI 25–60%; LTI 30–100%", "STI 30–60%; LTI 30–50%", "STI 40–70%; LTI 50–100%"],
    ], s: 13,
  },

  // Performance Intelligence. No actual data exists: `actual` is always null.
  kpiDefs: [
    { k: "Escalations to Group", tier: "Strategic", c: "RUN", target: "−50% vs baseline by +6m", base: "30-day escalation log (pending)", freq: "Monthly", how: "Count of NEP decisions escalated to Group leaders; share that are routine operating calls", owner: "NEP CEO", esc: "Not falling by +3m → reopen Decision 1", s: 14 },
    { k: "Group executive time on NEP", tier: "Strategic", c: "RUN", target: "≤50% at listing → ≤30% at +12m", base: "70% (case fact)", freq: "Monthly", how: "Time log by clock for top executives", owner: "NIP Board", esc: "Above ceiling at any checkpoint", s: 8 },
    { k: "Critical roles with emergency cover", tier: "Strategic", c: "PEOPLE", target: "6 of 6 by day 30; two-deep COO & Technical by +6m", base: "Not established", freq: "Quarterly", how: "Named cover per role; independent readiness assessment", owner: "NEP Board / Head of People", esc: "A critical role vacant with no cover", s: 14 },
    { k: "Regretted exits among the 16", tier: "Strategic", c: "PEOPLE", target: "Zero to +12m", base: "Not established", freq: "Quarterly", how: "Voluntary exits of bridge participants flagged as regretted by RemCo", owner: "RemCo", esc: "Any regretted exit", s: 14 },
    { k: "Material Group contracts independently reviewed", tier: "Strategic", c: "PROTECT", target: "100% before listing", base: "Contract inventory by day 30", freq: "Monthly to listing", how: "Contracts reviewed ÷ material contracts in inventory", owner: "NEP independent directors", esc: "A contract falls outside its pricing method", s: 14 },
    { k: "Unapproved related-party deals", tier: "Operational", c: "PROTECT", target: "Zero", base: "Register by day 30", freq: "Monthly", how: "Related-party register vs approvals and recusal minutes", owner: "NEP legal lead", esc: "Any occurrence", s: 14 },
    { k: "Programme cash vs 3% available-cash ceiling", tier: "Operational", c: "PROTECT", target: "≤3% at maximum ($5.88m ⇒ ≥$196.1m available)", base: "Available cash unknown", freq: "At each spending gate", how: "OCF − maintenance capex − debt service − obligations − committed expansion − buffer", owner: "NEP CFO", esc: "Affordability fails at maximum", s: 12 },
    { k: "Average utilisation vs plan", tier: "Operational", c: "RUN", target: "Set by RemCo before grant", base: "Not available", freq: "Monthly; 3-yr average for LTI", how: "Utilisation against plan; unplanned downtime (LTI weight 30%)", owner: "NEP COO", esc: "Serious process-safety event: RemCo can reduce awards to zero", s: 11 },
    { k: "Expansion stage gates on schedule & budget", tier: "Operational", c: "BUILD", target: "Set per stage gate", base: "Not available", freq: "Per stage gate", how: "Gates met on schedule and budget (LTI weight 25%)", owner: "Expansion Director", esc: "Gate missed", s: 11 },
    { k: "Unit cash cost & cash conversion", tier: "Operational", c: "LIST", target: "Set by RemCo before grant", base: "Not available", freq: "Quarterly", how: "Against plan, excluding margin moves (LTI weight 25%)", owner: "NEP CFO", esc: "Below threshold: 0% payout", s: 11 },
  ],
  reporting: [
    ["Site / NEP management", "Stop-work decisions, escalation and time logs", "Continuous / monthly"],
    ["Safety and Operations committee", "Process-safety, outages, maintenance deferrals", "Each meeting"],
    ["Audit and Risk committee", "Related-party, shared-service costs, covenants", "Each meeting; first review at +3m"],
    ["RemCo", "STI/LTI outcomes, bridge certification, retention", "Each cycle; outcomes certified before vesting"],
    ["NEP Board / NIP Board", "Spending gates, KPIs in gold re-tested", "Next Board meeting; gates 0–3"],
  ],

  bridgeTerms: [
    ["IPO delayed by outside events", "Service dates hold; milestones re-timed without penalty; beyond 12 months RemCo substitutes operating-readiness milestones"],
    ["IPO cancelled", "Continues as a cash retention plan on substituted milestones"],
    ["Delay caused by negligence", "Unvested tranches of named individuals cut, up to 100%, after a documented finding"],
    ["Underperformance", "Performance half pays nothing below threshold"],
    ["Good leaver", "Death, ill health, retirement, redundancy: pro-rated, tested at normal date"],
    ["Bad leaver", "Resignation or dismissal for cause: unvested tranches lapse"],
    ["Change of ownership", "Continues on equivalent terms; a founder sell-down is not a trigger"],
    ["Safety gate", "Serious process-safety event: RemCo can reduce any tranche to zero"],
    ["Malus and clawback", "Misconduct, restatement or control breach; clawback up to three years where enforceable"],
  ],
};
