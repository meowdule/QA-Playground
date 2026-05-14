import Link from "next/link";

const nav = [
  {
    label: "학습",
    href: "/learn",
    sub: [
      { label: "QA 개념", href: "/learn?cat=concept" },
      { label: "테스트 기법", href: "/learn?cat=technique" },
      { label: "결함 관리", href: "/learn?cat=defect_management" },
      { label: "보고서 작성법", href: "/learn?cat=report" },
      { label: "SQAT 시험 안내", href: "/learn?cat=exam_guide" },
    ],
  },
  {
    label: "미션",
    href: "/missions",
    sub: [
      { label: "시나리오", href: "/missions?type=scenario" },
      { label: "TC 작성", href: "/missions?type=tc_writing" },
      { label: "보고서 작성", href: "/missions?type=report" },
      { label: "결함 제보", href: "/missions?type=defect_report" },
      { label: "결함 분류", href: "/missions?type=defect_classify" },
      { label: "결함 재검증", href: "/missions?type=defect_verify" },
    ],
  },
  {
    label: "챌린지",
    href: "/challenges",
    sub: [
      { label: "이론 챌린지", href: "/challenges?type=theory" },
      { label: "TC 챌린지", href: "/challenges?type=tc" },
      { label: "결함 챌린지", href: "/challenges?type=defect" },
      { label: "모의고사", href: "/challenges?type=mock_exam" },
    ],
  },
  {
    label: "토론",
    href: "/board",
    sub: [
      { label: "심각도 논의", href: "/board?category=severity" },
      { label: "TC 설계 기준", href: "/board?category=tc_design" },
      { label: "결함 여부 논의", href: "/board?category=defect_dispute" },
      { label: "자유 토론", href: "/board?category=general" },
    ],
  },
];

export function GNB() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-3">
        <Link href="/" className="mr-4 text-lg font-bold tracking-tight text-slate-900">
          SQAT
        </Link>
        <nav className="flex flex-wrap gap-1" aria-label="주요 메뉴">
          {nav.map((top) => (
            <details key={top.label} className="group relative">
              <summary className="cursor-pointer list-none rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 [&::-webkit-details-marker]:hidden">
                {top.label}
                <span className="ml-1 text-slate-400">▾</span>
              </summary>
              <div className="absolute left-0 top-full z-50 mt-1 min-w-[200px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                <Link
                  href={top.href}
                  className="block px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-slate-50"
                >
                  {top.label} 홈
                </Link>
                <div className="my-1 border-t border-slate-100" />
                {top.sub.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="block px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </details>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 text-sm">
          <Link href="/sqat" className="font-medium text-slate-600 hover:text-slate-900">
            자격증
          </Link>
          <Link href="/admin" className="rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800">
            관리자
          </Link>
        </div>
      </div>
    </header>
  );
}
