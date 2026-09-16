import { getCaseDetail } from "@/lib/api";
import InvestigationPanel from "@/components/InvestigationPanel";
import Link from "next/link";

export default async function CaseDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let data;
  let loadError = "";
  try {
    data = await getCaseDetail(parseInt(id));
  } catch (e: any) {
    loadError = e.message;
  }

  if (loadError || !data) {
    return <div className="bg-surface rounded-lg2 shadow-clay p-8 text-center text-inkFaint">Could not load case ({loadError})</div>;
  }

  const report = data.victim_reports?.[0];
  const latestInv = data.investigations?.[0];

  return (
    <div>
      <Link href="/cases" className="inline-flex items-center gap-1.5 text-violetDeep font-bold text-sm mb-4">
        ← Back to case registry
      </Link>
      <div className="mb-7">
        <h2 className="text-2xl font-extrabold mb-1.5 tracking-tight">{data.case.title}</h2>
        <p className="text-inkSoft text-sm">
          Case #{data.case.id} · Status: {data.case.status} · Opened {new Date(data.case.created_at).toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-[1.3fr_1fr] gap-5 items-start">
        <div className="bg-surface rounded-lg2 shadow-clay p-6.5">
          <div className="text-xs font-extrabold text-inkSoft uppercase tracking-wide mb-4">Risk assessment</div>
          <InvestigationPanel investigation={latestInv?.findings ?? null} />
        </div>

        <div className="bg-surface rounded-lg2 shadow-clay p-6.5">
          <div className="text-xs font-extrabold text-inkSoft uppercase tracking-wide mb-4">Victim report</div>
          {report ? (
            <div className="space-y-3.5">
              <div>
                <div className="text-[11.5px] text-inkFaint mb-0.5">Victim name</div>
                <div className="font-bold text-sm">{report.victim_name || "Not provided"}</div>
              </div>
              <div>
                <div className="text-[11.5px] text-inkFaint mb-0.5">Contact</div>
                <div className="font-bold text-sm">{report.contact || "Not provided"}</div>
              </div>
              <div>
                <div className="text-[11.5px] text-inkFaint mb-0.5">Amount lost</div>
                <div className="font-bold text-sm">
                  {report.amount_lost ? "₹" + Number(report.amount_lost).toLocaleString("en-IN") : "Not provided"}
                </div>
              </div>
              <div>
                <div className="text-[11.5px] text-inkFaint mb-0.5">Reported wallet</div>
                <div className="font-mono text-xs font-semibold break-all">{report.reported_wallet}</div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-inkFaint">No report data.</div>
          )}
        </div>
      </div>
    </div>
  );
}