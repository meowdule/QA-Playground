import Link from "next/link";
import { MISSIONS, MISSION_TYPE_LABEL } from "@/lib/content/missions";
import type { MissionType } from "@/lib/types";

const TYPES: MissionType[] = [
  "scenario",
  "tc_writing",
  "report",
  "defect_report",
  "defect_classify",
  "defect_verify",
];

function diffKo(d: "easy" | "medium" | "hard") {
  if (d === "easy") return "쉬움";
  if (d === "hard") return "어려움";
  return "보통";
}

export default function MissionsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const t = typeof searchParams.type === "string" ? (searchParams.type as MissionType) : null;
  const list = t && TYPES.includes(t) ? MISSIONS.filter((m) => m.type === t) : MISSIONS;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">미션</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/missions" className={`rounded-full px-3 py-1 text-xs font-semibold ${!t ? "bg-slate-900 text-white" : "bg-slate-200"}`}>
          전체
        </Link>
        {TYPES.map((k) => (
          <Link
            key={k}
            href={`/missions?type=${k}`}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${t === k ? "bg-slate-900 text-white" : "bg-slate-200"}`}
          >
            {MISSION_TYPE_LABEL[k]}
          </Link>
        ))}
      </div>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {list.map((m) => (
          <li key={m.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded bg-slate-100 px-2 py-0.5 font-medium">{MISSION_TYPE_LABEL[m.type]}</span>
              <span className="rounded bg-amber-50 px-2 py-0.5 text-amber-900">{diffKo(m.difficulty)}</span>
              <span className="text-slate-500">~{m.estimatedMinutes}분</span>
              {m.isDescriptive && <span className="text-indigo-600">서술형</span>}
            </div>
            <h2 className="mt-2 text-base font-bold text-slate-900">
              <Link href={`/missions/${m.id}`} className="hover:text-indigo-700">
                {m.title}
              </Link>
            </h2>
            <p className="mt-2 line-clamp-2 text-sm text-slate-600">{m.description}</p>
            <div className="mt-3 text-xs text-slate-400">완료 여부: Phase 2 연동 예정</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
