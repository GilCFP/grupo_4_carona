import path from "node:path";
import { fileURLToPath } from "node:url";

import Fastify from "fastify";

import {
  getPolicyBootstrapState,
  isPolicyBootstrapReady,
  startPolicyBootstrap
} from "./bootstrap/policy-bootstrap.js";
import { prisma } from "./datasources/client.js";
import { registerBackendApis } from "./transportlayers/api/registerBackendApis.js";

const runtimeConfig = {
  host: process.env.NEW_BACKEND_HOST ?? process.env.HOST ?? "127.0.0.1",
  port: Number(process.env.NEW_BACKEND_PORT ?? 3001)
};

function isAllowedOrigin(origin: string) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

export function createNewBackendServer() {
  const app = Fastify({
    logger: false
  });

  void startPolicyBootstrap();

  app.addHook("onRequest", async (request, reply) => {
    const origin = request.headers.origin;

    if (origin && isAllowedOrigin(origin)) {
      reply.header("Access-Control-Allow-Origin", origin);
      reply.header("Vary", "Origin");
      reply.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
      );
      reply.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
    }

    if (request.method === "OPTIONS") {
      return reply.code(204).send();
    }
  });

  app.get("/health", async (_request, reply) => {
    const bootstrapState = getPolicyBootstrapState();

    if (!isPolicyBootstrapReady()) {
      return reply.code(503).send({
        status: "starting",
        service: "backend",
        policyBootstrap: bootstrapState
      });
    }

    return {
      status: "ok",
      service: "backend",
      policyBootstrap: bootstrapState
    };
  });

  registerBackendApis(app, "/api");

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });

  return app;
}

async function start(): Promise<void> {
  const app = createNewBackendServer();

  try {
    await app.listen({
      host: runtimeConfig.host,
      port: runtimeConfig.port
    });
    console.log(
      `New backend listening on http://${runtimeConfig.host}:${runtimeConfig.port}`
    );
  } catch (error) {
    console.error("Failed to start new backend server:", error);
    process.exitCode = 1;
    await app.close();
  }
}

const currentFilePath = fileURLToPath(import.meta.url);
const isMainModule =
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === currentFilePath;

if (isMainModule) {
  void start();
}
