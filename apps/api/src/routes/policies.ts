import { randomUUID } from "node:crypto";

import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { getActivePolicy, listPolicies } from "../db/repositories/policy-repository.js";
import { runPolicyCalibration } from "../graphs/policy-calibration-graph.js";

const calibratePolicyBodySchema = z
  .object({
    runId: z.string().min(1).optional(),
    inputCsvPath: z.string().min(1).optional(),
    logsPath: z.string().min(1).optional()
  })
  .optional();

export async function registerPolicyRoutes(app: FastifyInstance): Promise<void> {
  app.get("/api/policies", async () => {
    const policies = await listPolicies();

    return {
      items: policies
    };
  });

  app.get("/api/policies/active", async (_request, reply) => {
    const policy = await getActivePolicy();

    if (!policy) {
      return reply.code(404).send({
        message: "Nenhuma policy publicada encontrada."
      });
    }

    return {
      item: policy
    };
  });

  app.post("/api/policies/calibrate", async (request, reply) => {
    const body = calibratePolicyBodySchema.parse(request.body);
    const result = await runPolicyCalibration({
      runId: body?.runId ?? randomUUID(),
      inputCsvPath: body?.inputCsvPath,
      logsPath: body?.logsPath
    });

    return reply.code(201).send({
      runId: result.runId,
      errors: result.errors,
      featureBuckets: result.featureBuckets.length,
      candidateRules: result.candidateRules.length,
      critiqueReport: result.critiqueReport ?? null,
      scorecard: result.scorecard ?? null,
      publishedPolicy: result.publishedPolicy ?? null
    });
  });
}
