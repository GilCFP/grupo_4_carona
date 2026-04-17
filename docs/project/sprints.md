# Planejamento de Sprints — HACKATON

## Objetivo

Estruturar a entrega da solução até a arquitetura definida em [architecture-document.md](/Users/gil/projects/hackaton/grupo_4_carona/docs/architecture/architecture-document.md), cobrindo:
- ingestão e preparo de dados históricos;
- Workflow 1 de calibração da política;
- Workflow 2 de análise de caso e recomendação;
- dashboard, auditoria e ciclo de feedback.

## Premissas de Planejamento

- Cadência sugerida: **6 sprints de 1 semana** cada, adequada ao contexto de hackathon e ao stage atual de arquitetura.
- Stack alvo: **React + Vite**, **Node.js**, **LangGraph.js** e **SQLite**.
- A base histórica disponível agora é composta por dois arquivos complementares:
  - [Cópia de Hackaton_Enter_Base_Candidatos.xlsx - Subsídios disponibilizados.csv](/Users/gil/projects/hackaton/grupo_4_carona/Cópia%20de%20Hackaton_Enter_Base_Candidatos.xlsx%20-%20Subsídios%20disponibilizados.csv), com presença binária dos documentos de subsídio;
  - [Cópia de Hackaton_Enter_Base_Candidatos.xlsx - Resultados dos processos.csv](/Users/gil/projects/hackaton/grupo_4_carona/Cópia%20de%20Hackaton_Enter_Base_Candidatos.xlsx%20-%20Resultados%20dos%20processos.csv), com `UF`, assunto, resultado macro/micro, valor da causa e valor da condenação/indenização.
- As duas bases possuem **60 mil processos compatíveis pela chave `número do processo`**, o que viabiliza uma primeira camada analítica consolidada no SQLite já na Sprint 1.
- Ainda permanecem como lacunas relevantes dados operacionais de negociação, override do advogado, autos integrais e metadados mais ricos de jurisprudência.

## Estratégia de Entrega

- Primeiro tornar os dados confiáveis e consultáveis.
- Depois entregar um Workflow 1 simples, porém executável, para gerar uma primeira política versionada.
- Em seguida conectar o Workflow 2 ao copiloto do advogado.
- Fechar com observabilidade, dashboard, feedback e refinamentos.

## Sprint 1 — Fundação de Dados e Backlog Executável

**Objetivo:** transformar as duas bases recebidas em um ativo unificado e consultável.

**Escopo**
- Mapear os dois CSVs e documentar dicionário de dados consolidado.
- Definir schema inicial no SQLite para:
  - processos;
  - subsídios documentais;
  - resultados processuais;
  - tabela consolidada de features do caso;
  - versões de política;
  - logs de análise;
  - feedback e override.
- Criar pipeline inicial de ingestão `CSV -> SQLite`, com join por número do processo.
- Implementar validações de qualidade:
  - unicidade por número do processo;
  - presença de valores binários válidos;
  - consistência do join entre as duas fontes;
  - parsing monetário de valores em formato brasileiro;
  - contagem de missing/inconsistências.
- Formalizar gaps entre a base atual e os dados exigidos pela arquitetura:
  - histórico de acordo;
  - dados de negociação do advogado;
  - comarca;
  - metadados de jurisprudência.

**Entregáveis**
- Banco SQLite inicial populado.
- Script de carga reexecutável.
- Modelo relacional com tabela consolidada para consumo analítico.
- Documento de mapeamento da base e lacunas remanescentes.
- Backlog refinado por RF e US.

**RFs / USs priorizadas**
- RF-04, RF-07, RF-08.
- Base para US-05, US-07, US-08, US-13.

**Definition of Done**
- As duas bases são carregadas de ponta a ponta sem intervenção manual.
- Existe consulta unificada por número de processo, UF, resultado e presença de subsídio.
- A tabela consolidada está pronta para alimentar regras, simulações e recuperação de similares.
- As limitações remanescentes do dataset estão registradas de forma explícita.

