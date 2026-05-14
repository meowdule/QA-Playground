import type { LearningContent } from "@/lib/types";

export const LEARNING_CONTENT: LearningContent[] = [
  {
    id: "learn-qa-concept",
    category: "concept",
    title: "QA / QC / Testing 개념",
    estimatedMinutes: 12,
    relatedMissionIds: ["m-scenario-1"],
    body: `## QA vs QC

- **QA (Quality Assurance)**: 품질을 *보증*하기 위한 **예방적** 활동. 프로세스·표준·교육 등이 포함됩니다.
- **QC (Quality Control)**: 품질을 *관리*하기 위한 **검출적** 활동. 검사·테스트·리뷰 결과에 따른 조치가 포함됩니다.
- **Testing**: 소프트웨어가 요구사항을 만족하는지 **실제로 확인**하는 활동으로, QC의 한 축으로 이해하는 경우가 많습니다.

### 관련 미션

아래 미션에서 시나리오 실습을 이어가 보세요.`,
  },
  {
    id: "learn-equiv-partition",
    category: "technique",
    title: "동등 분할 · 경계값 분석",
    estimatedMinutes: 15,
    relatedMissionIds: ["m-tc-1"],
    body: `## 동등 분할 (Equivalence Partitioning)

입력을 **의미상 동등한 구간**으로 나누고, 각 구간에서 대표값 하나만 선택해 테스트합니다.

## 경계값 분석 (Boundary Value Analysis)

경계 **전·경계·경계 후**를 중심으로 결함이 자주 나는 지점을 집중 테스트합니다.`,
  },
  {
    id: "learn-defect-severity",
    category: "defect_management",
    title: "결함 심각도 기준",
    estimatedMinutes: 10,
    relatedMissionIds: ["m-classify-1"],
    body: `| 순위 | 심각도 | 설명 |
|------|--------|------|
| 1 | Blocker | 시스템 중단·데이터 손실 위험 |
| 2 | Critical | 치명적 결함, 다른 테스트 진행 불가 |
| 3 | Major | 핵심 기능 결함 |
| 4 | Minor | 권고 수준 미흡 |
| 5 | Trivial | 오탈자·정렬 등 경미한 UI |`,
  },
  {
    id: "learn-report-status",
    category: "report",
    title: "PASS / FAIL / N/A / N/T / BLOCK",
    estimatedMinutes: 8,
    relatedMissionIds: ["m-report-1"],
    body: `| 결과 | 설명 |
|------|------|
| PASS | 결함 없이 정상 동작 |
| FAIL | 결함 발생 |
| N/A | 검증 불가 (Not Available) |
| N/T | 제외 합의 (Not Tested) |
| BLOCK | 상위 결함으로 하위 검증 불가 |`,
  },
  {
    id: "learn-sqat-exam",
    category: "exam_guide",
    title: "SQAT 시험 안내",
    estimatedMinutes: 6,
    relatedMissionIds: [],
    body: `## SQAT 자격

- **SQAT-Foundation**: 1·2과목, 60분, 과목 60점 이상·평균 70 이상
- **SQAT-Professional**: 1·2·3과목, 90분, 과목 60점 이상·평균 75 이상

이 앱의 **시험 응시** 화면은 UI 구조 데모이며, 실제 채점·자격증 PNG 생성은 Phase 2에서 연동합니다.`,
  },
];

export const LEARNING_CATEGORY_LABEL: Record<LearningContent["category"], string> = {
  concept: "QA 개념",
  technique: "테스트 기법",
  defect_management: "결함 관리",
  report: "보고서 작성법",
  exam_guide: "SQAT 시험 안내",
};
