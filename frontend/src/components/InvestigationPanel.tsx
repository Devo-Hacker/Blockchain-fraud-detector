"use client";

import { useState } from "react";
import { Investigation } from "@/lib/api";
import RiskGauge from "./RiskGauge";
import RiskFactors from "./RiskFactors";
import FlaggedWallets from "./FlaggedWallets";
import HopList from "./HopList";
import FundFlowGraph from "./FundFlowGraph";
import AICaseSummary from "./AICaseSummary";

const TABS = ["Overview", "Fund flow graph", "Risk breakdown", "Full trace"] as const;
type Tab = (typeof TABS)[number];

export default function InvestigationPanel({ investigation }: { investigation: Investigation | null }) {
  const [tab, setTab] = useState<Tab>("Overview");

  if (!investigation || !investigation.risk) {
    return <div className="text-center text-sm text-inkFaint py-8">No transaction data found for this wallet yet.</div>;
  }

  return (
    <div>
      <RiskGauge score={investigation.risk.score} />

      <div className="flex gap-4 text-xs text-inkFaint mb-5 pb-4 border-b border-bgAlt">
        <span><strong className="text-ink">{investigation.graph_stats.nodes}</strong> wallets in graph</span>
        <span><strong className="text-ink">{investigation.graph_stats.edges}</strong> transactions in graph</span>
        <span><strong className="text-ink">{investigation.risk.max_hop}</strong> hops traced</span>
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
          <AICaseSummary narrative={investigation.narrative} />
          <div>
            <div className="text-xs font-extrabold text-inkSoft uppercase tracking-wide mb-3">Top risk factors</div>
            <RiskFactors factors={investigation.risk.factors.slice(0, 3)} />
          </div>
          <FlaggedWallets
            scam={investigation.risk.wallets_flagged.scam}
            exchange={investigation.risk.wallets_flagged.exchange}
          />
        </div>
      )}

      {tab === "Fund flow graph" && <FundFlowGraph investigation={investigation} />}

      {tab === "Risk breakdown" && (
        <div>
          <div className="text-xs font-extrabold text-inkSoft uppercase tracking-wide mb-3">All risk factors</div>
          <RiskFactors factors={investigation.risk.factors} />
          <FlaggedWallets
            scam={investigation.risk.wallets_flagged.scam}
            exchange={investigation.risk.wallets_flagged.exchange}
          />
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