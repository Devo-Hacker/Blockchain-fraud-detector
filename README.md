# Smart Chain Analyser

**Automated blockchain fraud investigation for victim-reported crypto wallets.**

Built for Smart India Hackathon 2026 — Problem Statement: *"Real-Time Identification of Fraud-Linked Cryptocurrency Exchanges from Victim-Reported Suspect Wallet Addresses through Automated Blockchain Analytics."*

> ⚠️ This is a hackathon prototype, not a certified or deployed government system.

---

## What it does

A victim of a crypto scam reports the wallet address they sent funds to. Smart Chain Analyser automatically:

1. Pulls that wallet's real transaction history from BNB Smart Chain
2. Builds a directed fund-flow graph and traces it hop by hop
3. Checks every wallet in the trace against known scam, mixer, bridge, and exchange address sets
4. Produces an **explainable** risk score — not just a number, but the exact signals that contributed to it
5. Saves the investigation to a case file an officer can review later

The goal isn't to replace tools like Chainalysis — it's to automate the specific, common first step a local cybercrime cell currently does by hand: turning one reported wallet into a traced, scored lead, in seconds instead of hours.

---

## Preview

<img width="1897" height="907" alt="Screenshot 2026-09-19 231430" src="https://github.com/user-attachments/assets/813a2f94-81cb-498a-a90d-12d9a27e9b98" />

<img width="1900" height="910" alt="Screenshot 2026-09-19 231446" src="https://github.com/user-attachments/assets/76fea031-47f1-4bb4-b6cd-2cfb6ceecbac" />

<img width="1900" height="912" alt="Screenshot 2026-09-19 231500" src="https://github.com/user-attachments/assets/bbad3d12-c954-4716-8296-79bb9224f2c1" />

<img width="1897" height="907" alt="Screenshot 2026-09-19 231518" src="https://github.com/user-attachments/assets/e3b0f1ba-200c-4845-8b28-42bd09a85512" />

<img width="1896" height="907" alt="Screenshot 2026-09-19 231530" src="https://github.com/user-attachments/assets/a9bc2b2b-f4c3-41a1-a2bd-33c055d29926" />

<img width="1901" height="908" alt="image" src="https://github.com/user-attachments/assets/b58f6599-5958-455d-b86b-8a24bebdd0a9" />


## Architecture

```
                      ┌─────────────────────┐
                      │   Next.js Frontend   │
                      │  (App Router, TS,    │
                      │   Tailwind)           │
                      └──────────┬───────────┘
                                 │
                      ┌──────────▼───────────┐
                      │  Node.js / Express     │
                      │  Backend (port 5000)   │
                      └──────────┬───────────┘
                     ┌───────────┴────────────┐
                     ▼                        ▼
          ┌────────────────────┐   ┌────────────────────────┐
          │  PostgreSQL          │   │  Python / FastAPI        │
          │  (Supabase)           │◄──┤  Analytics (port 8000)    │
          └──────────┬──────────┘   │  NetworkX + risk scoring  │
                     │               └────────────┬────────────┘
                     ▼                            │
          ┌────────────────────┐                  │
          │  Ankr Advanced API   │◄─────────────────┘
          │  (BSC transaction     │
          │   data)                │
          └──────────┬──────────┘
                     ▼
          ┌────────────────────┐
          │  BNB Smart Chain      │
          │  (real, live data)    │
          └────────────────────┘
```

The frontend only ever talks to the Node backend. Node internally calls the Python analytics service when a trace/investigation is needed and relays the result — Python is never exposed directly to the client.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS, lucide-react, vis-network |
| Backend | Node.js, Express |
| Analytics | Python, FastAPI, NetworkX, pandas, psycopg2 |
| Database | PostgreSQL (hosted on Supabase) |
| Blockchain data | Ankr Advanced API (`ankr_getTransactionsByAddress`, BNB Smart Chain) |
| AI case summary | Groq API (optional — narrative summaries on top of the risk breakdown) |

---

## Features

- **Victim report intake** — submit a suspect wallet + victim details, get a full investigation back automatically
- **Automated multi-hop tracing** — follows funds through intermediary wallets, not just a single transaction
- **Explainable risk scoring** — every point in the score is attributed to a named signal:
  - Known scam wallet link
  - Exchange exposure
  - Multi-hop layering
  - Fund splitting / consolidation
  - Rapid fund movement
- **Entity intelligence** — wallets are checked against real, BscScan-sourced reference data for known exchanges, bridges, and reported scam addresses
- **Case registry** — every complaint becomes a searchable case with its full investigation attached
- **Quick wallet scanner** — check any wallet's risk profile without filing a full complaint
- **Fund-flow graph visualization** — interactive node graph, color-coded by wallet type, target wallet highlighted
- **AI case narrative** (optional) — a plain-language summary of what happened to the funds, generated via Groq

### Not yet built

