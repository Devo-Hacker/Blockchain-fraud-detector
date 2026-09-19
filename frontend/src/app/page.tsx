"use client";

import { useState, useEffect, useRef } from "react";
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
  Boxes,
  Server,
  Cpu,
  Database,
  Coins,
  CheckCircle2,
  XCircle,
  Code2,
  PenTool,
  Compass,
  BarChart3,
  TrendingUp,
} from "lucide-react";

/* ---------------------------------------------------------
   Scroll-reveal helpers
--------------------------------------------------------- */
function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, value]);

  const formatted = decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString("en-IN");

  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

/* ---------------------------------------------------------
   Global keyframes for decorative animation
--------------------------------------------------------- */
function GlobalAnim() {
  return (
    <style>{`
      @keyframes dt-dash { to { stroke-dashoffset: -24; } }
      @keyframes dt-pulse { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.25); } }
      @keyframes dt-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      .dt-dash { stroke-dasharray: 6 6; animation: dt-dash 1.2s linear infinite; }
      .dt-pulse { animation: dt-pulse 2.2s ease-in-out infinite; transform-origin: center; }
      .dt-float { animation: dt-float 5s ease-in-out infinite; }
    `}</style>
  );
}

/* ---------------------------------------------------------
   Spreading patches — hero-only ambient motion.
--------------------------------------------------------- */
function SpreadingPatches() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="dt-patch dt-patch-a" />
      <div className="dt-patch dt-patch-b" />
      <div className="dt-patch dt-patch-c" />
      <style>{`
        .dt-patch {
          position: absolute;
          border-radius: 9999px;
          filter: blur(70px);
          mix-blend-mode: multiply;
          opacity: 0.4;
          animation: dt-spread 11s ease-in-out infinite;
        }
        .dt-patch-a {
          width: 440px; height: 440px;
          top: -160px; left: -100px;
          background: #FF3EC8;
          animation-delay: 0s;
        }
        .dt-patch-b {
          width: 380px; height: 380px;
          top: 20px; right: -120px;
          background: #6C5CE7;
          animation-delay: 2.6s;
        }
        .dt-patch-c {
          width: 320px; height: 320px;
          bottom: -180px; left: 32%;
          background: #FF9EDB;
          animation-delay: 5.2s;
        }
        @keyframes dt-spread {
          0%, 100% { transform: scale(0.85) translate(0, 0); opacity: 0.28; }
          50% { transform: scale(1.2) translate(14px, -18px); opacity: 0.5; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dt-patch { animation: none; }
        }
      `}</style>
    </div>
  );
}

