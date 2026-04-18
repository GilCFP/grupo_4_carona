# Architecture Flow

A integração atual do `new/backend` está organizada a partir do composition root em `index.ts`, das rotas em `transportlayers/api/registerBackendApis.ts` e dos grafos em `graphs/policy-calibration-graph.ts` e `graphs/case-decision-graph.ts`.

## Mermaid

```mermaid
flowchart TD
    F[Front / Client] --> PGAPI["PolicyGeneratorApi\nPOST /api/policy-generator/generate"]
    F --> CAAPI["CaseAnalyzerApi\nPOST /api/case-analyzer/submit\nGET /api/case-analyzer/result"]
    F --> DAPI["DashboardApi\nGET /api/dashboard/analytics"]
    F --> SAPI["StatusApi\nGET /api/status"]
    F --> TAPI["TraceApi\nGET /api/traces/..."]

    subgraph CORE["Composition Root / Use Cases"]
      PGAPI --> PGUC["PolicyGeneratorUseCase"]
      CAAPI --> CAUC["CaseAnalyzerUseCase"]
      DAPI --> DUC["DashboardUseCase"]
      SAPI --> SUC["StatusUseCase"]
    end

    subgraph INFRA["Configs / Datasources / Repositories"]
      SQLITE["SQLiteConfig"]
      LOCAL["LocalStorageConfig"]
      SQLDS["SQLiteDataSource"]
      LOCDS["LocalStorageDataSource"]
      DB[(SQLite / Prisma)]
      TEMP["/temp local files"]
      SQLITE --> SQLDS
      LOCAL --> LOCDS
      SQLDS --> DB
      LOCDS --> TEMP
    end

    PGUC --> PGA["PolicyGeneratorAgent"]
    PGUC --> PGC["PolicyCritiqueAgent"]
    PGA --> SQLDS
    PGC --> PGSUM["Resumo final da calibration"]

    CAUC --> CAA["CaseAnalyzerAgent"]
    CAUC --> LOCDS
    CAUC --> SQLDS
    CAA --> SQLDS

    PGA --> W1START
    CAA --> W2START

    subgraph W1["Workflow 1 - Policy Calibration"]
      W1START["runPolicyCalibration"] --> W1A["loadHistoricalData"]
      W1A --> W1B["splitHistoricalData"]
      W1B --> W1C["buildFeatureBuckets"]
      W1C --> W1D["PolicyToolResearchPlannerAgent\nplanPolicyToolResearch"]
      W1D --> W1E{"tool calls?"}
      W1E -- sim --> W1F["executePolicyResearchTools"]
      W1F --> W1G["summarizePolicyToolResearch"]
      W1E -- nao --> W1G
      W1G --> W1H["PolicyRulesAgent\nproposePolicyRules"]
      W1H --> W1I["PolicyCritiqueAgent\ncritiquePolicyRules"]
      W1I --> W1J["scorePolicyRules"]
      W1J --> W1K{"score >= 80%?"}
      W1K -- nao --> W1L["prepareRetry"]
      W1L --> W1D
      W1K -- sim --> W1M["finalizePolicyCandidate"]
      W1M --> W1N["PolicyExplainForLawyerAgent"]
      W1N --> W1O["publishPolicyVersion"]
      W1O --> W1END["policy published"]
    end

    subgraph W2["Workflow 2 - Case Decision"]
      W2START["runCaseDecision"] --> W2A["ingestCase"]
      W2A --> W2B["ExtractFactsAgent"]
      W2B --> W2C["ExtractFactsCritiqueAgent"]
      W2C --> W2D["finalizeFacts"]
      W2D --> W2E["retrieveSimilarCases"]
      W2E --> W2F["RiskAnalyzerAgent"]
      W2F --> W2G{"fast mode?"}
      W2G -- nao --> W2H["DecisionToolResearchPlannerAgent"]
      W2H --> W2I{"tool calls?"}
      W2I -- sim --> W2J["executeDecisionResearchTools"]
      W2J --> W2K["summarizeDecisionToolResearch"]
      W2I -- nao --> W2K
      W2G -- sim --> W2L["DecisionProposerAgent"]
      W2K --> W2L
      W2L --> W2M["DecisionCritiqueAgent"]
      W2M --> W2N["finalizeDecision"]
      W2N --> W2O["ExplainForLawyerAgent"]
      W2O --> W2P["persistDecision"]
      W2P --> W2END["analysis stored"]
    end

    TAPI --> DB
```

## Descrição Dos Agentes

- `PolicyGeneratorAgent`: dispara o `workflow1` completo e delega a calibração da policy ao grafo offline.
- `PolicyRulesAgent`: gera as regras candidatas da policy a partir dos buckets históricos e do contexto de tools.
- `PolicyCritiqueAgent`: critica as regras da policy e também resume o resultado final da calibração.
- `PolicyToolResearchPlannerAgent`: decide quais tools de banco consultar antes de propor ou criticar a policy.
- `PolicyExplainForLawyerAgent`: transforma a policy final em linguagem natural para consumo do advogado.
- `CaseAnalyzerAgent`: carrega a policy ativa, valida o caso e dispara o `workflow2`.
- `ExtractFactsAgent`: extrai fatos estruturados dos documentos do caso.
- `ExtractFactsCritiqueAgent`: revisa os fatos extraídos, aponta inconsistências e reforça governança.
- `RiskAnalyzerAgent`: calcula o risco combinando histórico similar com prior documental, evitando o fallback cego de `50%`.
- `DecisionToolResearchPlannerAgent`: decide se vale consultar tools antes de propor a decisão do caso.
- `DecisionProposerAgent`: propõe a decisão inicial com base em policy, fatos, risco e tools.
- `DecisionCritiqueAgent`: critica a decisão proposta antes da finalização.
- `ExplainForLawyerAgent`: gera a explicação final em linguagem natural para o advogado.

## Descrição Das Camadas Conectadas

- `PolicyGeneratorApi`: porta HTTP do `workflow1`.
- `CaseAnalyzerApi`: porta HTTP do `workflow2`, inclusive com `GET` do resultado final.
- `DashboardApi`: consolida métricas para o front.
- `StatusApi`: consulta o estado do caso.
- `TraceApi`: expõe os traces JSON e HTML dos workflows.
- `PolicyGeneratorUseCase`: orquestra geração e crítica ou resumo da policy.
- `CaseAnalyzerUseCase`: cria ou reutiliza caso, salva documentos, chama análise e expõe o resultado.
- `SQLiteDataSource`: ponte entre use cases ou agentes e o banco SQLite com Prisma.
- `LocalStorageDataSource`: salva os arquivos temporários enviados no fluxo do caso.
