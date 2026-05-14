export default function AdminMissionsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-xl font-bold">미션 관리</h1>
      <p className="mt-2 text-sm text-slate-600">등록/수정/삭제 UI는 Phase 1에서 폼 자리만 표시합니다. 현재 미션은 코드 시드(`lib/content/missions.ts`)입니다.</p>
      <form className="mt-8 space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <label className="block text-sm font-medium">미션 ID</label>
        <input className="w-full rounded border px-3 py-2" disabled placeholder="m-new-001" />
        <label className="block text-sm font-medium">제목</label>
        <input className="w-full rounded border px-3 py-2" disabled />
        <button type="button" className="rounded-lg bg-slate-200 px-4 py-2 text-sm" disabled>
          저장 (준비 중)
        </button>
      </form>
    </div>
  );
}
