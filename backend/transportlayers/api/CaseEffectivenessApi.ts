import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { CaseEffectivenessUseCase } from "../../usecase/CaseEffectivenessUseCase.js";

const paramsSchema = z.object({
  caseId: z.string().min(1)
});

const bodySchema = z
  .object({
    analysisId: z.string().min(1).optional(),
    finalOutcome: z.enum(["agreement", "judgment", "extinct"]),
    actualAmountBrl: z.number().nonnegative().nullable().optional()
  })
  .superRefine((value, ctx) => {
    if (
      (value.finalOutcome === "agreement" || value.finalOutcome === "judgment") &&
      typeof value.actualAmountBrl !== "number"
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valor real obrigatorio para acordo ou processo.",
        path: ["actualAmountBrl"]
      });
    }
  });

export class CaseEffectivenessApi {
  constructor(
    private readonly caseEffectivenessUseCase: CaseEffectivenessUseCase
  ) {}

  register(app: FastifyInstance) {
    app.get("/:caseId", async (request, reply) => {
      const params = paramsSchema.parse(request.params);
      const effectiveness = await this.caseEffectivenessUseCase.getEffectiveness(
        params.caseId
      );

      if (!effectiveness) {
        return reply.code(404).send({
          message: "Monitoramento de efetividade nao encontrado."
        });
      }

      return reply.send(effectiveness);
    });

    app.post("/:caseId", async (request, reply) => {
      const params = paramsSchema.parse(request.params);
      const body = bodySchema.parse(request.body);

      try {
        const effectiveness =
          await this.caseEffectivenessUseCase.saveEffectiveness(params.caseId, body);

        return reply.code(201).send(effectiveness);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Erro ao salvar monitoramento de efetividade.";
        const statusCode =
          message === "Caso nao encontrado." || message === "Analise do caso nao encontrada."
            ? 404
            : message === "Monitoramento de efetividade ja registrado."
              ? 409
            : 400;

        return reply.code(statusCode).send({
          message
        });
      }
    });
  }
}
