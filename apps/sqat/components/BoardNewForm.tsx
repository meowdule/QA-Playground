"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const CATS = [
  { v: "severity", l: "심각도 논의" },
  { v: "tc_design", l: "TC 설계 기준" },
  { v: "defect_dispute", l: "결함 여부 논의" },
  { v: "general", l: "자유 토론" },
];

function authorId() {
  if (typeof window === "undefined") return "anon";
  let id = localStorage.getItem("sqatAuthorId");
  if (!id) {
    id = `u_${Math.random().toString(36).slice(2, 12)}`;
    localStorage.setItem("sqatAuthorId", id);
  }
  return id;
}

export function BoardNewForm() {
  const router = useRouter();
  const [category, setCategory] = useState("general");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [missionId, setMissionId] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/board/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category,
        title,
        content,
        relatedMissionId: missionId || undefined,
        authorId: authorId(),
      }),
    });
    if (!res.ok) {
      alert("저장 실패");
      setBusy(false);
      return;
    }
    const p = await res.json();
    router.push(`/board/${p.id}`);
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-2xl space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <label className="block text-sm font-medium">카테고리</label>
      <select className="w-full rounded border px-3 py-2" value={category} onChange={(e) => setCategory(e.target.value)}>
        {CATS.map((c) => (
          <option key={c.v} value={c.v}>
            {c.l}
          </option>
        ))}
      </select>
      <label className="block text-sm font-medium">제목</label>
      <input className="w-full rounded border px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <label className="block text-sm font-medium">본문</label>
      <textarea className="w-full rounded border px-3 py-2" rows={8} value={content} onChange={(e) => setContent(e.target.value)} required />
      <label className="block text-sm font-medium">관련 미션 ID (선택)</label>
      <input className="w-full rounded border px-3 py-2" value={missionId} onChange={(e) => setMissionId(e.target.value)} placeholder="예: m-scenario-1" />
      <button type="submit" disabled={busy} className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white">
        등록
      </button>
    </form>
  );
}
