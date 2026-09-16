import { RiskFactor, shortAddr } from "@/lib/api";

export default function RiskFactors({ factors }: { factors: RiskFactor[] }) {
  if (!factors || factors.length === 0) {
    return <div className="text-sm text-inkFaint py-3">No risk signals detected in this trace.</div>;
  }
  return (
    <div>
      {factors.map((f, i) => (
        <div key={i} className={`py-3 text-sm ${i > 0 ? "border-t border-bgAlt" : ""}`}>
          <div className="flex justify-between gap-3">
            <div className="flex-1 leading-relaxed">{f.reason}</div>
            <div className="bg-violetPale text-violetDeep font-extrabold text-xs px-2.5 py-1 rounded-full whitespace-nowrap h-fit">
              +{f.points}
            </div>
          </div>
          {f.evidence && f.evidence.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {f.evidence.map((e, j) => (
                <span key={j} className="font-mono text-[10.5px] bg-bgAlt text-inkSoft px-2 py-0.5 rounded-md">
                  {e.startsWith("0x") ? shortAddr(e) : e}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}