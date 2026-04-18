import type { SimilarCasesSummary } from "@grupo4/shared";

import { scoreRisk } from "../../domain/case-decision/logic.js";

export function scoreCaseRisk(similarCases: SimilarCasesSummary) {
  return scoreRisk(similarCases);
}
