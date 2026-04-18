import assert from "node:assert/strict";
import test from "node:test";

import type { ExtractedFacts, SimilarCasesSummary } from "@grupo4/shared";

import { RiskAnalyzerAgent } from "./RiskAnalyzerAgent.js";

const agent = new RiskAnalyzerAgent();

function makeFacts(overrides: Partial<ExtractedFacts> = {}): ExtractedFacts {
  return {
    contractPresent: false,
    creditProofPresent: false,
    creditProofValid: false,
    matchingDepositFound: false,
    dossierStatus: "missing",
    debtEvolutionPresent: false,
    referenceReportPresent: false,
    materialContradictions: 0,
    missingCriticalDocuments: 2,
    plaintiffClaimsNonRecognition: true,
    evidenceRefs: [],
    ...overrides
  };
}

test("RiskAnalyzerAgent evita fallback neutro de 50% em caso documentalmente fraco", () => {
  const similarCases: SimilarCasesSummary = {
    sampleSize: 0,
    lossRate: 0.5,
    medianCondemnation: 6000,
    avgCondemnation: 6000,
    topPatterns: ["sem historico similar suficiente"]
  };

  const risk = agent.analyze({
    similarCases,
    caseRecord: {
      claimAmountCents: 1500000
    },
    facts: makeFacts()
  });

  assert.notEqual(risk.lossProbability, 0.5);
  assert.ok(risk.lossProbability > 0.5);
});

test("RiskAnalyzerAgent reduz risco quando ha documentacao forte mesmo com pouca amostra", () => {
  const similarCases: SimilarCasesSummary = {
    sampleSize: 2,
    lossRate: 0.5,
    medianCondemnation: 2000,
    avgCondemnation: 2000,
    topPatterns: ["amostra pequena"]
  };

  const risk = agent.analyze({
    similarCases,
    caseRecord: {
      claimAmountCents: 400000
    },
    facts: makeFacts({
      contractPresent: true,
      creditProofPresent: true,
      creditProofValid: true,
      matchingDepositFound: true,
      dossierStatus: "favorable",
      debtEvolutionPresent: true,
      referenceReportPresent: true,
      missingCriticalDocuments: 0,
      plaintiffClaimsNonRecognition: false
    })
  });

  assert.ok(risk.lossProbability < 0.5);
});
