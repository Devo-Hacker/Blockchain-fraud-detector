"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCasesWithRisk, Case } from "@/lib/api";
import {
  ShieldAlert,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Search,
  Activity,
  Lock,
  Zap,
  TrendingUp,
  Terminal,
} from "lucide-react";

export default function CombinedMainPage() {
  // Case Data State
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllCases, setShowAllCases] = useState(false);

  // Accordion State
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);

  useEffect(() => {
    getCasesWithRisk()
      .then((data) => setCases(data))
      .catch(() => setCases([]))
      .finally(() => setLoading(false));
  }, []);

  const displayedCases = showAllCases ? cases : cases.slice(0, 4);

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#06080D] text-slate-100 flex flex-col font-sans selection:bg-lime-400 selection:text-black">
      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-6 pb-16 space-y-12">
        {/* DASHBOARD RISK HUB HERO */}
        <section className="relative overflow-hidden rounded-2xl bg-[#0E131F] border-2 border-slate-800 p-8 md:p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)]">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-lime-400/10 text-lime-400 border border-lime-400/30 mb-4 uppercase">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              System Live // Analytical Engine Active
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-3">
              Risk &amp; Compliance Hub
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6">
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
        </section>

        {/* RECENT ACTIVE CASES REGISTRY */}
        <section className="space-y-4">
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
        </section>

        {/* LANDING & FEATURE CARDS SECTION */}
        <section className="space-y-6 pt-6 border-t-2 border-slate-800/80">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
              End-to-End Blockchain Intelligence
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Smarter risk decisions delivered with instant transitive execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-[#0E131F] border-2 border-slate-800 hover:border-lime-400 hover:bg-slate-900 transition-all duration-300 group flex flex-col justify-between h-64 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)]">
              <div>
                <Search className="w-8 h-8 text-slate-400 group-hover:text-lime-400 transition-colors mb-4" />
                <h3 className="text-xl font-extrabold text-white group-hover:text-lime-400 transition-colors">
                  See further
                </h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  Screen unmapped wallet clusters across 30+ blockchains with real-time graph routing.
                </p>
              </div>
              <div className="text-xs font-mono text-slate-500 group-hover:text-slate-300 transition-colors">
                MODULE // 01
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0E131F] border-2 border-slate-800 hover:border-lime-400 hover:bg-slate-900 transition-all duration-300 group flex flex-col justify-between h-64 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)]">
              <div>
                <Zap className="w-8 h-8 text-slate-400 group-hover:text-lime-400 transition-colors mb-4" />
                <h3 className="text-xl font-extrabold text-white group-hover:text-lime-400 transition-colors">
                  Act faster
                </h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  Agentic AI triages high-risk financial laundering events in milliseconds.
                </p>
              </div>
              <div className="text-xs font-mono text-slate-500 group-hover:text-slate-300 transition-colors">
                MODULE // 02
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0E131F] border-2 border-slate-800 hover:border-lime-400 hover:bg-slate-900 transition-all duration-300 group flex flex-col justify-between h-64 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)]">
              <div>
                <Lock className="w-8 h-8 text-slate-400 group-hover:text-lime-400 transition-colors mb-4" />
                <h3 className="text-xl font-extrabold text-white group-hover:text-lime-400 transition-colors">
                  Move confidently
                </h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  Defensible audit trails engineered explicitly for law enforcement standards.
                </p>
              </div>
              <div className="text-xs font-mono text-slate-500 group-hover:text-slate-300 transition-colors">
                MODULE // 03
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-lime-400 text-black border-2 border-black flex flex-col justify-between h-64 shadow-[5px_5px_0px_0px_#000]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-black text-lime-400 rounded">
                  Solutions For
                </span>
                <ul className="mt-4 space-y-2 text-xs font-bold uppercase tracking-wider">
                  <li className="flex items-center gap-2"><ArrowRight size={12} /> Financial Institutions</li>
                  <li className="flex items-center gap-2"><ArrowRight size={12} /> Law Enforcement</li>
                  <li className="flex items-center gap-2"><ArrowRight size={12} /> Regulators &amp; FIUs</li>
                  <li className="flex items-center gap-2"><ArrowRight size={12} /> Crypto Exchanges</li>
                </ul>
              </div>
              <div className="text-xs font-mono font-black">SYSTEM READY // 2026</div>
            </div>
          </div>
        </section>

        {/* ACCORDION TOGGLE SECTION & TERMINAL */}
        <section className="rounded-3xl bg-[#0B0F19] border-2 border-slate-800 p-8 md:p-10 shadow-[6px_6px_0px_0px_rgba(15,23,42,0.8)]">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Every transaction, fully understood
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              From compliance to complex investigations, turn complexity into actionable clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              {[
                {
                  title: "Crypto compliance & screening",
                  desc: "Automated real-time wallet address screening against global sanction lists, illicit attribution databases, and OFAC registries.",
                  icon: ShieldAlert,
                },
                {
                  title: "Stablecoin risk management",
                  desc: "Track velocity and concentration risks across fiat-backed stablecoins across multi-chain bridges and decentralised liquidity pools.",
                  icon: TrendingUp,
                },
                {
                  title: "Forensic investigations & asset tracing",
                  desc: "Visualise complex multi-hop transaction graphs and trace stolen digital assets directly to cash-out off-ramps.",
                  icon: Activity,
                },
              ].map((item, index) => {
                const Icon = item.icon;
                const isOpen = activeAccordion === index;
                return (
                  <div
                    key={index}
                    onClick={() => toggleAccordion(index)}
                    className={`cursor-pointer rounded-2xl border-2 transition-all duration-300 p-5 ${
                      isOpen
                        ? "bg-slate-900 border-lime-400 shadow-[4px_4px_0px_0px_#a3e635]"
                        : "bg-[#0E131F] border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isOpen ? "bg-lime-400 text-black" : "bg-slate-800 text-slate-300"}`}>
                          <Icon size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      </div>
                      {isOpen ? <ChevronUp size={20} className="text-lime-400" /> : <ChevronDown size={20} className="text-slate-500" />}
                    </div>

                    {isOpen && (
                      <p className="mt-4 text-xs md:text-sm text-slate-300 leading-relaxed pl-12 border-l-2 border-lime-400/40">
                        {item.desc}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-5 rounded-2xl bg-black border-2 border-slate-800 p-6 flex flex-col justify-between min-h-[320px] shadow-inner relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 border-b border-slate-800 pb-3">
                  <span className="flex items-center gap-2"><Terminal size={14} className="text-lime-400" /> INTELLIGENCE_FEED.LOG</span>
                  <span className="text-lime-400 animate-pulse">● LIVE</span>
                </div>

                <div className="space-y-2 font-mono text-xs text-slate-300">
                  <p className="text-slate-500">&gt; Initializing graph query...</p>
                  <p className="text-emerald-400">&gt; Target: 0x71C...39A1 [FLAGGED_HIGH_RISK]</p>
                  <p className="text-slate-400">&gt; Risk Score: 88/100 (Money Laundering Cluster)</p>
                  <p className="text-slate-400">&gt; Associated Entity: Unlicensed OTC Swap Desk</p>
                  <p className="text-lime-400">&gt; Recommendation: Immediate Freeze Directive</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">Node ID: SC-IND-8829</span>
                <span className="px-2 py-1 rounded bg-lime-400/10 text-lime-400 font-mono text-[10px] border border-lime-400/20">
                  CONFIDENCE: 99.4%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* RESEARCH DOCUMENTATION & INDIA VULNERABILITY REPORT */}
        <section id="research" className="rounded-3xl bg-gradient-to-b from-[#0E1320] to-[#080B12] border-2 border-lime-400/40 p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(163,230,53,0.1)] space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold uppercase mb-3">
                National Security &amp; Forensic Brief
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                India Financial Cyber Crime Vulnerability Index
              </h2>
            </div>
            <div className="shrink-0 text-right">
              <span className="text-xs font-mono text-slate-400 block">DOCUMENT REF: SC-IND-2026</span>
              <span className="text-xs font-mono text-lime-400 font-bold">STATUS: DECLASSIFIED</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>
                In recent years, India has suffered an unprecedented surge in sophisticated financial cybercrime operations. Unregulated peer-to-peer (P2P) crypto exchanges, mule bank account networks, and instant messaging scam syndicates have siphoned thousands of crores out of the domestic banking infrastructure into obfuscated on-chain ecosystems.
              </p>
              <p>
                The primary vector involves illicit Telegram and WhatsApp investment syndicates luring victims into fake trading applications, immediately swapping seized INR funds into USDT, and bridging them across cross-chain liquidity protocol mixers to evade domestic law enforcement freezing orders.
              </p>

              <div className="p-5 rounded-2xl bg-black/60 border-2 border-slate-800 my-6 font-mono text-xs space-y-2">
                <div className="text-lime-400 font-bold uppercase">Key On-Chain Metrics (India Sector):</div>
                <div className="text-slate-400">• Over ₹7,800 Crore identified in illicit crypto outflows during recent cycles.</div>
                <div className="text-slate-400">• 64% of cyber fraud funds converted to stablecoins within 15 minutes of bank compromise.</div>
                <div className="text-slate-400">• High concentration of unhosted wallet addresses linked to offshore unregistered exchanges.</div>
              </div>

              <p>
                Smart-chain-analyzer provides law enforcement agencies and compliance teams with real-time tracking, enabling immediate mapping of digital asset movements to facilitate prompt freeze requests and inter-agency intelligence coordination.
              </p>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="p-6 rounded-2xl bg-[#090C14] border-2 border-slate-800 space-y-4">
                <h4 className="font-extrabold text-white text-base">Key National Intelligence Indicators</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-slate-400">P2P Scam Exploitation</div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1"><div className="bg-rose-500 h-full w-[82%]" /></div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Cross-Border Capital Flight</div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1"><div className="bg-amber-400 h-full w-[68%]" /></div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Recovery Rate (With Intelligence)</div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1"><div className="bg-lime-400 h-full w-[91%]" /></div>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  className="w-full mt-4 py-3 rounded-xl bg-lime-400 text-black font-extrabold text-xs uppercase tracking-wider border-2 border-black flex items-center justify-center gap-2 hover:bg-lime-300 transition-all"
                >
                  Access Forensic Tools <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="pt-8 border-t-2 border-slate-800/80 max-w-6xl w-full mx-auto px-4 pb-12">
        <div className="rounded-2xl bg-[#0B0F19] border-2 border-slate-800 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-lime-400 flex items-center justify-center font-black text-black text-xs border border-black">
              SC
            </div>
            <span className="font-extrabold text-sm text-white uppercase tracking-wider">
              Smart-chain-analyzer
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500 font-mono">
            <span>[PRIVACY POLICY]</span>
            <span>[TERMS OF SERVICE]</span>
            <span>[API STATUS: ONLINE]</span>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            © 2026 Smart-chain-analyzer. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}