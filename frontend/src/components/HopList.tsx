import { Hop, shortAddr } from "@/lib/api";

export default function HopList({ hops }: { hops: Hop[] }) {
  if (!hops || hops.length === 0) {
    return <div className="text-center text-sm text-inkFaint py-8">No outgoing transactions found for this wallet.</div>;
  }
  return (
    <div>
      {hops.map((h, i) => (
        <div
          key={i}
          className={`grid grid-cols-[24px_1fr_auto_1fr_auto] items-center gap-2.5 py-2.5 text-xs ${i > 0 ? "border-t border-bgAlt" : ""}`}
        >
          <span className="bg-violetPale text-violetDeep font-bold w-[22px] h-[22px] rounded-md flex items-center justify-center text-[11px]">
            {h.hop}
          </span>
          <span className="font-mono text-inkSoft truncate" title={h.from}>{shortAddr(h.from)}</span>
          <span className="text-inkFaint">→</span>
          <span className="font-mono text-inkSoft truncate" title={h.to}>{shortAddr(h.to)}</span>
          <span className="font-mono font-semibold text-right">{h.value} {h.token}</span>
        </div>
      ))}
    </div>
  );
}