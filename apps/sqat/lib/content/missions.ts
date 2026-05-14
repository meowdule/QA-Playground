import type { Mission } from "@/lib/types";

export const MISSIONS: Mission[] = [
  {
    id: "m-scenario-1",
    type: "scenario",
    title: "[시나리오] 결제 전 장바구니 확인",
    description: "시나리오 문서를 따라 TC 체크리스트를 완료합니다.",
    difficulty: "easy",
    estimatedMinutes: 15,
    isDescriptive: false,
    content: {
      specMarkdown: "회원이 로그인한 상태에서 장바구니에 상품을 담고, 결제 화면 진입 전 수량·금액이 표시되는지 확인합니다.",
      scenarioSteps: [
        "로그인 상태 확인",
        "상품 1개 장바구니 담기",
        "장바구니 화면에서 수량·금액 표시 확인",
        "결제 화면으로 이동 가능 확인",
      ],
    },
  },
  {
    id: "m-tc-1",
    type: "tc_writing",
    title: "[TC 작성] 문의 폼 유효성",
    description: "요구사항을 읽고 TC를 테이블로 작성합니다.",
    difficulty: "medium",
    estimatedMinutes: 25,
    isDescriptive: true,
    content: {
      specMarkdown:
        "**요구사항:** 이메일은 RFC 형식, 제목 1~120자, 본문 필수. 제출 시 유효성 오류 메시지가 필드 옆에 표시되어야 합니다.",
    },
  },
  {
    id: "m-report-1",
    type: "report",
    title: "[보고서] 로그인·로그아웃 회귀",
    description: "각 TC에 PASS/FAIL/N/A/N/T/BLOCK을 기록합니다.",
    difficulty: "medium",
    estimatedMinutes: 20,
    isDescriptive: true,
    content: {
      reportTcIds: ["TC-LGN-001", "TC-LGN-002", "TC-LGN-003"],
    },
  },
  {
    id: "m-defect-1",
    type: "defect_report",
    title: "[결함 제보] 주문 내역 미표시",
    description: "환경·재현·기대/실제·심각도를 제출합니다.",
    difficulty: "hard",
    estimatedMinutes: 30,
    isDescriptive: true,
    content: {
      specMarkdown:
        "결제 직후 주문 내역 API는 200이나 UI 목록이 비어 있음이 재현됩니다. OS·브라우저를 포함해 제보하세요.",
    },
  },
  {
    id: "m-classify-1",
    type: "defect_classify",
    title: "[결함 분류] 심각도 판단",
    description: "제시된 결함 설명을 읽고 심각도와 근거를 제출합니다.",
    difficulty: "medium",
    estimatedMinutes: 18,
    isDescriptive: true,
    content: {
      classifyCases: [
        {
          id: "c1",
          description:
            "결제 완료 후 주문 내역이 DB에 저장되지 않아 목록이 비어 있고, 재접속해도 복구되지 않음.",
        },
        {
          id: "c2",
          description: "상품 목록 정렬 라벨 오타 ('가격순' → '가걱순'). 기능 동작에는 영향 없음.",
        },
      ],
    },
  },
  {
    id: "m-verify-1",
    type: "defect_verify",
    title: "[결함 재검증] 수정 건 확인",
    description: "개발자 코멘트와 함께 재검증 선택지를 제출합니다.",
    difficulty: "hard",
    estimatedMinutes: 35,
    isDescriptive: true,
    content: {
      verifyCases: [
        {
          defectId: "DEF-001",
          title: "로그인 후 장바구니 아이템 수 미반영",
          devComment: "캐시 로직 수정 완료",
          actuallyFixed: false,
          hint: "로그인 직후 새로고침 없이 바로 확인할 것",
        },
        {
          defectId: "DEF-002",
          title: "결제 페이지 금액 합산 오류",
          devComment: "세금 계산 로직 수정 완료",
          actuallyFixed: true,
          hint: null,
        },
        {
          defectId: "DEF-003",
          title: "모바일 화면에서 CTA 버튼 잘림",
          devComment: "CSS 수정 완료",
          actuallyFixed: false,
          hint: "iOS Safari 14 이하에서 확인할 것",
        },
        {
          defectId: "DEF-004",
          title: "비밀번호 재설정 메일 미발송",
          devComment: "SMTP 설정 수정 완료",
          actuallyFixed: true,
          hint: null,
        },
      ],
    },
  },
];

export const MISSION_TYPE_LABEL: Record<Mission["type"], string> = {
  scenario: "시나리오",
  tc_writing: "TC 작성",
  report: "보고서 작성",
  defect_report: "결함 제보",
  defect_classify: "결함 분류",
  defect_verify: "결함 재검증",
};

export function getMission(id: string) {
  return MISSIONS.find((m) => m.id === id) ?? null;
}
