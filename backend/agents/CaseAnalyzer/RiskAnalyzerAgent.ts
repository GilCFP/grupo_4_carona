import type {
  CaseRecord,
  ExtractedFacts,
  RiskScore,
  SimilarCasesSummary
} from "@grupo4/shared";

import {
  riskBandFromLossProbability,
  toClaimAmountBand
} from "../../domain/policy-calibration/logic.js";

export class RiskAnalyzerAgent {
  analyze(input: {
    similarCases: SimilarCasesSummary;
    caseRecord: Pick<CaseRecord, "claimAmountCents">;
    facts: ExtractedFacts;
  }): RiskScore {
    const priorLossProbability = this.estimateDocumentPrior(input);
    const historicalWeight = this.getHistoricalWeight(input.similarCases.sampleSize);
    const historicalLossProbability =
      input.similarCases.sampleSize > 0
        ? input.similarCases.lossRate
        : priorLossProbability;
    const lossProbability = this.clamp(
      historicalLossProbability * historicalWeight +
        priorLossProbability * (1 - historicalWeight),
      0.05,
      0.95
    );

    const expectedCondemnation = this.estimateExpectedCondemnation(input);

    return {
      lossProbability,
      expectedCondemnation,
      expectedJudicialCost: lossProbability * expectedCondemnation,
      riskBand: riskBandFromLossProbability(lossProbability)
    };
  }

  private estimateDocumentPrior(input: {
    caseRecord: Pick<CaseRecord, "claimAmountCents">;
    facts: ExtractedFacts;
  }): number {
    const { caseRecord, facts } = input;
    const claimAmountBrl = (caseRecord.claimAmountCents ?? 0) / 100;
    const claimAmountBand = toClaimAmountBand(claimAmountBrl);
    let prior = 0.32;

    if (!facts.creditProofPresent) {
      prior += 0.1;
    }

    if (!facts.creditProofValid) {
      prior += 0.16;
    }

    if (!facts.matchingDepositFound) {
      prior += 0.2;
    }

    if (!facts.contractPresent) {
      prior += 0.05;
    }

    if (facts.plaintiffClaimsNonRecognition) {
      prior += 0.05;
    }

    if (facts.dossierStatus === "missing") {
      prior += 0.06;
    } else if (facts.dossierStatus === "inconclusive") {
      prior += 0.04;
    } else if (facts.dossierStatus === "unfavorable") {
      prior += 0.1;
    } else if (facts.dossierStatus === "favorable") {
      prior -= 0.12;
    }

    if (facts.debtEvolutionPresent) {
      prior -= 0.04;
    }

    if (facts.referenceReportPresent) {
      prior -= 0.03;
    }

    prior += Math.min(facts.materialContradictions, 3) * 0.06;
    prior += Math.min(facts.missingCriticalDocuments, 3) * 0.05;

    if (claimAmountBand === "high") {
      prior += 0.04;
    } else if (claimAmountBand === "low") {
      prior -= 0.03;
    }

    return this.clamp(prior, 0.08, 0.92);
  }

  private getHistoricalWeight(sampleSize: number): number {
    if (sampleSize <= 0) {
      return 0;
    }

    if (sampleSize >= 12) {
      return 0.85;
    }

    return this.clamp(0.25 + sampleSize * 0.05, 0.25, 0.85);
  }

  private estimateExpectedCondemnation(input: {
    similarCases: SimilarCasesSummary;
    caseRecord: Pick<CaseRecord, "claimAmountCents">;
    facts: ExtractedFacts;
  }): number {
    const claimAmountBrl = (input.caseRecord.claimAmountCents ?? 0) / 100;
    const documentaryAnchor =
      input.facts.contractAmount ??
      input.facts.depositAmount ??
      claimAmountBrl;
    const historicalAnchor =
      input.similarCases.medianCondemnation > 0
        ? input.similarCases.medianCondemnation
        : input.similarCases.avgCondemnation;

    if (input.similarCases.sampleSize > 0 && historicalAnchor > 0) {
      const historicalWeight = this.getHistoricalWeight(input.similarCases.sampleSize);

      return historicalAnchor * historicalWeight + documentaryAnchor * (1 - historicalWeight);
    }

    if (documentaryAnchor > 0) {
      return documentaryAnchor * 0.45;
    }

    return 3000;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}
