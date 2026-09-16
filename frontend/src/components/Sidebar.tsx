"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/report/new", label: "New complaint" },
  { href: "/cases", label: "Case registry" },
  { href: "/wallets", label: "Wallet scanner" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="p-7 flex flex-col">
      <div className="flex items-center gap-3 pb-6 px-2">
        <div className="w-[38px] h-[38px] rounded-xl bg-gradient-to-br from-violet to-violetDeep shadow-[0_6px_14px_rgba(108,92,231,0.4)] flex items-center justify-center text-white font-extrabold">
          Dt
        </div>
        <div>
          <h1 className="text-[15.5px] font-extrabold leading-none">DhanTrace</h1>
          <p className="text-[11.5px] text-inkFaint mt-1">SIH Prototype · Fraud Tracing</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {links.map((l) => {
          const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                active ? "bg-surface text-violetDeep shadow-clay" : "text-inkSoft hover:bg-surfaceTint hover:text-ink"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-violet" : "bg-inkFaint"}`} />
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 bg-surface rounded-md2 shadow-clay text-xs text-inkSoft">
        <strong className="block text-ink text-[13.5px] mb-0.5">Investigating officer</strong>
        Demo session · not authenticated
      </div>
    </aside>
  );
}