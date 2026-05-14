/** SQAT 도메인 타입 (스펙 v2 정렬) */

export type LearningCategory =
  | "concept"
  | "technique"
  | "defect_management"
  | "report"
  | "exam_guide";

export interface LearningContent {
  id: string;
  category: LearningCategory;
  title: string;
  body: string;
  relatedMissionIds: string[];
  estimatedMinutes: number;
}

export type MissionType =
  | "scenario"
  | "tc_writing"
  | "report"
  | "defect_report"
  | "defect_classify"
  | "defect_verify";

export type MissionDifficulty = "easy" | "medium" | "hard";

export interface MissionContent {
  /** 시나리오: TC 체크리스트 텍스트 */
  scenarioSteps?: string[];
  /** 요구사항 / 결함 카드 등 */
  specMarkdown?: string;
  /** 보고서 미션: TC id 목록 */
  reportTcIds?: string[];
  /** 결함 분류 시드 */
  classifyCases?: { id: string; description: string }[];
  /** 결함 재검증 시드 */
  verifyCases?: {
    defectId: string;
    title: string;
    devComment: string;
    actuallyFixed: boolean;
    hint: string | null;
  }[];
}

export interface Mission {
  id: string;
  type: MissionType;
  title: string;
  description: string;
  difficulty: MissionDifficulty;
  estimatedMinutes: number;
  isDescriptive: boolean;
  content: MissionContent;
}

export type ChallengeCategory = "theory" | "tc" | "defect" | "mock_exam";
export type CertLevel = "foundation" | "professional";

export type McqQuestion = {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
};

export interface Challenge {
  id: string;
  category: ChallengeCategory;
  title: string;
  targetLevel: CertLevel;
  questions: McqQuestion[];
  timeLimitSeconds?: number;
}

export type BoardCategory = "severity" | "tc_design" | "defect_dispute" | "general";
