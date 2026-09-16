import WalletBadge from "./WalletBadge";
import { WalletFlag } from "@/lib/api";

export default function FlaggedWallets({ scam, exchange }: { scam: WalletFlag[]; exchange: WalletFlag[] }) {
  if (scam.length === 0 && exchange.length === 0) return null;
  return (
    <div className="mt-4">
      <div className="text-xs font-extrabold text-inkSoft uppercase tracking-wide mb-3">
        Flagged wallets in trace
      </div>
      {scam.map((w) => (
        <WalletBadge key={w.address} address={w.address} label={w.label} type="scam" />
      ))}
      {exchange.map((w) => (
        <WalletBadge key={w.address} address={w.address} label={w.label} type="exchange" />
      ))}
    </div>
  );
}