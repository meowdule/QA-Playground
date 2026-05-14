import type { Challenge } from "@/lib/types";

export const CHALLENGES: Challenge[] = [
  {
    id: "ch-theory-1",
    category: "theory",
    title: "SQAT 1과목 맛보기 — 이론 5문항",
    targetLevel: "foundation",
    questions: [
      {
        id: "q1",
        prompt: "다음 중 '예방적' 품질 활동에 가장 가까운 것은?",
        choices: ["Testing", "QA", "Debugging", "Hotfix"],
        correctIndex: 1,
      },
      {
        id: "q2",
        prompt: "경계값 분석에서 우선적으로 다루는 것은?",
        choices: ["평균값", "경계 전·경계·경계 후", "랜덤 샘플", "UI 색상"],
        correctIndex: 1,
      },
      {
        id: "q3",
        prompt: "BLOCK 결과의 의미로 옳은 것은?",
        choices: [
          "테스트를 아직 안 함",
          "상위 결함으로 하위 검증 불가",
          "기능이 정상",
          "테스트 제외 합의",
        ],
        correctIndex: 1,
      },
      {
        id: "q4",
        prompt: "Trivial 심각도에 가장 가까운 예는?",
        choices: ["데이터 손실", "오탈자", "결제 실패", "로그인 불가"],
        correctIndex: 1,
      },
      {
        id: "q5",
        prompt: "SQAT-Foundation 합격 기준(평균)은?",
        choices: ["평균 60 이상", "평균 70 이상", "평균 80 이상", "과목 무관"],
        correctIndex: 1,
      },
    ],
  },
];

export function getChallenge(id: string) {
  return CHALLENGES.find((c) => c.id === id) ?? null;
}
