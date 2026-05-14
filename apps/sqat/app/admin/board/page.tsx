import Link from "next/link";

export default function AdminBoardPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-xl font-bold">게시글 관리</h1>
      <p className="mt-2 text-sm text-slate-600">
        학습자 토론은 <Link href="/board" className="text-indigo-600 underline">/board</Link>에서 확인하세요. 관리자 전용 목록·삭제 UI는
        차후 Prisma 기반으로 확장합니다.
      </p>
    </div>
  );
}
