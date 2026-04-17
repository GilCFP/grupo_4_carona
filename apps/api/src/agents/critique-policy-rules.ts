import {
  ONLINE_COMPATIBLE_POLICY_FIELDS,
  type PolicyCritiqueIssue,
  type PolicyCritiqueReport,
  type PolicyRuleDraft
} from "@grupo4/shared";
import { policyCritiqueReportSchema } from "@grupo4/shared";

export async function critiquePolicyRules(
  rules: PolicyRuleDraft[]
): Promise<PolicyCritiqueReport> {
  const issues: PolicyCritiqueIssue[] = [];
  const seenKeys = new Set<string>();
  const seenConditionHashes = new Map<string, string>();
  const actionCounts = rules.reduce<Record<string, number>>((acc, rule) => {
    acc[rule.action] = (acc[rule.action] ?? 0) + 1;
    return acc;
  }, {});

  for (const rule of rules) {
    if (seenKeys.has(rule.ruleKey)) {
      issues.push({
        severity: "high",
        message: "ruleKey duplicado encontrado na politica.",
        ruleKey: rule.ruleKey
      });
    }
    seenKeys.add(rule.ruleKey);

    const conditionHash = JSON.stringify(rule.conditionJson.all);
    const previousAction = seenConditionHashes.get(conditionHash);
    if (previousAction && previousAction !== rule.action) {
      issues.push({
        severity: "high",
        message: "Mesmo conjunto de condicoes aparece com acoes diferentes.",
        ruleKey: rule.ruleKey
      });
    } else {
      seenConditionHashes.set(conditionHash, rule.action);
    }

    if (rule.action === "agreement" && !rule.offerTargetFactor) {
      issues.push({
        severity: "medium",
        message: "Regra de acordo sem fator de oferta target.",
        ruleKey: rule.ruleKey
      });
    }

    for (const condition of rule.conditionJson.all) {
      if (!ONLINE_COMPATIBLE_POLICY_FIELDS.has(condition.field)) {
        issues.push({
          severity: "medium",
          message: `Campo ${condition.field} ainda nao esta claramente exposto no workflow online.`,
          ruleKey: rule.ruleKey
        });
      }
    }
  }

  if ((actionCounts.agreement ?? 0) === 0) {
    issues.push({
      severity: "high",
      message: "A politica nao gerou nenhuma regra de acordo."
    });
  }

  if ((actionCounts.defense ?? 0) === 0) {
    issues.push({
      severity: "medium",
      message: "A politica nao gerou nenhuma regra explicita de defesa."
    });
  }

  const highIssues = issues.filter((issue) => issue.severity === "high");

  return policyCritiqueReportSchema.parse({
    passed: highIssues.length === 0,
    summary:
      highIssues.length === 0
        ? "Politica operacionalizavel para o MVP, com ressalvas conhecidas sobre cobertura dos sinais historicos."
        : "A politica precisa de ajuste antes de ser promovida sem supervisao.",
    issues
  });
}
