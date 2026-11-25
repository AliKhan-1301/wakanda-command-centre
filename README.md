# Wakanda Command Centre — RUN. BUILD. LIST.

An interactive Board briefing for Team Wakanda's entry to the **MDX Human Capital Consulting Challenge 2026**: an IPO-ready operating model, executive reward architecture and financially governed leadership transition for NIP and NEP.

> Three clocks. One owner each. One set of books everyone can trust.

**Live demo:** https://alikhan-1301.github.io/wakanda-command-centre/

## What's here

| Path | What it is |
| --- | --- |
| `index.html`, `app.js`, `styles.css` | The Command Centre web app (no build step, no dependencies) |
| `data.js` | Every figure and claim in the app, each tagged by evidence type and source slide |
| `check.js` | Reconciles the app's figures with the financial workbook: `node check.js` |
| `presentation/Wakanda_Final_Submitted.pptx` | The 14-slide deck as submitted, with speaker notes |
| `presentation/NEP_Financial_Calculations_Final.xlsx` | Financial defence workbook: every deck figure traces to a formula here |

## The app

Six pages in the order of the Board pitch, plus a three-page appendix. Use **Guided briefing** for presentation mode; the arrow keys or the Next button move through the pitch. Secondary detail on each page sits under "More detail".

1. **Briefing**: the answer, the year-one price and the ask
2. **What's wrong**: three root-cause hypotheses, each with a 30-day test
3. **The answer**: one owner per clock, where each Group executive goes, the roadmap and succession
4. **The money**: live calculators for utilisation value, the 3% affordability test (including NEP's own cash-flow lines) and a 36-figure workbook check
5. **Reward**: the three plans, the $2.14m retention bridge inside a $2.57m pool cap, the 60/40 LTI and the Group guardrails
6. **The ask**: the five Board decisions

Appendix: Evidence (key assumptions, evidence register, sources), Insights (evidence-to-decision chains) and KPIs.

## Run it locally

```bash
python -m http.server 5173
# open http://localhost:5173
node check.js   # "All deck figures reconcile."
```

## About the numbers

The case gives no NEP payroll, bonus spend, margins, cash flow or share count. Every money figure is therefore a **labelled planning assumption**, not NEP data. Case facts are tagged as such, and gaps are shown as gaps rather than filled in.

## Team Wakanda — Middlesex University Dubai

Tualia Rehman · Ali Khan · Ayesha Khan · Vaishnavi Dixit
