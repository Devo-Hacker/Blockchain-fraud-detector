"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Network,
  Search,
  Landmark,
  Users,
  ArrowRight,
  ChevronRight,
  Zap,
  Link2,
  AlertTriangle,
  Globe,
  MessageCircle,
  Mail,
  FileSearch,
  GitBranch,
  Gauge,
} from "lucide-react";

/* ---------------------------------------------------------
   Floating pill nav — fixed, centered, not full-width.
--------------------------------------------------------- */
function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4">
      <nav
        className={`flex items-center gap-8 rounded-full border-2 border-black bg-[#F5F4EF]/90 backdrop-blur-md px-6 py-3 transition-shadow duration-300 ${
          scrolled ? "shadow-[6px_6px_0_0_#000]" : "shadow-[3px_3px_0_0_#000]"
        }`}
      >
        <div className="flex items-center gap-2 pr-2 border-r-2 border-black/10">
          <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center">
            <span className="text-[#D7FF3D] font-display font-bold text-xs">Dt</span>
          </div>
          <span className="font-display font-bold text-[15px] tracking-tight">DhanTrace</span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-black/70">
          <a href="#how-it-works" className="hover:text-black transition-colors">How it works</a>
          <a href="#research" className="hover:text-black transition-colors">Research</a>
          <a href="#features" className="hover:text-black transition-colors">Features</a>
        </div>

        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 bg-[#D7FF3D] border-2 border-black rounded-full px-4 py-1.5 text-sm font-bold hover:bg-[#c4ea2c] transition-colors"
        >
          Get Started <ArrowRight size={14} strokeWidth={2.5} />
        </Link>
      </nav>
    </div>
  );
}

