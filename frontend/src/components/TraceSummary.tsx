import { TraceSummaryData, shortAddr } from "@/lib/api";

export default function TraceSummary({ summary }: { summary?: TraceSummaryData | null }) {
  if (!summary) return null;

  return (
    <div className="bg-surfaceTint rounded-md2 p-4.5">
      <div className="text-xs font-extrabold text-inkSoft uppercase tracking-wide mb-2">
        What happened to these funds
      </div>
      <p className="text-sm leading-relaxed text-ink mb-3.5">{summary.headline}</p>

      <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-inkFaint mb-3.5">
        <span><strong className="text-ink">{summary.wallets_touched}</strong> wallets touched</span>
        <span><strong className="text-ink">{summary.transactions_traced}</strong> transactions traced</span>
        <span><strong className="text-ink">{summary.hops_traced}</strong> hops deep</span>
        <span>
          <strong className="text-ink">{summary.outflow_from_root}</strong> {summary.outflow_token} left the reported wallet directly
        </span>
      </div>

      {summary.endpoints.length > 0 && (
        <div>
          <div className="text-[11px] font-bold text-inkSoft mb-1.5">
            Where the trail currently ends ({summary.endpoints.length}{summary.endpoints.length === 15 ? "+" : ""}):
          </div>
          <div className="flex flex-wrap gap-1.5">
            {summary.endpoints.map((e) => (
              <span
                key={e.address}
                title={e.address}
                className={`font-mono text-[10.5px] px-2 py-0.5 rounded-md ${
                  e.entity_type === "scam"
                    ? "bg-coralPale text-[#C43C3E]"
                    : e.entity_type === "exchange"
                    ? "bg-mintPale text-[#1D8F68]"
                    : "bg-bgAlt text-inkSoft"
                }`}
              >
                {e.label || shortAddr(e.address)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}