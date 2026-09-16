import { shortAddr } from "@/lib/api";

export default function WalletBadge({
  address,
  label,
  type,
}: {
  address: string;
  label?: string | null;
  type: "scam" | "exchange";
}) {
  const styles = type === "scam" ? "bg-coralPale text-[#C43C3E]" : "bg-mintPale text-[#1D8F68]";
  return (
    <span className={`inline-flex items-center gap-1 font-mono text-xs px-2.5 py-1 rounded-lg mr-1.5 mb-1.5 ${styles}`}>
      {type.toUpperCase()} · {label ? label : shortAddr(address)}
    </span>
  );
}