- Victim-to-victim correlation (flagging when separate complaints trace to the same wallet cluster — the project's core intended differentiator)
- Cross-chain tracing (currently BNB Smart Chain only)
- Authentication / multi-user access control

---

## Project structure

```
sih-pro/
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── page.tsx              # marketing landing page
│       │   ├── layout.tsx            # root layout (fonts only)
│       │   └── (app)/                # the actual tool, sidebar-wrapped
│       │       ├── layout.tsx
│       │       ├── dashboard/
│       │       ├── report/new/
│       │       ├── cases/
│       │       │   └── [id]/
│       │       └── wallets/
│       ├── components/               # RiskGauge, FundFlowGraph, HopList, etc.
│       └── lib/api.ts                # typed API client
│
├── backend/
│   └── src/
│       ├── index.js
│       ├── db/pool.js
│       └── routes/
│           ├── wallet.js             # GET /wallet/:address/fetch
│           ├── trace.js              # GET /trace/:address
│           └── reports.js            # POST /reports, GET /reports/cases[/:id]
│
└── analytics/
    ├── main.py                       # FastAPI app
    ├── graph_builder.py              # NetworkX graph + traversal
    ├── risk_scoring.py               # weighted risk signal logic
    ├── load_entities.py              # loads reference CSVs into the DB
    └── data/                         # exchange/bridge/scam reference datasets
```

---

## Getting started

You'll need Node.js 18+, Python 3.10+, and a Supabase Postgres project (or any Postgres instance).

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:
```
PORT=5000
DATABASE_URL=your_postgres_connection_string
ANKR_ENDPOINT=your_ankr_advanced_api_endpoint
ANALYTICS_URL=http://localhost:8000
```

Run the schema (see `db/schema.sql` or the SQL block below) against your database, then:
```bash
npm run dev
```

### 2. Analytics service

```bash
cd analytics
python -m venv venv
source venv/bin/activate      # or .\venv\Scripts\Activate.ps1 on Windows
pip install fastapi uvicorn pandas networkx psycopg2-binary python-dotenv
```

Create `analytics/.env`:
```
DATABASE_URL=your_postgres_connection_string
GROQ_API_KEY=your_groq_key       # optional, for AI case summaries
```

```bash
uvicorn main:app --reload --port 8000
```

Load reference entity data (exchange/scam/bridge address sets):
```bash
python load_entities.py
```

### 3. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:
```
NEXT_PUBLIC_NODE_API=http://localhost:5000
NEXT_PUBLIC_ANALYTICS_API=http://localhost:8000
```

```bash
npm run dev
```

Visit `http://localhost:3000`.

---

## Database schema

```sql
CREATE TABLE cases (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE victim_reports (
  id SERIAL PRIMARY KEY,
  case_id INTEGER REFERENCES cases(id),
  victim_name TEXT,
  contact TEXT,
  amount_lost NUMERIC,
  reported_wallet TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE wallets (
  address TEXT PRIMARY KEY,
  chain TEXT DEFAULT 'bnb',
  label TEXT,
  entity_type TEXT DEFAULT 'unknown'
);

CREATE TABLE transactions (
  tx_hash TEXT PRIMARY KEY,
  from_address TEXT REFERENCES wallets(address),
  to_address TEXT REFERENCES wallets(address),
  value NUMERIC,
  token TEXT DEFAULT 'BNB',
  block_number BIGINT,
  timestamp TIMESTAMP
);

CREATE TABLE investigations (
  id SERIAL PRIMARY KEY,
  case_id INTEGER REFERENCES cases(id),
  status TEXT DEFAULT 'pending',
  risk_score NUMERIC,
  findings JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## API reference

### Node backend (`:5000`)

| Method | Route | Description |
|---|---|---|
| GET | `/wallet/:address/fetch` | Pulls a wallet's transaction history from BSC and stores it |
| GET | `/trace/:address` | Proxies a fund-flow trace from the analytics service |
| POST | `/reports` | Files a victim complaint and runs a full investigation |
| GET | `/reports/cases` | Lists all cases |
| GET | `/reports/cases/:id` | Returns a case's victim report(s) and investigation history |

### Analytics service (`:8000`)

| Method | Route | Description |
|---|---|---|
| GET | `/trace/:address` | Returns the fund-flow graph and hop-by-hop trace |
| GET | `/investigate/:address` | Trace + full risk assessment |

---

## Known limitations

Worth being upfront about, since this is a prototype:

- **Single chain** — BNB Smart Chain only. Bitcoin and other chains use fundamentally different address formats and data models, and weren't in scope.
- **Reference dataset size** — entity intelligence (scam/exchange/bridge labels) is sourced from a small set of real BscScan-exported data, not a comprehensive database. Unlabeled wallets are common and expected.
- **Rapid-movement false positives** — high-volume legitimate wallets (major exchanges) can trigger the "rapid movement" signal the same way a layering scam wallet would. This is a known, disclosed limitation of the current scoring model, not a bug.
- **Correlation not yet built** — the cross-case victim correlation feature, while central to the project's intended differentiation, isn't implemented yet.

---

## Team

Built by a 6-person team for SIH 2026, split across backend/blockchain integration, Python analytics, and frontend.
