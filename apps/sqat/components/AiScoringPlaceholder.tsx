export function AiScoringPlaceholder() {
  return (
    <section className="mt-8 rounded-xl border border-dashed border-amber-300 bg-amber-50/80 p-6">
      <h2 className="text-sm font-bold uppercase tracking-wide text-amber-900">AI 채점 영역</h2>
      <p className="mt-2 text-sm text-amber-950/90">
        AI 채점 기능 준비 중입니다. (차후 Claude API 연동)
      </p>
      <p className="mt-1 text-xs text-amber-900/70">
        서술형 미션은 제출만 저장되며, 자동 채점 점수는 표시되지 않습니다.
      </p>
    </section>
  );
}
