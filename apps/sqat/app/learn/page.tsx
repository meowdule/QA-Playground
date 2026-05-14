import Link from "next/link";
import { LEARNING_CONTENT, LEARNING_CATEGORY_LABEL } from "@/lib/content/learning";

export default function LearnIndexPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const cat = typeof searchParams.cat === "string" ? searchParams.cat : null;
  const list = cat ? LEARNING_CONTENT.filter((a) => a.category === cat) : LEARNING_CONTENT;
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">학습</h1>
      <p className="mt-2 text-sm text-slate-600">Markdown 아티클 · 하단에서 관련 미션으로 이동합니다.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/learn" className={`rounded-full px-3 py-1 text-xs font-medium ${!cat ? "bg-slate-900 text-white" : "bg-slate-200"}`}>
          전체
        </Link>
        {(Object.keys(LEARNING_CATEGORY_LABEL) as Array<keyof typeof LEARNING_CATEGORY_LABEL>).map((k) => (
          <Link
            key={k}
            href={`/learn?cat=${k}`}
            className={`rounded-full px-3 py-1 text-xs font-medium ${cat === k ? "bg-slate-900 text-white" : "bg-slate-200"}`}
          >
            {LEARNING_CATEGORY_LABEL[k]}
          </Link>
        ))}
      </div>
      <ul className="mt-8 space-y-3">
        {list.map((a) => (
          <li key={a.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <Link href={`/learn/${a.id}`} className="font-semibold text-indigo-700 hover:underline">
              {a.title}
            </Link>
            <p className="mt-1 text-xs text-slate-500">
              {LEARNING_CATEGORY_LABEL[a.category]} · 약 {a.estimatedMinutes}분
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
