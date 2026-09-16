import { Investigation } from "@/lib/api";
import RiskGauge from "./RiskGauge";
import RiskFactors from "./RiskFactors";
import FlaggedWallets from "./FlaggedWallets";
import HopList from "./HopList";
import FundFlowGraph from "./FundFlowGraph";

export default function InvestigationPanel({ investigation }: { investigation: Investigation | null }) {
  if (!investigation || !investigation.risk) {
    return <div className="text-center text-sm text-inkFaint py-8">No transaction data found for this wallet yet.</div>;
  }
  return (
    <div>
      <RiskGauge score={investigation.risk.score} />
      <FundFlowGraph investigation={investigation} />
      <RiskFactors factors={investigation.risk.factors} />
      <FlaggedWallets scam={investigation.risk.wallets_flagged.scam} exchange={investigation.risk.wallets_flagged.exchange} />
      <div className="mt-6">
        <div className="text-xs font-extrabold text-inkSoft uppercase tracking-wide mb-3">Fund flow trace (detail)</div>
        <HopList hops={investigation.hops} />
      </div>
    </div>
  );
}