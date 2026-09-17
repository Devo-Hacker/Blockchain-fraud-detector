"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FilePlus2, FolderKanban, ScanLine, ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/report/new", label: "New complaint", icon: FilePlus2 },
  { href: "/cases", label: "Case registry", icon: FolderKanban },
  { href: "/wallets", label: "Wallet scanner", icon: ScanLine },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`sticky top-0 h-screen bg-[#0B0F17] border-r border-slate-800/80 p-5 flex flex-col transition-all duration-300 z-30 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Header / Branding */}
      <div className="flex items-center justify-between pb-6 px-1 border-b border-slate-800/60 mb-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="min-w-[38px] h-[38px] rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-900/30 flex items-center justify-center text-slate-950 font-black text-sm">
            SC
          </div>
          {!collapsed && (
            <div className="truncate">
              <h1 className="text-[15px] font-extrabold tracking-tight text-white">Smart-chain</h1>
              <p className="text-[11px] text-slate-400 font-medium">On-chain Risk &amp; Compliance</p>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-1.5 overflow-y-auto flex-1 pr-1 custom-scrollbar">
        {links.map((l) => {
          const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              title={collapsed ? l.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <Icon size={18} className={`shrink-0 ${active ? "text-emerald-400" : "text-slate-400"}`} />
              {!collapsed && <span className="truncate">{l.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer User Info */}
      {!collapsed && (
        <div className="mt-auto pt-4 border-t border-slate-800/60 p-3 bg-slate-900/50 rounded-xl border border-slate-800/80 text-xs text-slate-400">
          <strong className="block text-slate-200 text-[13px] mb-0.5">Investigating officer</strong>
          <span>Demo session · Active</span>
        </div>
      )}
    </aside>
  );
}