/* ---------------------------------------------------------
   Hero
--------------------------------------------------------- */
function Hero() {
  return (
    <section className="relative bg-[#F5F4EF] pt-44 pb-28 px-6 overflow-hidden">
      {/* decorative network lines */}
      <svg className="absolute top-24 right-0 w-[520px] h-[420px] opacity-[0.35] pointer-events-none hidden lg:block" viewBox="0 0 520 420" fill="none">
        <circle cx="420" cy="60" r="5" fill="#D7FF3D" stroke="#000" strokeWidth="2" />
        <circle cx="300" cy="150" r="4" fill="#000" />
        <circle cx="460" cy="220" r="6" fill="#000" />
        <circle cx="360" cy="320" r="4" fill="#D7FF3D" stroke="#000" strokeWidth="2" />
        <circle cx="200" cy="260" r="4" fill="#000" />
        <path d="M420 60 L300 150 L460 220 L360 320 M300 150 L200 260" stroke="#000" strokeWidth="1.5" />
      </svg>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-white border-2 border-black rounded-full px-3.5 py-1.5 text-xs font-bold mb-8 shadow-[2px_2px_0_0_#000]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF3D] border border-black" />
          Built for Smart India Hackathon 2026
        </div>

        <h1 className="font-display font-bold text-[42px] sm:text-[56px] md:text-[68px] leading-[1.05] tracking-tight mb-6">
          Every crypto scam
          <br />
          leaves a <span className="bg-[#D7FF3D] px-2 border-2 border-black inline-block -rotate-1">public trail.</span>
          <br />
          We follow it.
        </h1>

        <p className="text-lg text-black/65 max-w-xl mx-auto mb-10 leading-relaxed">
          DhanTrace turns a single victim-reported wallet address into a fully traced,
          risk-scored investigation — automatically, in seconds, on BNB Smart Chain.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-black text-white rounded-full pl-2 pr-5 py-2 font-bold text-sm border-2 border-black shadow-[3px_3px_0_0_#D7FF3D] hover:shadow-[5px_5px_0_0_#D7FF3D] hover:-translate-y-0.5 transition-all"
          >
            <span className="w-7 h-7 rounded-full bg-[#D7FF3D] flex items-center justify-center">
              <ArrowRight size={14} strokeWidth={2.5} className="text-black" />
            </span>
            Get Started
          </Link>
          <a
            href="#how-it-works"
            className="text-sm font-bold text-black/70 border-b-2 border-black/20 hover:border-black hover:text-black transition-colors pb-0.5"
          >
            See how it works
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   Research / problem section — real, sourced stats
--------------------------------------------------------- */
function ResearchSection() {
  return (
    <section id="research" className="bg-[#0B0C0F] text-white px-6 py-28">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle size={16} className="text-[#D7FF3D]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#D7FF3D]">
            The problem, in numbers
          </span>
        </div>

        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-[44px] leading-tight mb-6 max-w-3xl">
          India&apos;s cyber fraud problem is accelerating faster than the system built to catch it.
        </h2>

        <p className="text-white/55 max-w-2xl mb-16 leading-relaxed">
          These figures are drawn from Ministry of Home Affairs data and I4C reporting, as covered
          by The Print and MoneyLife (Dec 2025–Feb 2026) — not internal estimates.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden mb-16">
          {[
            { value: "₹22,495 Cr", label: "Lost to cyber fraud in India in 2025 alone" },
            { value: "75%+", label: "Of those losses came from investment scams — the category crypto fraud falls under" },
            { value: "2.81M", label: "Complaints reported in 2025, up 24% from 2024" },
            { value: "55,484", label: "Of those complaints actually became a registered FIR" },
          ].map((s, i) => (
            <div key={i} className="bg-[#0B0C0F] p-7">
              <div className="font-display font-bold text-3xl sm:text-4xl text-[#D7FF3D] mb-2">{s.value}</div>
              <div className="text-sm text-white/60 leading-snug">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white/5 border-2 border-[#D7FF3D]/30 rounded-2xl p-7 flex items-start gap-4">
          <div className="w-9 h-9 rounded-full bg-[#D7FF3D] flex items-center justify-center flex-shrink-0 mt-0.5">
            <Link2 size={16} className="text-black" strokeWidth={2.5} />
          </div>
          <p className="text-white/80 leading-relaxed">
            <strong className="text-white">The gap between 2.81M complaints and 55,484 FIRs</strong> is largely
            jurisdictional — cases filed in different cities rarely get cross-checked against each other, even
            when they trace back to the same wallet cluster. That&apos;s the specific gap DhanTrace is built to close.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   How it works
--------------------------------------------------------- */
function HowItWorks() {
  const steps = [
    { icon: FileSearch, title: "Victim reports a wallet", desc: "One address — the wallet the victim sent funds to. That's the only input needed to start." },
    { icon: Network, title: "We fetch the real chain data", desc: "Live BNB Smart Chain transaction history is pulled and a directed fund-flow graph is built automatically." },
    { icon: GitBranch, title: "The trail is followed, hop by hop", desc: "Multi-hop tracing follows the money through intermediary wallets, splitting, and consolidation." },
    { icon: Gauge, title: "A risk score, with reasons", desc: "Every signal — known scam links, exchange exposure, rapid movement — is scored and explained, not hidden." },
  ];

  return (
    <section id="how-it-works" className="bg-[#F5F4EF] px-6 py-28">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">How it works</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-[40px] leading-tight mb-16 max-w-2xl">
          From complaint to case file, without the manual legwork.
        </h2>

        <div className="grid md:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <div key={i} className="relative">
              <div className="bg-white border-2 border-black rounded-2xl p-6 h-full shadow-[3px_3px_0_0_#000]">
                <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center mb-5">
                  <s.icon size={20} className="text-[#D7FF3D]" strokeWidth={2} />
                </div>
                <div className="text-xs font-bold text-black/40 mb-1.5">STEP {i + 1}</div>
                <h3 className="font-display font-bold text-lg mb-2.5 leading-snug">{s.title}</h3>
                <p className="text-sm text-black/60 leading-relaxed">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <ChevronRight size={20} className="hidden md:block absolute top-1/2 -right-6 -translate-y-1/2 text-black/25" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   Feature toggle cards — click OR hover to activate,
   background transitions smoothly (the Elliptic pattern).
--------------------------------------------------------- */
function FeatureToggles() {
  const features = [
    {
      icon: Network,
      title: "Automated fund tracing",
      desc: "Multi-hop tracing across the fund-flow graph runs in seconds instead of hours of manual block-explorer clicking.",
    },
    {
      icon: ShieldAlert,
      title: "Explainable risk scoring",
      desc: "Every point in the score is attributed to a named signal — known scam links, exchange exposure, layering — never a black box.",
    },
    {
      icon: Landmark,
      title: "Entity intelligence",
      desc: "Wallets are checked against known scam, mixer, bridge, and exchange address sets, sourced from real on-chain intelligence.",
    },
    {
      icon: Users,
      title: "Cross-case correlation",
      desc: "Separate victim complaints that trace to the same wallet cluster get flagged as connected — even across different police stations.",
    },
  ];

  const [active, setActive] = useState(0);

  return (
    <section id="features" className="bg-[#F5F4EF] px-6 pb-28">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Search size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">What it does</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-[40px] leading-tight mb-16 max-w-2xl">
          Four things a human investigator would otherwise do by hand.
        </h2>

        <div className="grid md:grid-cols-4 gap-4">
          {features.map((f, i) => {
            const isActive = active === i;
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                className={`text-left rounded-2xl border-2 border-black p-6 min-h-[260px] flex flex-col transition-colors duration-300 ${
                  isActive ? "bg-black text-white" : "bg-white text-black hover:bg-white/70"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 ${
                    isActive ? "bg-[#D7FF3D]" : "bg-black"
                  }`}
                >
                  <f.icon size={20} className={isActive ? "text-black" : "text-[#D7FF3D]"} strokeWidth={2} />
                </div>
                <h3 className="font-display font-bold text-lg mb-3 leading-snug">{f.title}</h3>
                <p className={`text-sm leading-relaxed transition-colors duration-300 ${isActive ? "text-white/70" : "text-black/55"}`}>
                  {f.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   CTA banner
--------------------------------------------------------- */
function CTABanner() {
  return (
    <section className="px-6 pb-28">
      <div className="max-w-5xl mx-auto bg-[#D7FF3D] border-2 border-black rounded-[32px] p-12 sm:p-16 text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-2 border-black/10" />
        <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full border-2 border-black/10" />
        <h2 className="font-display font-bold text-3xl sm:text-[42px] leading-tight mb-5 relative z-10">
          Ready to trace a wallet?
        </h2>
        <p className="text-black/70 mb-9 max-w-md mx-auto relative z-10">
          File a complaint or run a quick scan — the investigation engine is live and running on real BSC data.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-black text-white rounded-full pl-2 pr-5 py-2.5 font-bold text-sm border-2 border-black relative z-10 hover:-translate-y-0.5 transition-transform"
        >
          <span className="w-7 h-7 rounded-full bg-[#D7FF3D] flex items-center justify-center">
            <ArrowRight size={14} strokeWidth={2.5} className="text-black" />
          </span>
          Get Started
        </Link>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   Footer — structure only, details intentionally placeholder
--------------------------------------------------------- */
function Footer() {
  const cols = [
    { title: "Product", links: ["Dashboard", "New complaint", "Case registry", "Wallet scanner"] },
    { title: "Research", links: ["How it works", "Methodology", "Data sources"] },
    { title: "Team", links: ["About", "Contact"] },
  ];

  return (
    <footer className="bg-[#0B0C0F] text-white px-6 pt-20 pb-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#D7FF3D] flex items-center justify-center">
                <span className="text-black font-display font-bold text-xs">Dt</span>
              </div>
              <span className="font-display font-bold text-lg">DhanTrace</span>
            </div>
            <p className="text-sm text-white/45 max-w-xs leading-relaxed">
              Automated blockchain fraud investigation, built for SIH 2026. Details on this page
              are placeholders pending final submission.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:border-[#D7FF3D] hover:text-[#D7FF3D] transition-colors">
                <Globe size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:border-[#D7FF3D] hover:text-[#D7FF3D] transition-colors">
                <MessageCircle size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:border-[#D7FF3D] hover:text-[#D7FF3D] transition-colors">
                <Mail size={14} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-10">
            {cols.map((c) => (
              <div key={c.title}>
                <div className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">{c.title}</div>
                <ul className="space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-sm text-white/65 hover:text-[#D7FF3D] transition-colors">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-xs text-white/35">
          Prototype built for Smart India Hackathon 2026 — not a certified or deployed government system.
        </div>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------
   Page
--------------------------------------------------------- */
export default function LandingPage() {
  return (
    <div className="font-sans">
      <FloatingNav />
      <Hero />
      <ResearchSection />
      <HowItWorks />
      <FeatureToggles />
      <CTABanner />
      <Footer />
    </div>
  );
}
