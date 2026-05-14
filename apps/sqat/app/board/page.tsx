import Link from "next/link";
import { BoardListClient } from "@/components/BoardListClient";

export default function BoardPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const cat = typeof searchParams.category === "string" ? searchParams.category : null;
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">토론</h1>
          <p className="mt-1 text-sm text-slate-600">카테고리 필수 · 댓글 · 좋아요</p>
        </div>
        <Link href="/board/new" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
          글쓰기
        </Link>
      </div>
      <div className="mt-6 flex flex-wrap gap-2 text-xs">
        {["severity", "tc_design", "defect_dispute", "general"].map((c) => (
          <Link
            key={c}
            href={`/board?category=${c}`}
            className={`rounded-full px-3 py-1 font-medium ${cat === c ? "bg-slate-900 text-white" : "bg-slate-200"}`}
          >
            {c}
          </Link>
        ))}
        <Link href="/board" className={`rounded-full px-3 py-1 font-medium ${!cat ? "bg-slate-900 text-white" : "bg-slate-200"}`}>
          전체
        </Link>
      </div>
      <div className="mt-8">
        <BoardListClient category={cat} />
      </div>
    </div>
  );
}
