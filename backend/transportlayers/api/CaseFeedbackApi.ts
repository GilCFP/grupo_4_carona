import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { CaseFeedbackUseCase } from "../../usecase/CaseFeedbackUseCase.js";

const paramsSchema = z.object({
  caseId: z.string().min(1)
});

const bodySchema = z.object({
  analysisId: z.string().min(1).optional(),
  feedbackText: z.string().min(1),
  approvalStatus: z.enum(["approved", "rejected"])
});

export class CaseFeedbackApi {
  constructor(private readonly caseFeedbackUseCase: CaseFeedbackUseCase) {}

  register(app: FastifyInstance) {
    app.post("/:caseId", async (request, reply) => {
      const params = paramsSchema.parse(request.params);
      const body = bodySchema.parse(request.body);

      try {
        const feedback = await this.caseFeedbackUseCase.createFeedback(
          params.caseId,
          body
        );

        return reply.code(201).send(feedback);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Erro ao salvar feedback.";
        const statusCode =
          message === "Caso nao encontrado." || message === "Analise do caso nao encontrada."
            ? 404
            : 400;

        return reply.code(statusCode).send({
          message
        });
      }
    });

    app.get("/savings", async () => {
      return this.caseFeedbackUseCase.getSavingsSummary();
    });
  }
}
