export default function AICaseSummary({ narrative }: { narrative?: string | null }) {
  return (
    <div className="bg-violetPale/40 border border-violetPale rounded-md2 p-4.5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-extrabold text-violetDeep uppercase tracking-wide">AI case summary</span>
        <span className="text-[10px] font-bold text-violetDeep/70 bg-white px-1.5 py-0.5 rounded-full">Beta</span>
      </div>
      {narrative ? (
        <p className="text-sm leading-relaxed text-ink">{narrative}</p>
      ) : (
        <p className="text-sm text-inkFaint">
          AI summary unavailable for this case — check that GROQ_API_KEY is configured on the analytics service.
        </p>
      )}
    </div>
  );
}