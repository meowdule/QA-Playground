"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AiScoringPlaceholder } from "@/components/AiScoringPlaceholder";
import type { Mission } from "@/lib/types";

export function MissionSubmitResult({ mission }: { mission: Mission }) {
  const [raw, setRaw] = useState<string | null>(null);

  useEffect(() => {
    setRaw(sessionStorage.getItem(`sqat-submit-${mission.id}`));
  }, [mission.id]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">제출 완료</h1>
      <p className="mt-2 text-sm text-slate-600">
        미션: <strong>{mission.title}</strong>
      </p>
      {mission.isDescriptive && <AiScoringPlaceholder />}
      {!mission.isDescriptive && (
        <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          시나리오 미션은 로컬 세션에 완료 표시가 저장되었습니다. (데모)
        </p>
      )}
      {raw && (
        <pre className="mt-6 max-h-64 overflow-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
          {raw}
        </pre>
      )}
      <div className="mt-8 flex gap-3">
        <Link href="/missions" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium">
          미션 목록
        </Link>
        <Link href={`/missions/${mission.id}`} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
          다시 보기
        </Link>
      </div>
    </div>
  );
}
