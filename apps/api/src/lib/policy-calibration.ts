import {
  FAVORABLE_OUTCOME_LABELS,
  OFFER_FACTORS_BY_RISK_BAND,
  type ClaimAmountBand,
  type FeatureBucket,
  type HistoricalCaseFeatures,
  type HistoricalCaseRow,
  type PolicyRuleDraft,
  type RiskBand
} from "@grupo4/shared";

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export function isFavorableOutcome(outcome: string): boolean {
  const normalizedOutcome = normalizeText(outcome);

  if (normalizedOutcome.includes("nao exito")) {
    return false;
  }

  return FAVORABLE_OUTCOME_LABELS.some((label) =>
    normalizedOutcome.includes(normalizeText(label))
  );
}

export function toClaimAmountBand(value: number): ClaimAmountBand {
  if (value >= 15000) {
    return "high";
  }

  if (value >= 5000) {
    return "medium";
  }

  return "low";
}

export function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, current) => sum + current, 0) / values.length;
}

export function median(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((left, right) => left - right);
  const middleIndex = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middleIndex - 1] + sorted[middleIndex]) / 2;
  }

  return sorted[middleIndex] ?? 0;
}

export function riskBandFromLossProbability(lossProbability: number): RiskBand {
  if (lossProbability >= 0.7) {
    return "high";
  }

  if (lossProbability >= 0.4) {
    return "medium";
  }

  return "low";
}

export function buildOfferRange(
  expectedCondemnation: number,
  riskBand: RiskBand,
  minOffer = 0,
  maxOffer = 999999
): { min: number; target: number; max: number } {
  const factors = OFFER_FACTORS_BY_RISK_BAND[riskBand];
  const offerMin = expectedCondemnation * factors.min;
  const offerTarget = expectedCondemnation * factors.target;
  const offerMax = expectedCondemnation * factors.max;
  const finalMin = Math.max(minOffer, offerMin);
  const finalMax = Math.min(maxOffer, offerMax);

  return {
    min: finalMin,
    max: finalMax,
    target: Math.min(finalMax, Math.max(finalMin, offerTarget))
  };
}

export function toBucketKey(features: HistoricalCaseFeatures): string {
  return [
    `contract:${features.contractPresent ? 1 : 0}`,
    `credit:${features.creditProofPresent ? 1 : 0}`,
    `dossier:${features.dossierPresent ? 1 : 0}`,
    `debt:${features.debtEvolutionPresent ? 1 : 0}`,
    `report:${features.referenceReportPresent ? 1 : 0}`,
    `band:${features.claimAmountBand}`,
    `full:${features.hasFullDocumentation ? 1 : 0}`
  ].join("|");
}

export function bucketSummaryFromFeatures(
  features: HistoricalCaseFeatures
): string {
  const tokens: string[] = [];

  tokens.push(features.contractPresent ? "contrato presente" : "contrato ausente");
  tokens.push(
    features.creditProofPresent
      ? "comprovante de credito presente"
      : "comprovante de credito ausente"
  );
  tokens.push(features.dossierPresent ? "dossie presente" : "dossie ausente");
  tokens.push(
    features.referenceReportPresent
      ? "laudo referenciado presente"
      : "laudo referenciado ausente"
  );
  tokens.push(`faixa ${features.claimAmountBand} de valor da causa`);

  return tokens.join(", ");
}

export function buildRuleConditions(features: HistoricalCaseFeatures): PolicyRuleDraft["conditionJson"] {
  return {
    all: [
      {
        field: "contractPresent",
        operator: "eq",
        value: features.contractPresent
      },
      {
        field: "creditProofPresent",
        operator: "eq",
        value: features.creditProofPresent
      },
      {
        field: "dossierPresent",
        operator: "eq",
        value: features.dossierPresent
      },
      {
        field: "debtEvolutionPresent",
        operator: "eq",
        value: features.debtEvolutionPresent
      },
      {
        field: "referenceReportPresent",
        operator: "eq",
        value: features.referenceReportPresent
      },
      {
        field: "claimAmountBand",
        operator: "eq",
        value: features.claimAmountBand
      },
      {
        field: "hasFullDocumentation",
        operator: "eq",
        value: features.hasFullDocumentation
      }
    ]
  };
}

export function matchesRule(
  row: HistoricalCaseRow,
  rule: PolicyRuleDraft
): boolean {
  return rule.conditionJson.all.every((condition) => {
    const currentValue =
      row.features[condition.field as keyof HistoricalCaseFeatures];

    switch (condition.operator) {
      case "eq":
        return currentValue === condition.value;
      case "neq":
        return currentValue !== condition.value;
      case "gte":
        return Number(currentValue) >= Number(condition.value);
      case "lte":
        return Number(currentValue) <= Number(condition.value);
      case "in":
        return Array.isArray(condition.value)
          ? condition.value.includes(currentValue as never)
          : false;
      default:
        return false;
    }
  });
}

export function fallbackAction(
  bucket: FeatureBucket
): "agreement" | "defense" {
  const riskBand = riskBandFromLossProbability(bucket.lossRate);
  const offerRange = buildOfferRange(bucket.medianCondemnationBrl, riskBand);

  if (bucket.expectedJudicialCost >= offerRange.target * 1.15) {
    return "agreement";
  }

  return "defense";
}
