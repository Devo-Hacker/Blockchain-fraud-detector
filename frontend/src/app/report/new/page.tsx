"use client";

import { useState } from "react";
import { submitReport, Investigation } from "@/lib/api";
import InvestigationPanel from "@/components/InvestigationPanel";
import Link from "next/link";

export default function NewReport() {
  const [wallet, setWallet] = useState("0xf1618ea0c0f2204c1aecfabfa2b3dc5fe063d733");
  const [victimName, setVictimName] = useState("");
  const [contact, setContact] = useState("");
  const [amountLost, setAmountLost] = useState("");
  const [caseTitle, setCaseTitle] = useState("");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);
  const [result, setResult] = useState<{ case_id: number; report_id: number; investigation: Investigation } | null>(null);

  async function handleSubmit() {
    if (!wallet.trim()) {
      setStatus("Enter a wallet address first.");
      setError(true);
      return;
    }
    setLoading(true);
    setError(false);
    setResult(null);
    setStatus("Fetching on-chain activity and running investigation…");

    try {
      const data = await submitReport({
        reported_wallet: wallet.trim(),
        victim_name: victimName || null,
        contact: contact || null,
        amount_lost: amountLost || null,
        case_title: caseTitle || null,
      });
      setResult(data);
      setStatus("Done.");
    } catch (e: any) {
      setStatus("Error: " + e.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-7">
        <h2 className="text-2xl font-extrabold mb-1.5 tracking-tight">File a victim complaint</h2>
        <p className="text-inkSoft text-sm max-w-lg">
          Enter the wallet the victim sent funds to — not the victim&apos;s own wallet. Submitting runs a live trace against BNB Smart Chain.
        </p>
      </div>

      <div className="grid grid-cols-[1.3fr_1fr] gap-5 items-start">
        <div className="bg-surface rounded-lg2 shadow-clay p-6.5">
          <div className="text-xs font-extrabold text-inkSoft uppercase tracking-wide mb-4">Complaint details</div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-1.5">Scammer&apos;s wallet address</label>
            <input
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="w-full bg-surfaceTint rounded-xl px-3.5 py-3 font-mono text-sm border border-transparent focus:border-violet focus:bg-surface outline-none"
              placeholder="0x..."
            />
            <div className="text-xs text-inkFaint mt-1.5">The destination address the victim transferred crypto to.</div>
          </div>

          <div className="grid grid-cols-2 gap-3.5 mb-4">
            <div>
              <label className="block text-sm font-bold mb-1.5">Victim name</label>
              <input value={victimName} onChange={(e) => setVictimName(e.target.value)} className="w-full bg-surfaceTint rounded-xl px-3.5 py-3 text-sm border border-transparent focus:border-violet focus:bg-surface outline-none" placeholder="Optional" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">Contact</label>
              <input value={contact} onChange={(e) => setContact(e.target.value)} className="w-full bg-surfaceTint rounded-xl px-3.5 py-3 text-sm border border-transparent focus:border-violet focus:bg-surface outline-none" placeholder="Optional" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5 mb-5">
            <div>
              <label className="block text-sm font-bold mb-1.5">Amount lost (INR)</label>
              <input value={amountLost} onChange={(e) => setAmountLost(e.target.value)} type="number" className="w-full bg-surfaceTint rounded-xl px-3.5 py-3 text-sm border border-transparent focus:border-violet focus:bg-surface outline-none" placeholder="Optional" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">Case title</label>
              <input value={caseTitle} onChange={(e) => setCaseTitle(e.target.value)} className="w-full bg-surfaceTint rounded-xl px-3.5 py-3 text-sm border border-transparent focus:border-violet focus:bg-surface outline-none" placeholder="Optional" />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-br from-violet to-violetDeep text-white font-bold text-sm py-3.5 rounded-xl shadow-[0_10px_24px_rgba(108,92,231,0.32)] disabled:opacity-50"
          >
            {loading ? "Investigating…" : "Investigate wallet"}
          </button>
          <div className={`text-xs mt-3 min-h-[16px] ${error ? "text-coral font-semibold" : "text-inkFaint"}`}>{status}</div>
        </div>

        {result && (
          <div className="bg-surface rounded-lg2 shadow-clay p-6.5">
            <div className="text-xs font-extrabold text-inkSoft uppercase tracking-wide mb-4">Result</div>
            <div className="text-xs text-inkFaint mb-3.5">Case #{result.case_id} · Report #{result.report_id}</div>
            <InvestigationPanel investigation={result.investigation} />
            <Link href={`/cases/${result.case_id}`} className="block text-center mt-4.5 bg-surfaceTint text-ink font-bold text-sm py-3 rounded-xl">
              View full case
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}