## Sprint 2 — Núcleo do Backend e Orquestração Base

**Objetivo:** preparar a espinha dorsal técnica para os dois workflows.

**Escopo**
- Estruturar backend Node.js com módulos separados para API, banco e agentes.
- Configurar LangGraph.js com estado compartilhado mínimo.
- Criar endpoints iniciais:
  - `POST /api/analise-caso`;
  - `GET /api/politica-vigente`;
  - `POST /api/politicas/gerar`.
- Implementar registry de política com `policy_version`, status e timestamp.
- Definir contratos JSON de entrada e saída do Workflow 2:
  - ação recomendada;
  - confiança;
  - used_rules;
  - faixa de oferta;
  - justificativa.
- Expor consultas baseadas na tabela consolidada para acelerar:
  - busca de casos similares;
  - agregações por `UF`, `resultado_macro` e `resultado_micro`;
  - cálculo de perdas médias e taxa de êxito.
- Incluir logging estruturado por execução.

**Entregáveis**
- API funcional com mocks ou regras iniciais.
- Orquestrador base em LangGraph.
- Persistência de política e logs.

**RFs / USs priorizadas**
- RF-03, RF-04, RF-05, RF-11.
- Base para US-05, US-06, US-07, US-09, US-21.

**Definition of Done**
- Os endpoints respondem com payload padronizado.
- Cada execução gera trilha mínima de auditoria.
- A política vigente pode ser salva e recuperada do SQLite.

## Sprint 3 — Workflow 1 MVP: Geração de Política Offline

**Objetivo:** entregar a primeira versão utilizável da política de acordos.

**Escopo**
- Implementar pipeline semanal de calibração.
- Criar agentes/módulos equivalentes a:
  - minerador de sinais;
  - gerador de política;
  - avaliador econômico;
  - crítico de falhas.
- Aplicar separação `70/30` para treino e simulação, conforme ADR-005.
- Gerar política inicial em texto natural com regras derivadas da combinação entre:
  - presença de subsídios;
  - `UF`;
  - assunto e sub-assunto;
  - resultado histórico macro/micro;
  - valor da causa e valor de condenação.
- Versionar políticas e armazenar métricas comparativas.
- Calcular métricas offline de baseline:
  - taxa de êxito;
  - condenação média;
  - condenação mediana;
  - perda esperada por segmento.

**Entregáveis**
- Job offline executável.
- Política v1 persistida.
- Relatório comparando política candidata vs. baseline.

**RFs / USs priorizadas**
- RF-03, RF-08, RF-10.
- US-05, US-06, US-19, US-20.

**Definition of Done**
- O workflow gera uma `policy_version` nova sem edição manual.
- A política pode ser inspecionada pelo time.
- Há métrica objetiva de avaliação, mesmo que provisória.

## Sprint 4 — Workflow 2 MVP: Copiloto do Advogado

**Objetivo:** permitir análise de um caso com recomendação explicável.

**Escopo**
- Implementar intake do caso no frontend React.
- Criar fluxo online com:
  - extrator/preparador de entrada;
  - juiz de consistência;
  - recuperador de casos similares;
  - scorer econômico;
  - aplicador da política;
  - gerador de justificativa.
- Exibir no frontend:
  - recomendação principal;
  - probabilidade/confiança;
  - justificativa;
  - fatores considerados;
  - sugestão de faixa de acordo quando aplicável.
- Validar campos obrigatórios e inconsistências de entrada.
- Consultar a base consolidada para recuperar casos historicamente comparáveis por combinação de atributos.

**Entregáveis**
- Tela de submissão de caso.
- Card do advogado com recomendação estruturada.
- Integração real entre frontend, API e política vigente.

**RFs / USs priorizadas**
- RF-01, RF-02, RF-04, RF-05, RF-11.
- US-01, US-02, US-03, US-04, US-07, US-08, US-09, US-10, US-21, US-22.

**Definition of Done**
- Um usuário consegue submeter um caso e receber resposta completa.
- A resposta é rastreável até a política usada.
- O sistema rejeita entradas inválidas com mensagens claras.

