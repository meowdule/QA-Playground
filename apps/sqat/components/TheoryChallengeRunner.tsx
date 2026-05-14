"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Challenge } from "@/lib/types";

export function TheoryChallengeRunner({ challenge }: { challenge: Challenge }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = challenge.questions[idx];
  const total = challenge.questions.length;

  const correct = useMemo(() => picked === q?.correctIndex, [picked, q]);

  function next() {
    if (picked === null) return;
    if (correct) setScore((s) => s + 1);
    if (idx + 1 >= total) {
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
    setPicked(null);
  }

  if (done) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-bold">채점 완료</h2>
        <p className="mt-2 text-3xl font-black text-indigo-600">
          {score} / {total}
        </p>
        <p className="mt-2 text-sm text-slate-600">이론 챌린지는 브라우저에서 즉시 채점됩니다.</p>
        <Link href="/challenges" className="mt-6 inline-block rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white">
          목록으로
        </Link>
      </div>
    );
  }

  if (!q) return <p>문항이 없습니다.</p>;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex justify-between text-xs text-slate-500">
        <span>
          문항 {idx + 1} / {total}
        </span>
        <span>누적 정답: {score}</span>
      </div>
      <p className="text-base font-medium text-slate-900">{q.prompt}</p>
      <ul className="mt-4 space-y-2">
        {q.choices.map((c, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => setPicked(i)}
              className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition ${
                picked === i ? "border-indigo-600 bg-indigo-50" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {c}
            </button>
          </li>
        ))}
      </ul>
      {picked !== null && (
        <p className={`mt-3 text-sm font-semibold ${correct ? "text-emerald-700" : "text-rose-700"}`}>
          {correct ? "정답입니다." : "오답입니다."}
        </p>
      )}
      <button
        type="button"
        disabled={picked === null}
        onClick={next}
        className="mt-6 w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white disabled:opacity-40"
      >
        {idx + 1 >= total ? "결과 보기" : "다음 문항"}
      </button>
    </div>
  );
}
