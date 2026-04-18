import type { CritiqueResult, DecisionDraft, ExtractedFacts } from "@grupo4/shared";

import type { AgentTraceContext } from "../../platform/agent-transcript.js";
import { critiqueDecision as critiqueDecisionFromLegacy } from "../critique-decision.js";

export class DecisionCritiqueAgent {
  async critique(
    draft: DecisionDraft,
    facts: ExtractedFacts,
    trace?: AgentTraceContext
  ): Promise<CritiqueResult> {
    return critiqueDecisionFromLegacy(draft, facts, trace);
  }
}
