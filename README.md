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

Nine modules, meant to be walked in order. Use **Guided briefing** for presentation mode, with the arrow keys to move.

1. **Executive Briefing**: the answer, the price and the ask
2. **Diagnosis**: three root-cause hypotheses, each with a test that could prove it wrong
3. **Research**: key assumptions, the evidence register and the sources
4. **Workbench**: live calculators for utilisation value, the 3% affordability test (including NEP's own cash-flow lines), cost sensitivity, and a 36-figure workbook check
5. **Insights**: evidence → analysis → insight → decision chains
6. **Recommendations**: the prioritisation matrix, the $2.14m retention bridge inside a $2.57m pool cap, and the 60/40 LTI
7. **Implementation**: roadmap and spending gates, succession, and the communication plan
8. **Performance**: KPIs with targets, owners and escalation triggers (no actuals: baselines don't exist yet)
9. **Decision Room**: the five Board decisions

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
