"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const MCQ = [
  { id: "1", q: "PASS의 의미로 가장 적절한 것은?", choices: ["결함 있음", "정상 동작", "검증 제외", "검증 불가"], ok: 1 },
  { id: "2", q: "BLOCK은?", choices: ["상위 결함으로 하위 검증 불가", "테스트 안 함", "스킵", "통과"], ok: 0 },
  { id: "3", q: "Trivial에 가까운 것은?", choices: ["데이터 손실", "오탈자", "결제 실패", "로그인 불가"], ok: 1 },
];

export default function SqatExamPage() {
  const [sec, setSec] = useState(60 * 60);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => MCQ.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => setSec((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [submitted]);

  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");

  const q = MCQ[idx];

  function submitAll() {
    setSubmitted(true);
    const mcqScore = MCQ.reduce((acc, m, i) => acc + (answers[i] === m.ok ? 1 : 0), 0);
    sessionStorage.setItem(
      "sqat-exam-result",
      JSON.stringify({
        mcqScore,
        mcqTotal: MCQ.length,
        practical: "grading",
        at: Date.now(),
      })
    );
  }

  const nav = useMemo(
    () =>
      MCQ.map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => setIdx(i)}
          className={`h-8 w-8 rounded border text-xs font-bold ${
            answers[i] !== null ? "border-emerald-500 bg-emerald-100" : "border-slate-200 bg-white"
          } ${i === idx ? "ring-2 ring-indigo-500" : ""}`}
        >
          {i + 1}
        </button>
      )),
    [idx, answers]
  );

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-sm text-slate-600">제출되었습니다. 결과 화면으로 이동합니다.</p>
        <Link href="/sqat/result" className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white">
          결과 보기
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-24">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <span className="text-sm font-bold text-slate-900">SQAT 시험 (데모)</span>
          <span className="font-mono text-lg font-black text-indigo-600">
            {mm}:{ss}
          </span>
          <Link href="/sqat" className="text-xs text-slate-500 hover:underline">
            안내
          </Link>
        </div>
      </header>
      <div className="mx-auto grid max-w-4xl gap-6 px-4 py-8 lg:grid-cols-[200px_1fr]">
        <aside className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-bold uppercase text-slate-500">문항</p>
          <div className="mt-3 flex flex-wrap gap-2">{nav}</div>
          <p className="mt-4 text-xs text-slate-500">실기(Markdown) 영역은 Phase 2에서 에디터와 연동됩니다.</p>
        </aside>
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs text-slate-500">객관식 {idx + 1} / {MCQ.length}</p>
          <h2 className="mt-2 text-lg font-bold text-slate-900">{q.q}</h2>
          <ul className="mt-4 space-y-2">
            {q.choices.map((c, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => {
                    const next = [...answers];
                    next[idx] = i;
                    setAnswers(next);
                  }}
                  className={`w-full rounded-lg border px-4 py-3 text-left text-sm ${
                    answers[idx] === i ? "border-indigo-600 bg-indigo-50" : "border-slate-200"
                  }`}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
          <textarea
            className="mt-8 w-full rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-500"
            rows={6}
            placeholder="실기 답안 (Markdown 에디터 자리 — @uiw/react-md-editor 차후)"
            disabled
          />
          <button
            type="button"
            disabled={answers.some((a) => a === null)}
            onClick={submitAll}
            className="mt-6 w-full rounded-lg bg-slate-900 py-3 text-sm font-bold text-white disabled:opacity-40"
          >
            전체 제출
          </button>
        </section>
      </div>
    </div>
  );
}
