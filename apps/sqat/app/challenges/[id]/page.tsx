import Link from "next/link";
import { notFound } from "next/navigation";
import { getChallenge } from "@/lib/content/challenges";
import { TheoryChallengeRunner } from "@/components/TheoryChallengeRunner";

export default function ChallengePlayPage({ params }: { params: { id: string } }) {
  const ch = getChallenge(params.id);
  if (!ch) notFound();

  if (ch.category !== "theory") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-xl font-bold">{ch.title}</h1>
        <p className="mt-4 text-sm text-slate-600">
          TC·결함 실기 챌린지 및 모의고사는 Phase 2에서 AI 채점·타이머와 함께 제공됩니다.
        </p>
        <Link href="/challenges" className="mt-6 inline-block text-indigo-600">
          ← 목록
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/challenges" className="text-xs text-indigo-600">
        ← 챌린지
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">{ch.title}</h1>
      <p className="mt-1 text-sm text-slate-600">객관식 즉시 채점 (브라우저)</p>
      <div className="mt-8">
        <TheoryChallengeRunner challenge={ch} />
      </div>
    </div>
  );
}
