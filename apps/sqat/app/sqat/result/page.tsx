"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AiScoringPlaceholder } from "@/components/AiScoringPlaceholder";

export default function SqatResultPage() {
  const [raw, setRaw] = useState<string | null>(null);

  useEffect(() => {
    setRaw(sessionStorage.getItem("sqat-exam-result"));
  }, []);

  const data = raw ? (JSON.parse(raw) as { mcqScore: number; mcqTotal: number; practical: string }) : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">시험 결과</h1>
      {data && (
        <p className="mt-4 text-sm text-slate-700">
          객관식 즉시 채점: <strong>{data.mcqScore}</strong> / {data.mcqTotal}
        </p>
      )}
      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        실기(AI 채점): <strong>채점 중</strong> (Phase 2 · Claude API)
      </div>
      <AiScoringPlaceholder />
      <p className="mt-6 text-xs text-slate-500">합격 시 자격증 PNG 다운로드는 Phase 2에서 구현 예정입니다.</p>
      <Link href="/sqat" className="mt-8 inline-block text-sm text-indigo-600">
        ← 자격 안내
      </Link>
    </div>
  );
}
