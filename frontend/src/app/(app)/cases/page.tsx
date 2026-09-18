import { getCasesWithRisk, shortAddr } from "@/lib/api";
import Link from "next/link";

export default async function CaseRegistry() {
  let cases: Awaited<ReturnType<typeof getCasesWithRisk>> = [];
  let loadError = "";
  try {
    cases = await getCasesWithRisk();
  } catch (e: any) {
    loadError = e.message;
  }

  return (
    <div>
      <div className="mb-7">
        <h2 className="text-2xl font-extrabold mb-1.5 tracking-tight">Case registry</h2>
        <p className="text-inkSoft text-sm">All complaints filed through this platform.</p>
      </div>
      <div className="bg-surface rounded-lg2 shadow-clay p-6.5">
        {loadError && <div className="text-sm text-inkFaint py-8 text-center">Could not load cases ({loadError})</div>}
        {!loadError && cases.length === 0 && <div className="text-sm text-inkFaint py-8 text-center">No complaints filed yet.</div>}
        {cases.map((c) => {
          const score = c.risk_score !== null && c.risk_score !== undefined ? Math.round(c.risk_score) : null;
          const chipCls =
            score === null ? "bg-bgAlt text-inkFaint" : score >= 60 ? "bg-coralPale text-[#C43C3E]" : score >= 30 ? "bg-amberPale text-[#A9740F]" : "bg-mintPale text-[#1D8F68]";
          const wallet = c.victim_reports?.[0]?.reported_wallet || "";
          return (
            <Link
              key={c.id}
              href={`/cases/${c.id}`}
              className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4.5 py-4 border-t border-bgAlt first:border-t-0 hover:bg-surfaceTint rounded-xl px-1 -mx-1"
            >
              <div className={`w-[46px] h-[46px] rounded-2xl flex items-center justify-center font-extrabold text-sm ${chipCls}`}>
                {score !== null ? score : "—"}
              </div>
              <div>
                <div className="font-bold text-sm mb-0.5">{c.title}</div>
                <div className="font-mono text-xs text-inkFaint">{shortAddr(wallet)} · {c.report_count} report(s)</div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[11.5px] font-bold ${c.status === "open" ? "bg-mintPale text-[#1D8F68]" : "bg-bgAlt text-inkSoft"}`}>
                {c.status}
              </span>
              <span className="text-inkFaint text-lg">›</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}