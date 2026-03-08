# 📖 Narrative Finance Storyteller

> *Transform raw financial data into compelling narratives that non-finance teams actually want to read.*

## Overview

Narrative Finance Storyteller is a React + TypeScript application that converts quarterly financial data into rich, metaphor-driven narrative reports. It bridges the gap between finance departments and operational teams by translating numbers into stories — with configurable archetypes, metaphor domains, and compliance templates.

---

## Features

- **6 Narrative Archetypes** — Hero's Journey, Rise & Fall, Redemption Arc, Underdog, Steady Climb, Storm & Calm
- **6 Metaphor Domains** — Mythology, Sports, Nature, Cinema, Military Strategy, Culinary
- **5 Compliance Templates** — Investor Report, Board Memo, Team Update, Press Release, or None
- **Tone & Audience Controls** — Formal / Conversational / Inspirational × Executive / Operations / External / Technical
- **Interactive Data Entry** — Manual quarterly input or CSV paste
- **Auto Profit Calculation** — One-click Revenue − Expenses
- **Data Visualisations** — Recharts bar + area charts for revenue, expenses, profit, and growth
- **AI-Powered Narratives** — Powered by Claude via the Anthropic API
- **Demo Mode** — Rich, hardcoded narratives work without an API key
- **Export Options** — Copy to clipboard, download as `.txt`, `.html`, or `.json`

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Charts | Recharts |
| Styling | Pure CSS (custom design system) |
| AI | Anthropic Claude API (`claude-opus-4-5`) |
| Icons | Native emoji |

---

## Project Structure

```
src/
├── components/
│   ├── Header.tsx         # Sticky header with step progress nav
│   ├── DataInput.tsx      # Step 1: Financial data entry (manual + CSV)
│   ├── Configurator.tsx   # Step 2: Archetype / metaphor / template config
│   ├── NarrativeReport.tsx # Step 3: Rendered story + charts
│   ├── ChartPanel.tsx     # Recharts visualisation panel
│   └── ExportPanel.tsx    # Step 4: Export options
├── logic/
│   ├── narrativeGenerator.ts  # Anthropic API calls + demo fallback
│   ├── dataTransformer.ts     # CSV parsing, chart data, summary stats
│   └── exportEngine.ts        # .txt and .html report generation
├── hooks/
│   └── useAppState.ts     # Centralised app state management
├── data/
│   └── definitions.ts     # Archetypes, metaphors, templates, sample data
├── types/
│   └── index.ts           # All TypeScript interfaces & types
├── styles/
│   └── global.css         # Full design system (editorial dark theme)
├── App.tsx                # Root orchestrator
└── main.tsx               # Entry point
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Using the Anthropic API

1. Get your API key from [console.anthropic.com](https://console.anthropic.com)
2. Paste it into the **API Key** field on the Story Configuration screen
3. Your key is used only in the browser session — never stored

**Without an API key**, the app runs in Demo Mode, generating rich hardcoded narratives based on your chosen archetype and metaphor domain.

---

## CSV Import Format

```csv
Quarter, Revenue, Expenses, Profit, Growth
Q1 2024, 420000, 390000, 30000, 5.0
Q2 2024, 510000, 410000, 100000, 21.4
Q3 2024, 480000, 430000, 50000, -5.9
Q4 2024, 670000, 450000, 220000, 39.6
```

---

## Customisation

The app is intentionally modular. To add new archetypes or metaphor domains:

1. Add the definition to `src/data/definitions.ts`
2. Add a TypeScript union member to `src/types/index.ts`
3. Add demo narrative builder to `src/logic/narrativeGenerator.ts`

---

## Licence

MIT — free to use, modify, and distribute.
