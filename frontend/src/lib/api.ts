const NODE_API = process.env.NEXT_PUBLIC_NODE_API || "http://localhost:5000";
const ANALYTICS_API = process.env.NEXT_PUBLIC_ANALYTICS_API || "http://localhost:8000";

export interface RiskFactor {
  reason: string;
  points: number;
  evidence: string[];
}

export interface WalletFlag {
  address: string;
  label: string | null;
}

export interface Hop {
  hop: number;
  from: string;
  to: string;
  value: number;
  token: string;
  tx_hash: string;
  timestamp: string;
}

export interface TraceEndpoint {
  address: string;
  label: string | null;
  entity_type: string;
}

export interface TraceSummaryData {
  root: string;
  hops_traced: number;
  wallets_touched: number;
  transactions_traced: number;
  outflow_from_root: number;
  outflow_token: string;
  endpoints: TraceEndpoint[];
  headline: string;
}

export interface Investigation {
  address: string;
  graph_stats: { nodes: number; edges: number };
  hops: Hop[];
  risk: {
    score: number;
    max_hop: number;
    factors: RiskFactor[];
    wallets_flagged: { scam: WalletFlag[]; exchange: WalletFlag[] };
  };
  summary?: TraceSummaryData | null;
  narrative?: string | null;
}

export interface Case {
  id: number;
  title: string;
  status: string;
  created_at: string;
  report_count: string;
  risk_score?: number | null;
  findings?: Investigation | null;
  victim_reports?: VictimReport[];
}

export interface VictimReport {
  id: number;
  case_id: number;
  victim_name: string | null;
  contact: string | null;
  amount_lost: number | null;
  reported_wallet: string;
  created_at: string;
}

// Older saved investigations (from before wallets_flagged returned
// {address, label} objects) stored scam/exchange as plain address
// strings. This normalizes either shape so old cases don't crash the UI.
export function normalizeWalletFlags(flags: unknown): WalletFlag[] {
  if (!Array.isArray(flags)) return [];
  return flags.map((w) =>
    typeof w === "string" ? { address: w, label: null } : (w as WalletFlag)
  );
}

export async function submitReport(body: {
  reported_wallet: string;
  victim_name?: string | null;
  contact?: string | null;
  amount_lost?: string | null;
  case_title?: string | null;
}) {
  const res = await fetch(`${NODE_API}/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed (${res.status})`);
  }
  return res.json() as Promise<{ case_id: number; report_id: number; investigation: Investigation }>;
}

export async function getCases(): Promise<Case[]> {
  const res = await fetch(`${NODE_API}/reports/cases`, { cache: "no-store" });
  if (!res.ok) throw new Error("Could not load cases");
  return res.json();
}

export async function getCaseDetail(id: number) {
  const res = await fetch(`${NODE_API}/reports/cases/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Case not found");
  return res.json() as Promise<{
    case: Case;
    victim_reports: VictimReport[];
    investigations: { risk_score: number; findings: Investigation }[];
  }>;
}

export async function getCasesWithRisk(): Promise<Case[]> {
  const cases = await getCases();
  return Promise.all(
    cases.map(async (c) => {
      try {
        const detail = await getCaseDetail(c.id);
        const latest = detail.investigations?.[0];
        return {
          ...c,
          risk_score: latest?.risk_score ?? null,
          findings: latest?.findings ?? null,
          victim_reports: detail.victim_reports,
        };
      } catch {
        return { ...c, risk_score: null, findings: null };
      }
    })
  );
}

export async function investigateWallet(address: string): Promise<Investigation> {
  const res = await fetch(`${ANALYTICS_API}/investigate/${address}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed (${res.status})`);
  }
  return res.json();
}

export function shortAddr(a: string) {
  if (!a) return "";
  return a.slice(0, 8) + "…" + a.slice(-6);
}

export function riskTier(score: number) {
  if (score >= 60) return { cls: "high", label: "High risk", sub: "Recommend priority investigation" };
  if (score >= 30) return { cls: "mid", label: "Moderate risk", sub: "Worth further review" };
  return { cls: "low", label: "Low risk", sub: "No strong signals detected" };
}