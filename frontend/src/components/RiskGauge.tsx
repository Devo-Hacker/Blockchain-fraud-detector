import { riskTier } from "@/lib/api";

const ringColors: Record<string, { fill: string; text: string; track: string }> = {
  low: { fill: "#2FBF8F", text: "#1D8F68", track: "#DDF5EB" },
  mid: { fill: "#E0A430", text: "#A9740F", track: "#FBEED2" },
  high: { fill: "#E5595B", text: "#C43C3E", track: "#FBDEDE" },
};

export default function RiskGauge({ score }: { score: number }) {
  const tier = riskTier(score);
  const c = ringColors[tier.cls];

  return (
    <div className="flex items-center gap-5 py-2 pb-5">
      <div
        className="relative w-[92px] h-[92px] rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: `conic-gradient(${c.fill} ${score}%, ${c.track} 0)` }}
      >
        <div className="absolute w-[70px] h-[70px] rounded-full bg-surface" />
        <span className="relative z-10 font-extrabold text-2xl" style={{ color: c.text }}>
          {score}
        </span>
      </div>
      <div>
        <div className="font-bold text-sm mb-0.5">{tier.label}</div>
        <div className="text-xs text-inkFaint">{tier.sub}</div>
      </div>
    </div>
  );
}