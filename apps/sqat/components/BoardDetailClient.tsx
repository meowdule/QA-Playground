"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  isResolved: boolean;
  hasOfficialReply: boolean;
  relatedMissionId: string | null;
  comments: { id: string; authorId: string; body: string; createdAt: string }[];
};

function authorId() {
  let id = localStorage.getItem("sqatAuthorId");
  if (!id) {
    id = `u_${Math.random().toString(36).slice(2, 12)}`;
    localStorage.setItem("sqatAuthorId", id);
  }
  return id;
}

export function BoardDetailClient({ id }: { id: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const [comment, setComment] = useState("");
  const [showAi, setShowAi] = useState(false);

  function load() {
    fetch(`/api/board/posts/${id}`)
      .then((r) => r.json())
      .then(setPost);
  }

  useEffect(() => {
    load();
  }, [id]);

  useEffect(() => {
    if (post && post.comments.length >= 10) setShowAi(true);
  }, [post]);

  if (!post) return <p className="p-6 text-sm text-slate-500">불러오는 중…</p>;

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/board" className="text-xs text-indigo-600">
        ← 목록
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">{post.title}</h1>
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
        <span>{post.category}</span>
        {post.relatedMissionId && <span>미션: {post.relatedMissionId}</span>}
        <span>♥ {post.likes}</span>
      </div>
      <div className="mt-6 max-w-none whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
        {post.content}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
          onClick={() => fetch(`/api/board/posts/${id}/like`, { method: "POST" }).then(load)}
        >
          좋아요
        </button>
        <button
          type="button"
          className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-900"
          onClick={() => fetch(`/api/board/posts/${id}/resolve`, { method: "POST" }).then(load)}
        >
          공식 답변 완료 (관리자 데모)
        </button>
      </div>
      {post.hasOfficialReply && <p className="mt-2 text-sm font-medium text-emerald-700">공식 답변 완료됨</p>}

      <section className="mt-10">
        <h2 className="text-lg font-bold">댓글</h2>
        <ul className="mt-3 space-y-3">
          {post.comments.map((c) => (
            <li key={c.id} className="rounded-lg border border-slate-100 bg-white p-3 text-sm">
              <span className="text-xs text-slate-400">{c.authorId}</span>
              <p className="mt-1 whitespace-pre-wrap">{c.body}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-2">
          <textarea
            className="min-h-[72px] flex-1 rounded border px-3 py-2 text-sm"
            placeholder="댓글"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="button"
            className="self-end rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            onClick={async () => {
              if (!comment.trim()) return;
              await fetch(`/api/board/posts/${id}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ authorId: authorId(), body: comment }),
              });
              setComment("");
              load();
            }}
          >
            등록
          </button>
        </div>
        {showAi && (
          <button type="button" className="mt-4 text-sm font-medium text-indigo-600" disabled>
            AI 요약 보기 (준비 중)
          </button>
        )}
      </section>
    </article>
  );
}
