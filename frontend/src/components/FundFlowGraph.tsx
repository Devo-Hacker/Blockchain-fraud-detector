"use client";

import { useEffect, useRef } from "react";
import { Investigation, normalizeWalletFlags } from "@/lib/api";

export default function FundFlowGraph({ investigation }: { investigation: Investigation }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    async function draw() {
      if (!containerRef.current || !investigation?.hops) return;
      const vis = await import("vis-network/standalone");

      const root = investigation.address.toLowerCase();
      const scamSet = new Set(
        normalizeWalletFlags(investigation.risk.wallets_flagged.scam).map((a) => a.address.toLowerCase())
      );
      const exchangeSet = new Set(
        normalizeWalletFlags(investigation.risk.wallets_flagged.exchange).map((a) => a.address.toLowerCase())
      );

      if (investigation.hops.length === 0 || cancelled) return;

      const nodeIds = new Set<string>();
      investigation.hops.forEach((h) => {
        nodeIds.add(h.from.toLowerCase());
        nodeIds.add(h.to.toLowerCase());
      });

      const nodeColor = (addr: string) => {
        if (addr === root) return { bg: "#6C5CE7", border: "#5443D6" };
        if (scamSet.has(addr)) return { bg: "#E5595B", border: "#C43C3E" };
        if (exchangeSet.has(addr)) return { bg: "#2FBF8F", border: "#1D8F68" };
        return { bg: "#D9D5EF", border: "#B8B2D6" };
      };

      const nodes = new vis.DataSet(
        [...nodeIds].map((addr) => {
          const c = nodeColor(addr);
          const isRoot = addr === root;
          return {
            id: addr,
            label: addr.slice(0, 8) + "…" + addr.slice(-6),
            shape: "dot",
            size: isRoot ? 26 : 16,
            font: { color: "#2B2745", size: 11, face: "JetBrains Mono", background: "rgba(255,255,255,0.75)" },
            color: { background: c.bg, border: c.border },
            borderWidth: isRoot ? 3 : 2,
          };
        })
      );

      const edges = new vis.DataSet(
        investigation.hops.map((h, i) => ({
          id: i,
          from: h.from.toLowerCase(),
          to: h.to.toLowerCase(),
          arrows: "to",
          color: { color: "#C3BCEA", highlight: "#6C5CE7" },
          label: h.value > 0 ? `${h.value} ${h.token}` : "",
          font: { size: 9, color: "#9994B0", face: "JetBrains Mono", strokeWidth: 0, background: "rgba(255,255,255,0.8)" },
          smooth: { enabled: true, type: "continuous", roundness: 0.5 },
          width: 1.5,
        }))
      );

      if (networkRef.current) networkRef.current.destroy();

      networkRef.current = new vis.Network(
        containerRef.current,
        { nodes, edges },
        {
          layout: { improvedLayout: true },
          physics: {
            solver: "forceAtlas2Based",
            forceAtlas2Based: { gravitationalConstant: -60, springLength: 90, springConstant: 0.06 },
            stabilization: { iterations: 120 },
          },
          interaction: { hover: true, tooltipDelay: 100 },
          edges: { shadow: false },
        }
      );
    }

    draw();
    return () => {
      cancelled = true;
      if (networkRef.current) networkRef.current.destroy();
    };
  }, [investigation]);

  return (
    <div>
      <div className="text-xs font-extrabold text-inkSoft uppercase tracking-wide mb-3">Fund flow graph</div>
      <div className="flex gap-4 flex-wrap text-xs text-inkFaint mb-3">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-violet inline-block" /> Target wallet</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-coral inline-block" /> Known scam</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-mint inline-block" /> Known exchange</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#B8B2D6] inline-block" /> Unlabeled</span>
      </div>
      <div ref={containerRef} className="h-[320px] rounded-md2 bg-surfaceTint overflow-hidden" />
    </div>
  );
}