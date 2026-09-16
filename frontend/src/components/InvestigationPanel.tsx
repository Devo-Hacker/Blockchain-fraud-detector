"use client";

import { useState } from "react";
import { Investigation, normalizeWalletFlags } from "@/lib/api";
import RiskGauge from "./RiskGauge";
import RiskFactors from "./RiskFactors";
import FlaggedWallets from "./FlaggedWallets";
import HopList from "./HopList";
import FundFlowGraph from "./FundFlowGraph";
import AICaseSummary from "./AICaseSummary";
import TraceSummary from "./TraceSummary";

const TABS = ["Overview", "Fund flow graph", "Risk breakdown", "Full trace"] as const;
type Tab = (typeof TABS)[number];

export default function InvestigationPanel({ investigation }: { investigation: Investigation | null }) {
  const [tab, setTab] = useState<Tab>("Overview");

  if (!investigation || !investigation.risk) {
    return <div className="text-center text-sm text-inkFaint py-8">No transaction data found for this wallet yet.</div>;
  }

  const scamFlags = normalizeWalletFlags(investigation.risk.wallets_flagged?.scam);
  const exchangeFlags = normalizeWalletFlags(investigation.risk.wallets_flagged?.exchange);

  // Prefer the trace-scoped counts (only wallets/txns this specific trace
  // actually reached). Fall back to the old whole-database graph_stats
  // only for cases saved before the trace summary existed.
  const s = investigation.summary;
  const walletsInTrace = s?.wallets_touched ?? investigation.graph_stats.nodes;
  const txnsInTrace = s?.transactions_traced ?? investigation.graph_stats.edges;
  const hopsInTrace = s?.hops_traced ?? investigation.risk.max_hop;

  return (
    <div>
      <RiskGauge score={investigation.risk.score} />

      <div className="flex gap-4 text-xs text-inkFaint mb-5 pb-4 border-b border-bgAlt">
        <span><strong className="text-ink">{walletsInTrace}</strong> wallets reached from this address</span>
        <span><strong className="text-ink">{txnsInTrace}</strong> transactions in this trace</span>
        <span><strong className="text-ink">{hopsInTrace}</strong> hops deep</span>
      </div>

      <div className="flex gap-1.5 mb-5 border-b border-bgAlt">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3.5 py-2.5 text-xs font-bold rounded-t-lg -mb-px border-b-2 transition-colors ${
              tab === t ? "border-violet text-violetDeep" : "border-transparent text-inkFaint hover:text-inkSoft"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="space-y-5">
          <TraceSummary summary={investigation.summary} />
          <AICaseSummary narrative={investigation.narrative} />
          <div>
            <div className="text-xs font-extrabold text-inkSoft uppercase tracking-wide mb-3">Top risk factors</div>
            <RiskFactors factors={investigation.risk.factors.slice(0, 3)} />
          </div>
          <FlaggedWallets scam={scamFlags} exchange={exchangeFlags} />
        </div>
      )}

      {tab === "Fund flow graph" && <FundFlowGraph investigation={investigation} />}

      {tab === "Risk breakdown" && (
        <div>
          <div className="text-xs font-extrabold text-inkSoft uppercase tracking-wide mb-3">All risk factors</div>
          <RiskFactors factors={investigation.risk.factors} />
          <FlaggedWallets scam={scamFlags} exchange={exchangeFlags} />
        </div>
      )}

      {tab === "Full trace" && (
        <div>
          <div className="text-xs font-extrabold text-inkSoft uppercase tracking-wide mb-3">Fund flow trace (detail)</div>
          <HopList hops={investigation.hops} />
        </div>
      )}
    </div>
  );
}