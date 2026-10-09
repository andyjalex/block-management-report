# Block Management Report

A monthly management report dashboard for UK residential block managing agents, designed to give freeholders and RMC (residents' management company) boards a clear picture of their property's financial health, compliance status, and ongoing works.

**[Live demo](<!-- LIVE_DEMO_URL -->)**

![Report overview](<!-- SCREENSHOT_OVERVIEW -->)

## The problem

Managing agents need to produce monthly board reports covering service charge collection, budget performance, compliance, repairs, and major works. These are typically assembled manually in Word or Excel, making them time-consuming to produce and inconsistent in quality. This dashboard auto-generates a professional, print-ready report from structured data.

## What it does

Select a block and a month to see a complete board report with:

- **Executive summary** — auto-generated plain-English bullet points highlighting what the board needs to know (arrears, overdue compliance, budget overruns)
- **KPI tiles** — collection rate, total arrears, reserve fund balance, YTD spend vs budget, open repair jobs, compliance RAG counts
- **Arrears table** — aged debt analysis per flat (0–30 / 31–60 / 61–90 / 90+ days)
- **Budget vs actual chart** — horizontal bar chart per budget category, year to date, with over-budget items highlighted in red and budget markers shown as dashed lines
- **Reserve fund chart** — monthly closing balance line chart with withdrawals annotated
- **Compliance grid** — red/amber/green status cards for fire risk assessment, gas safety, EICR, asbestos, insurance, legionella, lift inspection, PAT testing
- **Repairs** — raised vs completed bar chart plus a table of open jobs with priority, contractor, and description
- **Major works timeline** — Section 20 consultation progress shown as a stepper (Notice of Intention through to Final Account)
- **Print / Save as PDF** — print-optimised layout via CSS media queries

![Arrears and budget](<!-- SCREENSHOT_DETAIL -->)

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Charts | D3 (scales and shapes — React owns the DOM) |
| Styling | Plain CSS, no UI framework |
| Backend | None — JSON data imported directly |

## Run locally

```bash
git clone https://github.com/andyjalex/block-management-report.git
cd block-management-report
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
├── lib/            # Pure calculation functions (arrears, budget, compliance, etc.)
│   ├── arrears.ts  # Arrears ageing and collection rate
│   ├── budget.ts   # Budget vs actual YTD
│   ├── compliance.ts # RAG status logic
│   ├── repairs.ts  # Open jobs and monthly counts
│   ├── reserve.ts  # Reserve fund series
│   ├── summary.ts  # Auto-generated bullet points
│   ├── types.ts    # TypeScript interfaces
│   └── utils.ts    # Date helpers, formatting, category labels
└── components/     # One React component per report section
```

All derived figures (arrears ageing, budget variance, collection rates) are calculated in code from the raw data in `block_management_data.json`. The data file is never modified at runtime.

## Data

All data in this project is **fictional mock data** created for demonstration purposes. The blocks, flats, owners, contractors, and financial figures are entirely made up. No real properties, people, or organisations are represented.

The mock data covers two blocks (Harbour View Court and Westcliff Mansions) over a 12-month financial year (October 2025 – September 2026) and includes service charge demands/payments, expenditure, repairs, reserve fund movements, compliance records, and Section 20 major works.
