"use client";

import { useState } from "react";
import { investigateWallet, Investigation } from "@/lib/api";
import InvestigationPanel from "@/components/InvestigationPanel";

export default function WalletScanner() {
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);
  const [result, setResult] = useState<Investigation | null>(null);

  async function handleScan() {
    if (!wallet.trim()) {
      setStatus("Enter a wallet address first.");
      setError(true);
      return;
    }
    setLoading(true);
    setError(false);
    setResult(null);
    setStatus("Running trace against existing transaction data…");

    try {
      const data = await investigateWallet(wallet.trim());
      setResult(data);
      setStatus("Done. (Reading from already-fetched data — use 'New complaint' to pull fresh on-chain history for an unseen wallet.)");
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
        <h2 className="text-2xl font-extrabold mb-1.5 tracking-tight">Quick wallet scanner</h2>
        <p className="text-inkSoft text-sm max-w-lg">
          Check any BSC wallet&apos;s risk profile without filing a formal complaint.
        </p>
      </div>

      <div className="bg-surface rounded-lg2 shadow-clay p-6.5 mb-5">
        <div className="mb-3.5">
          <label className="block text-sm font-bold mb-1.5">Wallet address</label>
          <input
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            className="w-full bg-surfaceTint rounded-xl px-3.5 py-3 font-mono text-sm border border-transparent focus:border-violet focus:bg-surface outline-none"
            placeholder="0x..."
          />
        </div>
        <button
          onClick={handleScan}
          disabled={loading}
          className="bg-gradient-to-br from-violet to-violetDeep text-white font-bold text-sm px-6 py-3 rounded-xl shadow-[0_10px_24px_rgba(108,92,231,0.32)] disabled:opacity-50"
        >
          {loading ? "Scanning…" : "Scan wallet"}
        </button>
        <div className={`text-xs mt-3 min-h-[16px] ${error ? "text-coral font-semibold" : "text-inkFaint"}`}>{status}</div>
      </div>

      {result && (
        <div className="bg-surface rounded-lg2 shadow-clay p-6.5">
          <InvestigationPanel investigation={result} />
        </div>
      )}
    </div>
  );
}