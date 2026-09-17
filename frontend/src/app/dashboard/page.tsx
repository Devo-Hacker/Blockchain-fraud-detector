"use client";

import { useEffect, useState } from "react";
import { getCasesWithRisk, Case } from "@/lib/api";
import Link from "next/link";
import { ShieldAlert, ArrowUpRight, ChevronDown, ChevronUp, Search } from "lucide-react";

export default function DashboardRoute() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllCases, setShowAllCases] = useState(false);

  useEffect(() => {
    getCasesWithRisk()
      .then((data) => setCases(data))
      .catch(() => setCases([]))
      .finally(() => setLoading(false));
  }, []);

  const displayedCases = showAllCases ? cases : cases.slice(0, 4);

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-[#0E131F] border-2 border-slate-800 p-8 md:p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)]">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-lime-400/10 text-lime-400 border border-lime-400/30 mb-4 uppercase">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
            System Live // Analytical Engine Active
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-3">
            Risk &amp; Compliance Hub
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Monitor real-time threat intelligence, review reported illicit wallet clusters, and process forensic complaints.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/report/new"
              className="px-5 py-2.5 rounded-xl bg-lime-400 text-black font-extrabold text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:bg-lime-300 transition-all flex items-center gap-2"
            >
              New Investigation <ArrowUpRight size={16} />
            </Link>
            <Link
              href="/wallets"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs uppercase tracking-wider border-2 border-slate-700 transition-all flex items-center gap-2"
            >
              <Search size={16} /> Wallet Scanner
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Recent Active Cases</h2>
            <p className="text-xs text-slate-400 mt-0.5">Flagged transactions requiring officer review</p>
          </div>
          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#0E131F] border-2 border-slate-800 text-lime-400 font-bold">
            TOTAL CASES: {cases.length}
          </span>
        </div>

        <div className="bg-[#0E131F] border-2 border-slate-800 rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)]">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm font-mono">Loading investigation records...</div>
          ) : cases.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No active forensic cases logged.</div>
          ) : (
            <>
              <div className="divide-y divide-slate-800">
                {displayedCases.map((c) => (
                  <Link
                    key={c.id}
                    href={`/cases/${c.id}`}
                    className="flex items-center justify-between p-4 md:px-6 hover:bg-slate-900/80 transition-colors group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-lime-400 shrink-0 group-hover:border-lime-400 transition-colors">
                        <ShieldAlert size={18} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-white truncate group-hover:text-lime-400 transition-colors">
                          {c.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5 font-mono">
                          LOGGED: {new Date(c.created_at).toLocaleDateString()} · REPORTS: {c.report_count}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {c.risk_score !== null && c.risk_score !== undefined && (
                        <span
                          className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                            c.risk_score >= 60
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                              : c.risk_score >= 30
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : "bg-lime-400/10 text-lime-400 border-lime-400/30"
                          }`}
                        >
                          RISK: {c.risk_score}
                        </span>
                      )}
                      <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-700">
                        {c.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {cases.length > 4 && (
                <div className="p-3 bg-black/40 border-t-2 border-slate-800 text-center">
                  <button
                    onClick={() => setShowAllCases(!showAllCases)}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase text-lime-400 hover:text-lime-300 transition-colors py-1 px-3 rounded-lg hover:bg-slate-900"
                  >
                    {showAllCases ? (
                      <>
                        Show Less <ChevronUp size={14} />
                      </>
                    ) : (
                      <>
                        See More ({cases.length - 4} remaining) <ChevronDown size={14} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}