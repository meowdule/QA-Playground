import Link from "next/link";
import { BoardNewForm } from "@/components/BoardNewForm";

export default function BoardNewPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/board" className="text-xs text-indigo-600">
        ← 토론 목록
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">게시글 작성</h1>
      <div className="mt-8">
        <BoardNewForm />
      </div>
    </div>
  );
}
