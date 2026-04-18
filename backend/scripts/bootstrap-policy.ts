import { prisma } from "../datasources/client.js";
import { startPolicyBootstrap } from "../bootstrap/policy-bootstrap.js";

startPolicyBootstrap()
  .catch((error) => {
    console.error("Falha ao inicializar bootstrap de policy:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
