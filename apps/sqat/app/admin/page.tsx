import Link from "next/link";

export default function AdminHome() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold">관리자</h1>
      <ul className="mt-6 space-y-3">
        <li>
          <Link href="/admin/missions" className="text-indigo-600 hover:underline">
            미션 관리
          </Link>
        </li>
        <li>
          <Link href="/admin/scoring" className="text-indigo-600 hover:underline">
            AI 채점 기준 답안
          </Link>
        </li>
        <li>
          <Link href="/admin/board" className="text-indigo-600 hover:underline">
            게시글 관리
          </Link>
        </li>
      </ul>
    </div>
  );
}
