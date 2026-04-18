import { backendCompositionRoot } from "../index.js";
import { STATIC_POLICY_VERSION } from "../configs/static-policy.js";
import { getActivePolicy } from "../repositories/sqlite/policy-repository.js";

export type PolicyBootstrapState = {
  status: "idle" | "checking" | "running" | "ready" | "failed";
  runId: string | null;
  policyVersion: string | null;
  error: string | null;
};

const state: PolicyBootstrapState = {
  status: "idle",
  runId: null,
  policyVersion: null,
  error: null
};

let bootstrapPromise: Promise<void> | null = null;

export function getPolicyBootstrapState(): PolicyBootstrapState {
  return { ...state };
}

export function isPolicyBootstrapReady(): boolean {
  return state.status === "ready";
}

async function runPolicyBootstrap(): Promise<void> {
  state.status = "checking";
  state.error = null;

  const activePolicy = await getActivePolicy();

  if (activePolicy && activePolicy.version !== STATIC_POLICY_VERSION) {
    state.status = "ready";
    state.policyVersion = activePolicy.version;
    console.log(
      `Policy real já encontrada: ${activePolicy.version}. Workflow1 não será executado.`
    );
    return;
  }

  const runId = `bootstrap-policy-${Date.now()}`;
  state.status = "running";
  state.runId = runId;

  if (activePolicy?.version === STATIC_POLICY_VERSION) {
    console.log(
      `Policy estática detectada (${STATIC_POLICY_VERSION}). Executando workflow1 para substituí-la...`
    );
  } else {
    console.log(`Nenhuma policy publicada encontrada. Executando workflow1 (${runId})...`);
  }

  const result = await backendCompositionRoot.usecases.policyGeneratorUseCase.execute({
    runId
  });

  if (result.state.errors.length > 0 || !result.state.publishedPolicy) {
    throw new Error(
      result.state.errors.join(" | ") || "Workflow1 finalizou sem publicar uma policy."
    );
  }

  state.status = "ready";
  state.policyVersion = result.state.publishedPolicy.version;
  state.error = null;

  console.log(
    `Workflow1 concluído com sucesso. Policy publicada: ${result.state.publishedPolicy.version}.`
  );
}

export function startPolicyBootstrap(): Promise<void> {
  if (bootstrapPromise) {
    return bootstrapPromise;
  }

  bootstrapPromise = runPolicyBootstrap()
    .catch((error) => {
      state.status = "failed";
      state.error =
        error instanceof Error ? error.message : "Falha desconhecida no bootstrap da policy.";
      console.error(`Workflow1 falhou no bootstrap: ${state.error}`);
    })
    .finally(() => {
      bootstrapPromise = null;
    });

  return bootstrapPromise;
}
