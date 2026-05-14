import Link from "next/link";

export default function SqatInfoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-black text-slate-900">SQAT 자격증</h1>
      <p className="mt-2 text-sm text-slate-600">Software QA Tester · Foundation / Professional</p>

      <section className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold">SQAT-Foundation</h2>
        <table className="mt-4 w-full text-left text-sm">
          <thead>
            <tr className="border-b text-xs text-slate-500">
              <th className="py-2">과목</th>
              <th>형식</th>
              <th>배점</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">1과목 — QA 이론 및 용어</td>
              <td>객관식 20문항</td>
              <td>40점</td>
            </tr>
            <tr>
              <td className="py-2">2과목 — TC 설계 및 결함 제보</td>
              <td>실기 3문항</td>
              <td>60점</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-4 text-sm text-slate-700">합격: 과목 60점 이상, 전체 평균 70 이상 · 시험 시간 60분</p>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold">SQAT-Professional</h2>
        <table className="mt-4 w-full text-left text-sm">
          <thead>
            <tr className="border-b text-xs text-slate-500">
              <th className="py-2">과목</th>
              <th>형식</th>
              <th>배점</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">1과목</td>
              <td>객관식 20문항</td>
              <td>40점</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">2과목</td>
              <td>실기 3문항</td>
              <td>60점</td>
            </tr>
            <tr>
              <td className="py-2">3과목 — 결함 분석 및 재검증</td>
              <td>시나리오 실기</td>
              <td>60점</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-4 text-sm text-slate-700">합격: 과목 60점 이상, 전체 평균 75 이상 · 시험 시간 90분</p>
      </section>

      <div className="mt-10">
        <Link href="/sqat/exam" className="inline-flex rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-indigo-700">
          시험 화면 데모 (응시)
        </Link>
      </div>
    </div>
  );
}