## Sprint 5 — Dashboard, Auditoria e Feedback

**Objetivo:** fechar o loop operacional da arquitetura.

**Escopo**
- Construir dashboard administrativo com:
  - volume de análises;
  - taxa de recomendação por ação;
  - distribuição de confiança;
  - performance por versão de política;
  - uso de subsídios por caso;
  - taxa de êxito por `UF`, sub-assunto e combinação de subsídios;
  - impacto financeiro observado por segmento.
- Implementar registro de feedback do advogado.
- Implementar trilha de override da recomendação.
- Persistir eventos para auditoria e monitoramento de efetividade.
- Exibir comparativos simples entre políticas simuladas.

**Entregáveis**
- Dashboard inicial navegável.
- Tela ou ação de feedback no copiloto.
- Base de logs de override e aderência.

**RFs / USs priorizadas**
- RF-06, RF-09, RF-10.
- US-11, US-12, US-17, US-18, US-19, US-20.

**Definition of Done**
- O administrador acompanha a política vigente e sua adoção.
- O advogado consegue registrar concordância ou divergência.
- Os eventos ficam disponíveis para alimentar nova calibração.

## Sprint 6 — Robustez, Adaptação e Demo Final

**Objetivo:** consolidar a arquitetura e preparar a entrega final.

**Escopo**
- Refinar políticas por tipo de processo.
- Preparar suporte inicial a segmentação por UF/comarca quando os dados existirem.
- Melhorar explicabilidade e consistência das justificativas.
- Adicionar testes críticos de API, carga de dados e fluxo principal.
- Revisar segurança básica:
  - autenticação simples;
  - controle de acesso por perfil;
  - proteção das rotas sensíveis.
- Preparar roteiro de demonstração com cenários:
  - caso favorável a acordo;
  - caso favorável a processo;
  - comparação entre políticas.

**Entregáveis**
- Versão integrada de demonstração.
- Checklist de riscos conhecidos.
- Plano pós-hackathon para evolução de dados e modelos.

**RFs / USs priorizadas**
- RF-07, RF-08, RF-09, RF-10, RF-11.
- US-13, US-14, US-16, US-18, US-20, US-22.

**Definition of Done**
- A demo cobre o fluxo offline e o online.
- O sistema está minimamente testado nos caminhos críticos.
- As limitações remanescentes estão documentadas com próximos passos.

## Dependências Críticas

- Enriquecimento do dataset além dos dois CSVs para cumprir integralmente histórico de negociação, aderência real do advogado e metadados avançados de jurisprudência.
- Definição de política de autenticação e perfis de acesso.
- Critérios de negócio para medir sucesso econômico da política.
- Casos reais ou sintéticos para validação do copiloto ponta a ponta.

## Riscos e Mitigações

| Risco | Impacto | Mitigação |
|---|---|---|
| As duas bases não trazem histórico de negociação nem override | Alto | Criar modelo de eventos desde o início e popular com dados operacionais assim que surgirem |
| Não há comarca nem autos estruturados na base tabular | Médio | Trabalhar primeiro com `UF`, assunto, sub-assunto e subsídios; expandir após ingestão documental |
| Complexidade do multiagente exceder o tempo de hackathon | Médio | Implementar agentes como módulos simples primeiro e evoluir o grafo depois |
| Dashboard sem dados operacionais suficientes | Médio | Instrumentar logs desde a Sprint 2 |
| Recomendação sem explicabilidade adequada | Médio | Tornar `used_rules`, fatores e política versionada campos obrigatórios da resposta |

## Marco de MVP

O **MVP funcional** deve ser considerado atingido ao final da **Sprint 4**, quando houver:
- base ingerida e consultável;
- política vigente versionada;
- análise de caso via API;
- copiloto com recomendação, confiança e justificativa.

As **Sprints 5 e 6** elevam o MVP para a arquitetura-alvo com monitoramento, feedback, auditoria e refinamento.

---

_Status: **DRAFT** | Última atualização: 17/04/2026_
