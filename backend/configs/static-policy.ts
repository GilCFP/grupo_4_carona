import type { PolicyRuleDraft, PolicyScorecard } from "@grupo4/shared";

export const STATIC_POLICY_VERSION = "static-policy-v1";
export const STATIC_POLICY_NAME = "Static Default Policy";

export const staticPolicyRules: PolicyRuleDraft[] = [
  {
    ruleKey: "static_agreement_missing_credit_proof",
    priority: 10,
    title: "Sugerir acordo quando faltar comprovante de crédito",
    conditionSummary: "Ausência de comprovante de crédito",
    conditionJson: {
      all: [
        {
          field: "creditProofPresent",
          operator: "eq",
          value: false
        }
      ]
    },
    action: "agreement",
    offerMinFactor: 0.5,
    offerTargetFactor: 0.65,
    offerMaxFactor: 0.8,
    explanation:
      "Sem comprovante de crédito, o caso tende a risco maior para o banco e merece estratégia de acordo."
  },
  {
    ruleKey: "static_defense_full_documentation",
    priority: 20,
    title: "Sustentar defesa quando a documentação estiver completa",
    conditionSummary: "Documentação completa com dossiê e referência",
    conditionJson: {
      all: [
        {
          field: "hasFullDocumentation",
          operator: "eq",
          value: true
        },
        {
          field: "dossierPresent",
          operator: "eq",
          value: true
        },
        {
          field: "referenceReportPresent",
          operator: "eq",
          value: true
        }
      ]
    },
    action: "defense",
    explanation:
      "Quando o caso apresenta documentação completa, a defesa tende a ser a estratégia mais consistente."
  },
  {
    ruleKey: "static_review_high_value_partial_docs",
    priority: 30,
    title: "Enviar para revisão humana casos altos com documentação parcial",
    conditionSummary: "Valor alto com documentação parcial",
    conditionJson: {
      all: [
        {
          field: "claimAmountBand",
          operator: "eq",
          value: "high"
        },
        {
          field: "hasFullDocumentation",
          operator: "eq",
          value: false
        }
      ]
    },
    action: "review",
    explanation:
      "Casos de maior valor e documentação incompleta devem passar por revisão humana antes da decisão final."
  }
];

export const staticPolicyScorecard: PolicyScorecard = {
  totalCases: 0,
  trainSampleSize: 0,
  testSampleSize: 0,
  matchedCases: 0,
  coverageRate: 0,
  estimatedPolicyCost: 0,
  baselineExpectedCost: 0,
  estimatedSavings: 0,
  policyScore: 0.5,
  agreementRate: 0.34,
  defenseRate: 0.33,
  reviewRate: 0.33,
  hardRuleHitRate: 0
};
