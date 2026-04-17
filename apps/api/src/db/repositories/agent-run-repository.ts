import { prisma } from "../client.js";
import { safeStringify } from "../../lib/json.js";

type AgentRunInput = {
  workflowType: string;
  agentName: string;
  caseId?: string;
  input?: unknown;
  output?: unknown;
};

export async function createAgentRun({
  workflowType,
  agentName,
  caseId,
  input,
  output
}: AgentRunInput): Promise<void> {
  await prisma.agentRun.create({
    data: {
      workflowType,
      caseId,
      agentName,
      inputJson: input ? safeStringify(input) : null,
      outputJson: output ? safeStringify(output) : null
    }
  });
}
