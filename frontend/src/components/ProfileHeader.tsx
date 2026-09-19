import { BadgeCheck } from "lucide-react";

export default function ProfileHeader() {
  return (
    <div className="relative rounded-lg2 overflow-hidden mb-6 border border-bgAlt">
      {/* decorative gradient backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 140% at 15% 0%, #6C5CE7 0%, #8E7CF5 35%, #F6C453 70%, #EFEDF9 100%)",
        }}
      />
      <div className="relative px-7 pt-8 pb-6 flex items-center gap-5">
        <div className="w-[72px] h-[72px] rounded-full bg-white/90 border-4 border-white flex items-center justify-center font-extrabold text-2xl text-violetDeep shadow-clay flex-shrink-0">
          IO
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-extrabold text-xl drop-shadow-sm">Investigating Officer</h3>
            <span className="inline-flex items-center gap-1 bg-white/90 text-violetDeep text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              <BadgeCheck size={12} /> Demo session
            </span>
          </div>
          <p className="text-white/85 text-sm font-medium">
            officer@department.gov.in · not authenticated yet
          </p>
        </div>
      </div>
    </div>
  );
}