/* ---------------------------------------------------------
   Floating pill nav
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
            <span className="text-[#FF3EC8] font-display font-bold text-xs">Dt</span>
          </div>
          <span className="font-display font-bold text-[15px] tracking-tight">DhanTrace</span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-black/70">
          <a href="#how-it-works" className="hover:text-black transition-colors">How it works</a>
          <a href="#research" className="hover:text-black transition-colors">Research</a>
          <a href="#features" className="hover:text-black transition-colors">Features</a>
          <a href="#team" className="hover:text-black transition-colors">Team</a>
        </div>

        <Link
          href="/dashboard"
          className="flex items-center gap-2 bg-black text-white rounded-full pl-4 pr-1.5 py-1.5 text-sm font-bold border-2 border-black hover:-translate-y-0.5 transition-transform"
        >
          Get Started
          <span className="w-6 h-6 rounded-full bg-[#6C5CE7] flex items-center justify-center">
            <ArrowRight size={12} strokeWidth={2.5} className="text-white" />
          </span>
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
    <section className="relative bg-[#F5F4EF] pt-44 pb-24 px-6 overflow-hidden">
      <SpreadingPatches />

      <svg className="absolute top-24 right-0 w-[520px] h-[420px] opacity-[0.35] pointer-events-none hidden lg:block" viewBox="0 0 520 420" fill="none">
        <circle cx="420" cy="60" r="5" fill="#FF3EC8" stroke="#000" strokeWidth="2" className="dt-pulse" />
        <circle cx="300" cy="150" r="4" fill="#000" />
        <circle cx="460" cy="220" r="6" fill="#000" />
        <circle cx="360" cy="320" r="4" fill="#FF3EC8" stroke="#000" strokeWidth="2" className="dt-pulse" style={{ animationDelay: "0.8s" }} />
        <circle cx="200" cy="260" r="4" fill="#000" />
        <path d="M420 60 L300 150 L460 220 L360 320 M300 150 L200 260" stroke="#000" strokeWidth="1.5" className="dt-dash" />
      </svg>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <Reveal>
          <div className="inline-flex items-center gap-2 bg-white border-2 border-black rounded-full px-3.5 py-1.5 text-xs font-bold mb-8 shadow-[2px_2px_0_0_#000]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3EC8] border border-black" />
            Built for Smart India Hackathon 2026
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="font-display font-bold text-[42px] sm:text-[56px] md:text-[68px] leading-[1.05] tracking-tight mb-6">
            Every crypto scam
            <br />
            leaves a <span className="bg-[#FF3EC8] px-2 border-2 border-black inline-block -rotate-1">public trail.</span>
            <br />
            We follow it.
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="text-lg text-black/65 max-w-xl mx-auto mb-10 leading-relaxed">
            DhanTrace turns a single victim-reported wallet address into a fully traced,
            risk-scored investigation — automatically, in seconds, on BNB Smart Chain.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 bg-black text-white rounded-full pl-2 pr-5 py-2 font-bold text-sm border-2 border-black shadow-[3px_3px_0_0_#6C5CE7] hover:shadow-[5px_5px_0_0_#6C5CE7] hover:-translate-y-0.5 transition-all"
            >
              <span className="w-7 h-7 rounded-full bg-[#6C5CE7] flex items-center justify-center">
                <ArrowRight size={14} strokeWidth={2.5} className="text-white" />
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
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   Tech stack strip — honest, no fabricated logos/partners
--------------------------------------------------------- */
function TechStack() {
  const stack = [
    { icon: Boxes, label: "Next.js" },
    { icon: Server, label: "Node / Express" },
    { icon: Cpu, label: "Python / FastAPI" },
    { icon: Database, label: "PostgreSQL" },
    { icon: Coins, label: "BNB Smart Chain" },
    { icon: Network, label: "Ankr API" },
  ];

  return (
    <section className="bg-[#F5F4EF] px-6 pb-20">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center text-xs font-bold uppercase tracking-widest text-black/35 mb-6">
            Built on real, working infrastructure
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {stack.map((t) => (
              <div
                key={t.label}
                className="flex items-center gap-2 bg-white border-2 border-black rounded-full px-4 py-2 text-sm font-bold shadow-[2px_2px_0_0_#000]"
              >
                <t.icon size={15} strokeWidth={2} />
                {t.label}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   Research / problem section — real, sourced stats
--------------------------------------------------------- */
function ResearchSection() {
  const stats = [
    { value: 22495, prefix: "₹", suffix: " Cr", label: "Lost to cyber fraud in India in 2025 alone" },
    { value: 75, suffix: "%+", label: "Of those losses came from investment scams — the category crypto fraud falls under" },
    { value: 2.81, suffix: "M", decimals: 2, label: "Complaints reported in 2025, up 24% from 2024" },
    { value: 55484, label: "Of those complaints actually became a registered FIR" },
  ];

  return (
    <section id="research" className="bg-[#0B0C0F] text-white px-6 py-28">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle size={16} className="text-[#6C5CE7]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#6C5CE7]">
              The problem, in numbers
            </span>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-[44px] leading-tight mb-6 max-w-3xl">
            India&apos;s cyber fraud problem is accelerating faster than the system built to catch it.
          </h2>
        </Reveal>

        <Reveal delay={140}>
          <p className="text-white/55 max-w-2xl mb-16 leading-relaxed">
            These figures are drawn from Ministry of Home Affairs data and I4C reporting, as covered
            by The Print and MoneyLife (Dec 2025–Feb 2026) — not internal estimates.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden mb-16">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="bg-[#0B0C0F] p-7 h-full">
                <div className="font-display font-bold text-3xl sm:text-4xl text-[#6C5CE7] mb-2">
                  <AnimatedCounter value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
                </div>
                <div className="text-sm text-white/60 leading-snug">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="bg-white/5 border-2 border-[#6C5CE7]/30 rounded-2xl p-7 flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-[#6C5CE7] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Link2 size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <p className="text-white/80 leading-relaxed">
              <strong className="text-white">The gap between 2.81M complaints and 55,484 FIRs</strong> is largely
              jurisdictional — cases filed in different cities rarely get cross-checked against each other, even
              when they trace back to the same wallet cluster. That&apos;s the specific gap DhanTrace is built to close.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   Animated fund-flow demo — illustrative, clearly labeled
--------------------------------------------------------- */
function VisualTraceDemo() {
  const nodes = [
    { x: 60, y: 140, label: "Victim", color: "#fff", ring: "#000" },
    { x: 220, y: 60, label: "Scam wallet", color: "#E5595B", ring: "#000" },
    { x: 400, y: 30, label: "Layer 1", color: "#D9D5EF", ring: "#000" },
    { x: 400, y: 150, label: "Layer 2", color: "#D9D5EF", ring: "#000" },
    { x: 580, y: 90, label: "Exchange", color: "#2FBF8F", ring: "#000" },
  ];
  const edges = [
    [0, 1],
    [1, 2],
    [1, 3],
    [2, 4],
    [3, 4],
  ];

  return (
    <section className="bg-[#F5F4EF] px-6 pb-28">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-2 mb-4">
            <GitBranch size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">See the trace</span>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display font-bold text-3xl sm:text-[40px] leading-tight mb-3 max-w-2xl">
            One reported wallet becomes a full picture of where the money went.
          </h2>
          <p className="text-black/55 max-w-xl mb-12">
            Illustrative example — the real graph is generated live from actual BNB Smart Chain data for whatever wallet is investigated.
          </p>
        </Reveal>

        <Reveal delay={160}>
          <div className="bg-white border-2 border-black rounded-[28px] p-8 shadow-[4px_4px_0_0_#000] overflow-x-auto">
            <svg viewBox="0 0 640 220" className="w-full min-w-[560px] h-auto">
              {edges.map(([a, b], i) => {
                const n1 = nodes[a];
                const n2 = nodes[b];
                return (
                  <line
                    key={i}
                    x1={n1.x}
                    y1={n1.y}
                    x2={n2.x}
                    y2={n2.y}
                    stroke="#C3BCEA"
                    strokeWidth={2.5}
                    className="dt-dash"
                  />
                );
              })}
              {nodes.map((n, i) => (
                <g key={i}>
                  <circle cx={n.x} cy={n.y} r={i === 4 ? 22 : 16} fill={n.color} stroke={n.ring} strokeWidth={2.5} />
                  <text
                    x={n.x}
                    y={n.y + (i === 4 ? 42 : 34)}
                    textAnchor="middle"
                    className="font-sans"
                    fontSize="12"
                    fontWeight={700}
                    fill="#2B2745"
                  >
                    {n.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </Reveal>
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
        <Reveal>
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">How it works</span>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display font-bold text-3xl sm:text-[40px] leading-tight mb-16 max-w-2xl">
            From complaint to case file, without the manual legwork.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <Reveal key={i} delay={i * 100} className="relative">
              <div className="bg-white border-2 border-black rounded-2xl p-6 h-full shadow-[3px_3px_0_0_#000]">
                <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center mb-5">
                  <s.icon size={20} className="text-[#6C5CE7]" strokeWidth={2} />
                </div>
                <div className="text-xs font-bold text-black/40 mb-1.5">STEP {i + 1}</div>
                <h3 className="font-display font-bold text-lg mb-2.5 leading-snug">{s.title}</h3>
                <p className="text-sm text-black/60 leading-relaxed">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <ChevronRight size={20} className="hidden md:block absolute top-1/2 -right-6 -translate-y-1/2 text-black/25" />
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   Feature toggle cards
--------------------------------------------------------- */
function FeatureToggles() {
  const features = [
    { icon: Network, title: "Automated fund tracing", desc: "Multi-hop tracing across the fund-flow graph runs in seconds instead of hours of manual block-explorer clicking." },
    { icon: ShieldAlert, title: "Explainable risk scoring", desc: "Every point in the score is attributed to a named signal — known scam links, exchange exposure, layering — never a black box." },
    { icon: Landmark, title: "Entity intelligence", desc: "Wallets are checked against known scam, mixer, bridge, and exchange address sets, sourced from real on-chain intelligence." },
    { icon: Users, title: "Cross-case correlation", desc: "Separate victim complaints that trace to the same wallet cluster get flagged as connected — even across different police stations." },
  ];

  const [active, setActive] = useState(0);

  return (
    <section id="features" className="bg-[#F5F4EF] px-6 pb-28">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-2 mb-4">
            <Search size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">What it does</span>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display font-bold text-3xl sm:text-[40px] leading-tight mb-16 max-w-2xl">
            Four things a human investigator would otherwise do by hand.
          </h2>
        </Reveal>

        <Reveal delay={140}>
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
                      isActive ? "bg-[#6C5CE7]" : "bg-black"
                    }`}
                  >
                    <f.icon size={20} className={isActive ? "text-white" : "text-[#6C5CE7]"} strokeWidth={2} />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-3 leading-snug">{f.title}</h3>
                  <p className={`text-sm leading-relaxed transition-colors duration-300 ${isActive ? "text-white/70" : "text-black/55"}`}>
                    {f.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   Before / after comparison — illustrative estimates, labeled
--------------------------------------------------------- */
function ComparisonSection() {
  const rows = [
    { label: "Wallet tracing", before: 15, after: 90 },
    { label: "Pattern identification", before: 25, after: 75 },
    { label: "Cross-case linking", before: 10, after: 80 },
    { label: "Evidence preparation", before: 30, after: 65 },
  ];

  const { ref, inView } = useInView<HTMLDivElement>(0.3);

  return (
    <section className="bg-[#0B0C0F] text-white px-6 py-28">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-[#6C5CE7]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#6C5CE7]">Manual vs. automated</span>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display font-bold text-3xl sm:text-[40px] leading-tight mb-14 max-w-xl">
            What a task looks like before and after this system exists.
          </h2>
        </Reveal>

        <div ref={ref} className="space-y-7 mb-8">
          {rows.map((r, i) => (
            <Reveal key={r.label} delay={i * 100}>
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span>{r.label}</span>
                </div>
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-[11px] w-12 text-white/40 font-mono">Before</span>
                  <div className="flex-1 h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#E5595B] rounded-full transition-all duration-1000 ease-out"
                      style={{ width: inView ? `${r.before}%` : "0%" }}
                    />
                  </div>
                  <span className="text-[11px] w-9 text-white/50 font-mono text-right">{r.before}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] w-12 text-white/40 font-mono">After</span>
                  <div className="flex-1 h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#6C5CE7] rounded-full transition-all duration-1000 ease-out"
                      style={{ width: inView ? `${r.after}%` : "0%", transitionDelay: "200ms" }}
                    />
                  </div>
                  <span className="text-[11px] w-9 text-[#6C5CE7] font-mono text-right font-bold">{r.after}%</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300}>
          <p className="text-xs text-white/35 leading-relaxed max-w-xl">
            Illustrative estimates based on typical manual investigation workflows, not a formal study.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   What this is / isn't — honest positioning
--------------------------------------------------------- */
function PositioningSection() {
  const is = [
    "A triage tool for the specific complaint pattern: one victim, one reported wallet",
    "Built for local cybercrime cells who don't have enterprise forensics access",
    "Explainable — every risk point traces back to a named reason",
    "A working prototype with real BSC data flowing through it, right now",
  ];
  const isnt = [
    "Not a Chainalysis or TRM Labs replacement — those are more powerful, for larger agencies",
    "Not a dark-web or multi-chain forensics suite — BNB Smart Chain only, for now",
    "Not certified or endorsed by any government body — a hackathon prototype",
    "Not a guarantee of identity — wallets are pseudonymous without off-chain data",
  ];

  return (
    <section className="bg-[#F5F4EF] px-6 py-28">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-2 mb-4">
            <Compass size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Honest positioning</span>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display font-bold text-3xl sm:text-[40px] leading-tight mb-14 max-w-2xl">
            What DhanTrace is — and just as importantly, what it isn&apos;t.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-5">
          <Reveal delay={140}>
            <div className="bg-white border-2 border-black rounded-2xl p-7 h-full shadow-[3px_3px_0_0_#000]">
              <div className="flex items-center gap-2 mb-5">
                <CheckCircle2 size={18} className="text-[#1D8F68]" />
                <span className="font-display font-bold text-lg">What this is</span>
              </div>
              <ul className="space-y-3.5">
                {is.map((t, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-black/70 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1D8F68] mt-1.5 flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={220}>
            <div className="bg-[#0B0C0F] text-white border-2 border-black rounded-2xl p-7 h-full shadow-[3px_3px_0_0_#FF3EC8]">
              <div className="flex items-center gap-2 mb-5">
                <XCircle size={18} className="text-[#E5595B]" />
                <span className="font-display font-bold text-lg">What this isn&apos;t</span>
              </div>
              <ul className="space-y-3.5">
                {isnt.map((t, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-white/65 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5595B] mt-1.5 flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   Team / roles — structural, no invented names
--------------------------------------------------------- */
function TeamSection() {
  const roles = [
    { icon: Code2, title: "Blockchain & Backend", desc: "Node/Express API, Ankr integration, PostgreSQL schema, the full data ingestion pipeline." },
    { icon: BarChart3, title: "Python Analytics", desc: "NetworkX graph construction, multi-hop tracing, and the explainable risk-scoring engine." },
    { icon: PenTool, title: "Frontend & Design", desc: "Next.js application, the case investigation UI, and the fund-flow graph visualization." },
    { icon: Compass, title: "Case Strategy & Research", desc: "Problem framing, entity data sourcing, and grounding the product in real investigative workflows." },
  ];

  return (
    <section id="team" className="bg-[#F5F4EF] px-6 pb-28">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">The team</span>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display font-bold text-3xl sm:text-[40px] leading-tight mb-14 max-w-2xl">
            Six people, four areas of ownership.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-4 gap-5">
          {roles.map((r, i) => (
            <Reveal key={r.title} delay={i * 100}>
              <div className="bg-white border-2 border-black rounded-2xl p-6 h-full shadow-[3px_3px_0_0_#000] hover:shadow-[5px_5px_0_0_#000] hover:-translate-y-1 transition-all">
                <div className="w-11 h-11 rounded-xl bg-[#FF3EC8] border-2 border-black flex items-center justify-center mb-5 dt-float" style={{ animationDelay: `${i * 0.4}s` }}>
                  <r.icon size={20} className="text-black" strokeWidth={2} />
                </div>
                <h3 className="font-display font-bold text-base mb-2.5 leading-snug">{r.title}</h3>
                <p className="text-sm text-black/60 leading-relaxed">{r.desc}</p>
              </div>
            </Reveal>
          ))}
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
      <Reveal>
        <div className="max-w-5xl mx-auto bg-[#FF3EC8] border-2 border-black rounded-[32px] p-12 sm:p-16 text-center relative overflow-hidden">
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
            <span className="w-7 h-7 rounded-full bg-[#FF3EC8] flex items-center justify-center">
              <ArrowRight size={14} strokeWidth={2.5} className="text-black" />
            </span>
            Get Started
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------------------------------------------------
   Footer
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
              <div className="w-8 h-8 rounded-full bg-[#FF3EC8] flex items-center justify-center">
                <span className="text-black font-display font-bold text-xs">Dt</span>
              </div>
              <span className="font-display font-bold text-lg">DhanTrace</span>
            </div>
            <p className="text-sm text-white/45 max-w-xs leading-relaxed">
              Automated blockchain fraud investigation, built for SIH 2026. Details on this page
              are placeholders pending final submission.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:border-[#6C5CE7] hover:text-[#6C5CE7] transition-colors">
                <Globe size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:border-[#6C5CE7] hover:text-[#6C5CE7] transition-colors">
                <MessageCircle size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:border-[#6C5CE7] hover:text-[#6C5CE7] transition-colors">
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
                      <a href="#" className="text-sm text-white/65 hover:text-[#6C5CE7] transition-colors">
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
      <GlobalAnim />
      <FloatingNav />
      <Hero />
      <TechStack />
      <ResearchSection />
      <VisualTraceDemo />
      <HowItWorks />
      <FeatureToggles />
      <ComparisonSection />
      <PositioningSection />
      <TeamSection />
      <CTABanner />
      <Footer />
    </div>
  );
}