import Link from "next/link";
import { notFound } from "next/navigation";
import { getMission, MISSION_TYPE_LABEL } from "@/lib/content/missions";
import { MissionWorkspace } from "@/components/MissionWorkspace";

export default function MissionDetailPage({ params }: { params: { id: string } }) {
  const mission = getMission(params.id);
  if (!mission) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/missions" className="text-xs text-indigo-600">
        ← 미션 목록
      </Link>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded bg-slate-100 px-2 py-0.5 font-semibold">{MISSION_TYPE_LABEL[mission.type]}</span>
        <span className="rounded bg-slate-100 px-2 py-0.5">~{mission.estimatedMinutes}분</span>
      </div>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">{mission.title}</h1>
      <p className="mt-2 text-sm text-slate-600">{mission.description}</p>
      <div className="mt-8">
        <MissionWorkspace mission={mission} />
      </div>
    </div>
  );
}
