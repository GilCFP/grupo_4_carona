import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  DEFAULT_POLICY_MAX_OFFER,
  DEFAULT_POLICY_MIN_OFFER,
  OFFER_FACTORS_BY_RISK_BAND
} from "@grupo4/shared";

import {
  STATIC_POLICY_NAME,
  STATIC_POLICY_VERSION,
  staticPolicyRules,
  staticPolicyScorecard
} from "../configs/static-policy.js";
import { prisma } from "../datasources/client.js";
import {
  getActivePolicy,
  getPolicyByVersion,
  publishPolicy
} from "../repositories/sqlite/policy-repository.js";

export async function ensureStaticPolicy() {
  const activePolicy = await getActivePolicy();

  if (activePolicy) {
    console.log(
      `Policy publicada já encontrada: ${activePolicy.version}. Nenhuma ação necessária.`
    );
    return;
  }

  const existingStaticPolicy = await getPolicyByVersion(STATIC_POLICY_VERSION);

  if (existingStaticPolicy) {
    await prisma.policy.update({
      where: {
        version: STATIC_POLICY_VERSION
      },
      data: {
        status: "published",
        publishedAt: new Date()
      }
    });

    console.log(
      `Policy estática existente reaproveitada e publicada: ${STATIC_POLICY_VERSION}.`
    );
    return;
  }

  await publishPolicy({
    version: STATIC_POLICY_VERSION,
    name: STATIC_POLICY_NAME,
    processType: "Nao reconhece operacao",
    minOffer: DEFAULT_POLICY_MIN_OFFER,
    maxOffer: DEFAULT_POLICY_MAX_OFFER,
    config: {
      source: "static-bootstrap",
      generatedAt: new Date().toISOString(),
      lawyerSummary:
        "Policy estática de bootstrap para manter o backend operacional sem depender da calibração offline em cada reinício.",
      offerFactorsByRiskBand: OFFER_FACTORS_BY_RISK_BAND
    },
    rules: staticPolicyRules,
    scorecard: staticPolicyScorecard
  });

  console.log(`Policy estática criada e publicada: ${STATIC_POLICY_VERSION}.`);
}

const isDirectExecution = process.argv[1]
  ? path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

if (isDirectExecution) {
  ensureStaticPolicy()
    .catch((error) => {
      console.error("Falha ao garantir policy estática:", error);
      process.exitCode = 1;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
