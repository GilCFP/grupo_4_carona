import { Annotation, START, END, StateGraph } from "@langchain/langgraph";
import {
  POLICY_CALIBRATION_WORKFLOW,
  policyCritiqueReportSchema,
  policyRuleDraftSchema,
  policyScorecardSchema,
  type PolicyCalibrationState
} from "@grupo4/shared";

import { critiquePolicyRules } from "../agents/critique-policy-rules.js";
import { proposePolicyRules } from "../agents/propose-policy-rules.js";
import { createAgentRun } from "../db/repositories/agent-run-repository.js";
import { buildFeatureBuckets } from "../services/policy-calibration/build-feature-buckets.js";
import { loadHistoricalData } from "../services/policy-calibration/load-historical-data.js";
import { publishPolicyVersion } from "../services/policy-calibration/publish-policy-version.js";
import { scorePolicyRules } from "../services/policy-calibration/score-policy-rules.js";

const policyCalibrationState = Annotation.Root({
  runId: Annotation<string>({
    reducer: (_current, update) => update,
    default: () => ""
  }),
  inputCsvPath: Annotation<string | undefined>({
    reducer: (_current, update) => update,
    default: () => undefined
  }),
  logsPath: Annotation<string | undefined>({
    reducer: (_current, update) => update,
    default: () => undefined
  }),
  historicalRows: Annotation<PolicyCalibrationState["historicalRows"]>({
    reducer: (_current, update) => update,
    default: () => []
  }),
  featureBuckets: Annotation<PolicyCalibrationState["featureBuckets"]>({
    reducer: (_current, update) => update,
    default: () => []
  }),
  candidateRules: Annotation<PolicyCalibrationState["candidateRules"]>({
    reducer: (_current, update) => update,
    default: () => []
  }),
  critiqueReport: Annotation<PolicyCalibrationState["critiqueReport"]>({
    reducer: (_current, update) => update,
    default: () => undefined
  }),
  scorecard: Annotation<PolicyCalibrationState["scorecard"]>({
    reducer: (_current, update) => update,
    default: () => undefined
  }),
  publishedPolicy: Annotation<PolicyCalibrationState["publishedPolicy"]>({
    reducer: (_current, update) => update,
    default: () => undefined
  }),
  errors: Annotation<string[]>({
    reducer: (_current, update) => update,
    default: () => []
  })
});

async function runNode<TDelta extends Partial<PolicyCalibrationState>>(
  agentName: string,
  state: PolicyCalibrationState,
  fn: () => Promise<TDelta>
): Promise<TDelta> {
  if (state.errors.length > 0) {
    return {} as TDelta;
  }

  try {
    const delta = await fn();
    await createAgentRun({
      workflowType: POLICY_CALIBRATION_WORKFLOW,
      agentName,
      input: {
        runId: state.runId,
        inputCsvPath: state.inputCsvPath,
        historicalRowCount: state.historicalRows.length,
        featureBucketCount: state.featureBuckets.length,
        candidateRuleCount: state.candidateRules.length
      },
      output: delta
    });
    return delta;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Falha desconhecida no workflow.";
    const errors = [...state.errors, `${agentName}: ${message}`];

    await createAgentRun({
      workflowType: POLICY_CALIBRATION_WORKFLOW,
      agentName,
      input: {
        runId: state.runId
      },
      output: {
        errors
      }
    });

    return {
      errors
    } as TDelta;
  }
}

async function loadHistoricalDataNode(
  state: PolicyCalibrationState
): Promise<Partial<PolicyCalibrationState>> {
  return runNode("loadHistoricalData", state, async () => {
    const { historicalRows } = await loadHistoricalData(state.inputCsvPath);

    return {
      historicalRows
    };
  });
}

async function buildFeatureBucketsNode(
  state: PolicyCalibrationState
): Promise<Partial<PolicyCalibrationState>> {
  return runNode("buildFeatureBuckets", state, async () => ({
    featureBuckets: buildFeatureBuckets(state.historicalRows)
  }));
}

async function proposePolicyRulesNode(
  state: PolicyCalibrationState
): Promise<Partial<PolicyCalibrationState>> {
  return runNode("proposePolicyRules", state, async () => ({
    candidateRules: (await proposePolicyRules(state.featureBuckets)).map((rule) =>
      policyRuleDraftSchema.parse(rule)
    )
  }));
}

async function critiquePolicyRulesNode(
  state: PolicyCalibrationState
): Promise<Partial<PolicyCalibrationState>> {
  return runNode("critiquePolicyRules", state, async () => ({
    critiqueReport: policyCritiqueReportSchema.parse(
      await critiquePolicyRules(state.candidateRules)
    )
  }));
}

async function scorePolicyRulesNode(
  state: PolicyCalibrationState
): Promise<Partial<PolicyCalibrationState>> {
  return runNode("scorePolicyRules", state, async () => ({
    scorecard: policyScorecardSchema.parse(
      scorePolicyRules(
        state.historicalRows,
        state.featureBuckets,
        state.candidateRules
      )
    )
  }));
}

async function publishPolicyVersionNode(
  state: PolicyCalibrationState
): Promise<Partial<PolicyCalibrationState>> {
  return runNode("publishPolicyVersion", state, async () => ({
    publishedPolicy: await publishPolicyVersion(state)
  }));
}

export const policyCalibrationGraph = new StateGraph(policyCalibrationState)
  .addNode("loadHistoricalData", loadHistoricalDataNode)
  .addNode("buildFeatureBuckets", buildFeatureBucketsNode)
  .addNode("proposePolicyRules", proposePolicyRulesNode)
  .addNode("critiquePolicyRules", critiquePolicyRulesNode)
  .addNode("scorePolicyRules", scorePolicyRulesNode)
  .addNode("publishPolicyVersion", publishPolicyVersionNode)
  .addEdge(START, "loadHistoricalData")
  .addEdge("loadHistoricalData", "buildFeatureBuckets")
  .addEdge("buildFeatureBuckets", "proposePolicyRules")
  .addEdge("proposePolicyRules", "critiquePolicyRules")
  .addEdge("critiquePolicyRules", "scorePolicyRules")
  .addEdge("scorePolicyRules", "publishPolicyVersion")
  .addEdge("publishPolicyVersion", END)
  .compile();

export async function runPolicyCalibration(
  input: Pick<PolicyCalibrationState, "runId" | "inputCsvPath" | "logsPath">
): Promise<PolicyCalibrationState> {
  return policyCalibrationGraph.invoke({
    runId: input.runId,
    inputCsvPath: input.inputCsvPath,
    logsPath: input.logsPath,
    historicalRows: [],
    featureBuckets: [],
    candidateRules: [],
    errors: []
  });
}
