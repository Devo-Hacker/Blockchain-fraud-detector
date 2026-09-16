import { Hop, shortAddr } from "@/lib/api";

function formatTime(ts: string) {
  const d = new Date(ts);
  if (isNaN(d.getTime())) return ts;
  return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default function HopList({ hops }: { hops: Hop[] }) {
  if (!hops || hops.length === 0) {
    return <div className="text-center text-sm text-inkFaint py-8">No outgoing transactions found for this wallet.</div>;
  }
  return (
    <div>
      {hops.map((h, i) => (
        <div key={`${h.tx_hash}-${i}`} className={`py-3 text-xs ${i > 0 ? "border-t border-bgAlt" : ""}`}>
          <div className="grid grid-cols-[24px_1fr_auto_1fr_auto] items-center gap-2.5">
            <span className="bg-violetPale text-violetDeep font-bold w-[22px] h-[22px] rounded-md flex items-center justify-center text-[11px]">
              {h.hop}
            </span>
            <span className="font-mono text-inkSoft truncate" title={h.from}>{shortAddr(h.from)}</span>
            <span className="text-inkFaint">→</span>
            <span className="font-mono text-inkSoft truncate" title={h.to}>{shortAddr(h.to)}</span>
            <span className="font-mono font-semibold text-right">{h.value} {h.token}</span>
          </div>
          <div className="flex justify-between mt-1.5 pl-[30px] text-[10.5px] text-inkFaint">
            <span className="font-mono truncate max-w-[220px]" title={h.tx_hash}>tx: {shortAddr(h.tx_hash)}</span>
            <span>{formatTime(h.timestamp)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}