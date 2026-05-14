"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Row = {
  id: string;
  title: string;
  category: string;
  likes: number;
  isResolved: boolean;
  hasOfficialReply: boolean;
  createdAt: string;
  _count: { comments: number };
};

export function BoardListClient({ category }: { category: string | null }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const q = category ? `?category=${encodeURIComponent(category)}` : "";
    fetch(`/api/board/posts${q}`)
      .then((r) => r.json())
      .then(setRows)
      .catch(() => setErr("목록을 불러오지 못했습니다."));
  }, [category]);

  if (err) return <p className="text-rose-600">{err}</p>;

  return (
    <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
      {rows.length === 0 && <li className="p-6 text-sm text-slate-500">게시글이 없습니다.</li>}
      {rows.map((p) => (
        <li key={p.id} className="p-4 hover:bg-slate-50">
          <Link href={`/board/${p.id}`} className="font-medium text-slate-900 hover:text-indigo-700">
            {p.title}
          </Link>
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="rounded bg-slate-100 px-2 py-0.5">{p.category}</span>
            <span>댓글 {p._count.comments}</span>
            <span>♥ {p.likes}</span>
            {p.hasOfficialReply && <span className="text-emerald-700">공식 답변</span>}
          </div>
        </li>
      ))}
    </ul>
  );
}
