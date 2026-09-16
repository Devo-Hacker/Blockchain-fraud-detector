import WalletBadge from "./WalletBadge";

export default function FlaggedWallets({ scam, exchange }: { scam: string[]; exchange: string[] }) {
  if (scam.length === 0 && exchange.length === 0) return null;
  return (
    <div className="mt-4">
      <div className="text-xs font-extrabold text-inkSoft uppercase tracking-wide mb-3">
        Flagged wallets in trace
      </div>
      {scam.map((a) => <WalletBadge key={a} address={a} type="scam" />)}
      {exchange.map((a) => <WalletBadge key={a} address={a} type="exchange" />)}
    </div>
  );
}