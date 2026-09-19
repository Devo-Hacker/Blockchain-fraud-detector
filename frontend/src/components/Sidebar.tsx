"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FilePlus2,
  FolderKanban,
  ScanLine,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ShieldCheck,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/report/new", label: "New complaint", icon: FilePlus2 },
  { href: "/cases", label: "Case registry", icon: FolderKanban },
  { href: "/wallets", label: "Wallet scanner", icon: ScanLine },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`sticky top-0 h-screen bg-[#111113] flex flex-col transition-all duration-300 z-30 ${
        collapsed ? "w-20 px-3" : "w-64 px-5"
      } py-6`}
    >
      {/* Logo row */}
      <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} mb-9`}>
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-violet flex items-center justify-center flex-shrink-0">
            <span className="text-white font-extrabold text-sm">Dt</span>
          </div>
          {!collapsed && (
            <span className="text-white font-extrabold text-[17px] tracking-tight truncate">
              DhanTrace
            </span>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={onToggle}
            className="w-7 h-7 rounded-lg bg-white/5 text-white/50 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          onClick={onToggle}
          className="w-7 h-7 mx-auto mb-7 rounded-lg bg-white/5 text-white/50 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      )}

      {/* Nav */}
      {!collapsed && (
        <div className="text-[10.5px] font-bold uppercase tracking-widest text-white/30 mb-3 px-2">
          Navigation
        </div>
      )}
      <nav className="flex flex-col gap-1 mb-8">
        {links.map((l) => {
          const active = pathname === l.href || pathname.startsWith(l.href + "/");
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              title={collapsed ? l.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                collapsed ? "justify-center" : ""
              } ${
                active
                  ? "bg-violet text-white shadow-[0_4px_14px_rgba(108,92,231,0.4)]"
                  : "text-white/50 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} className="shrink-0" strokeWidth={2} />
              {!collapsed && <span className="truncate">{l.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Status card */}
      {!collapsed && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 mb-auto">
          <div className="flex items-center gap-2 mb-1.5">
            <ShieldCheck size={14} className="text-violet" />
            <span className="text-[11.5px] font-bold text-white">System status</span>
          </div>
          <p className="text-[11.5px] text-white/40 leading-relaxed">
            Live trace engine connected to BNB Smart Chain via Ankr.
          </p>
        </div>
      )}

      {/* Profile footer — placeholder, ready for real auth */}
      <div className={`mt-6 pt-4 border-t border-white/10 ${collapsed ? "flex justify-center" : ""}`}>
        <div className={`flex items-center gap-2.5 ${collapsed ? "" : "px-1"}`}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet to-violetDeep flex items-center justify-center flex-shrink-0 text-white font-bold text-xs">
            IO
          </div>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <div className="text-white text-[13px] font-bold truncate">Investigating Officer</div>
                <div className="text-white/35 text-[11px] truncate">Demo session · not authenticated</div>
              </div>
              <button className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0">
                <MoreHorizontal size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
