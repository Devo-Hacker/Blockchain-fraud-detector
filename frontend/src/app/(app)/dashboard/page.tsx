import { getCasesWithRisk, shortAddr } from "@/lib/api";
import Link from "next/link";
import ProfileHeader from "@/components/ProfileHeader";

export default async function Dashboard() {
  let cases: Awaited<ReturnType<typeof getCasesWithRisk>> = [];
  let loadError = "";

  try {
    cases = await getCasesWithRisk();
  } catch (e: any) {
    loadError = e.message;
  }

  const totalReports = cases.reduce((sum, c) => sum + parseInt(c.report_count || "0"), 0);
  const highRisk = cases.filter((c) => c.risk_score !== null && c.risk_score !== undefined && c.risk_score >= 60).length;
  const scamLinks = cases.filter((c) => (c.findings?.risk?.wallets_flagged?.scam?.length ?? 0) > 0).length;

  return (
    <div>
      <ProfileHeader />

      <div className="mb-7">
        <h2 className="text-2xl font-extrabold mb-1.5 tracking-tight">Investigation overview</h2>
        <p className="text-inkSoft text-sm max-w-lg">
          Live status of cases opened through this platform. Figures reflect complaints actually filed and investigated below.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4.5 mb-6">
        <div className="rounded-lg2 p-5.5 shadow-clay bg-gradient-to-br from-violet to-violetDeep text-white">
          <div className="text-[12.5px] font-semibold opacity-85 mb-2.5">Total cases</div>
          <div className="text-3xl font-extrabold">{cases.length}</div>
        </div>
        <div className="rounded-lg2 p-5.5 shadow-clay bg-surface">
          <div className="text-[12.5px] font-semibold text-inkSoft mb-2.5">Victim reports filed</div>
          <div className="text-3xl font-extrabold">{totalReports}</div>
        </div>
        <div className="rounded-lg2 p-5.5 shadow-clay bg-surface">
          <div className="text-[12.5px] font-semibold text-inkSoft mb-2.5">High-risk flags (≥60)</div>
          <div className="text-3xl font-extrabold">{highRisk}</div>
        </div>
        <div className="rounded-lg2 p-5.5 shadow-clay bg-surface">
          <div className="text-[12.5px] font-semibold text-inkSoft mb-2.5">Known-scam links found</div>
          <div className="text-3xl font-extrabold">{scamLinks}</div>
        </div>
      </div>

      <div className="bg-surface rounded-lg2 shadow-clay p-6.5">
        <div className="text-xs font-extrabold text-inkSoft uppercase tracking-wide mb-4">Recent cases</div>
        {loadError && <div className="text-sm text-inkFaint py-8 text-center">Could not load cases — is the backend running? ({loadError})</div>}
        {!loadError && cases.length === 0 && (
          <div className="text-sm text-inkFaint py-8 text-center">No complaints filed yet. Use &quot;New complaint&quot; to get started.</div>
        )}
        {cases.slice(0, 6).map((c) => {
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