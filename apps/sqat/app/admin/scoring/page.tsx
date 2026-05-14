export default function AdminScoringPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-xl font-bold">AI 채점 기준 답안</h1>
      <p className="mt-2 text-sm text-slate-600">차후 Claude API 연동 시 사용할 기준 답안 JSON / 루브릭을 등록합니다.</p>
      <form className="mt-8 space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <label className="block text-sm font-medium">미션 타입</label>
        <select className="w-full rounded border px-3 py-2">
          <option>defect_report</option>
          <option>tc_writing</option>
          <option>report</option>
        </select>
        <label className="block text-sm font-medium">루브릭 (JSON)</label>
        <textarea className="w-full rounded border px-3 py-2 font-mono text-xs" rows={10} placeholder='{"title":20,"steps":25,...}' />
        <button type="button" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
          등록 (로컬 데모 — 저장 안 함)
        </button>
      </form>
    </div>
  );
}
