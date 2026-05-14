import Link from "next/link";
import { LEARNING_CONTENT } from "@/lib/content/learning";
import { MISSIONS } from "@/lib/content/missions";
import { CHALLENGES } from "@/lib/content/challenges";

export default function HomePage() {
  const missions = MISSIONS.slice(0, 3);
  const learn = LEARNING_CONTENT.slice(0, 2);
  const ch = CHALLENGES[0];
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="rounded-2xl bg-gradient-to-br from-indigo-600 to-slate-900 px-8 py-12 text-white shadow-xl">
        <h1 className="text-3xl font-black tracking-tight">SQAT</h1>
        <p className="mt-3 max-w-xl text-sm text-indigo-100">
          프로그래머스 스타일의 QA 전문 학습 — 학습 → 미션 → 챌린지 → 자격증(SQAT-Foundation / Professional)까지 한 흐름으로
          설계했습니다.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/learn" className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-indigo-900">
            학습 시작
          </Link>
          <Link href="/missions" className="rounded-lg border border-white/40 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
            미션
          </Link>
          <Link href="/challenges" className="rounded-lg border border-white/40 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
            챌린지
          </Link>
        </div>
      </section>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">최근 미션</h2>
          <ul className="mt-3 space-y-2">
            {missions.map((m) => (
              <li key={m.id}>
                <Link href={`/missions/${m.id}`} className="text-sm font-medium text-indigo-700 hover:underline">
                  {m.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/missions" className="mt-3 inline-block text-xs text-slate-500 hover:text-slate-800">
            전체 보기 →
          </Link>
        </section>
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">학습 아티클</h2>
          <ul className="mt-3 space-y-2">
            {learn.map((a) => (
              <li key={a.id}>
                <Link href={`/learn/${a.id}`} className="text-sm font-medium text-indigo-700 hover:underline">
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/learn" className="mt-3 inline-block text-xs text-slate-500 hover:text-slate-800">
            전체 보기 →
          </Link>
        </section>
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">챌린지</h2>
          {ch && (
            <Link href={`/challenges/${ch.id}`} className="mt-3 block text-sm font-medium text-indigo-700 hover:underline">
              {ch.title}
            </Link>
          )}
          <Link href="/challenges" className="mt-3 inline-block text-xs text-slate-500 hover:text-slate-800">
            전체 보기 →
          </Link>
        </section>
      </div>

      <section className="mt-12 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-bold text-slate-900">토론</h2>
        <p className="mt-1 text-sm text-slate-600">카테고리별 게시판 — 로컬 SQLite + API Routes (데모)</p>
        <Link href="/board" className="mt-3 inline-block text-sm font-semibold text-indigo-600">
          토론판 열기 →
        </Link>
      </section>
    </div>
  );
}
