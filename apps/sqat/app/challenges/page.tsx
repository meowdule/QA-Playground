import Link from "next/link";
import { CHALLENGES } from "@/lib/content/challenges";

const labels: Record<string, string> = {
  theory: "이론 챌린지",
  tc: "TC 챌린지",
  defect: "결함 챌린지",
  mock_exam: "모의고사",
};

export default function ChallengesPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const t = typeof searchParams.type === "string" ? searchParams.type : null;
  const list = t ? CHALLENGES.filter((c) => c.category === t) : CHALLENGES;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">챌린지</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {["theory", "tc", "defect", "mock_exam"].map((k) => (
          <Link
            key={k}
            href={`/challenges?type=${k}`}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${t === k ? "bg-slate-900 text-white" : "bg-slate-200"}`}
          >
            {labels[k]}
          </Link>
        ))}
        <Link href="/challenges" className={`rounded-full px-3 py-1 text-xs font-semibold ${!t ? "bg-slate-900 text-white" : "bg-slate-200"}`}>
          전체
        </Link>
      </div>
      <ul className="mt-8 space-y-3">
        {list.length === 0 && (
          <li className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
            이 카테고리 챌린지는 준비 중입니다. (이론 챌린지부터 이용해 보세요)
          </li>
        )}
        {list.map((c) => (
          <li key={c.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <Link href={`/challenges/${c.id}`} className="font-semibold text-indigo-700 hover:underline">
              {c.title}
            </Link>
            <p className="mt-1 text-xs text-slate-500">{labels[c.category]} · {c.targetLevel}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
