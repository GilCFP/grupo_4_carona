# Sprints do Projeto — HACKATON

> Documento gerado automaticamente pela plataforma **Aris** com base nos requisitos aceitos e contexto do projeto.
> Revise e ajuste conforme necessário antes de usar como planejamento oficial.

---

## Sprint 1 — Fundação e Ingestão de Dados

**Objetivo:** Estabelecer a infraestrutura base, configurar o ambiente de desenvolvimento e implementar a ingestão inicial de dados de casos legais.

### Backend / API
- [ ] Configuração inicial do projeto e ambiente de desenvolvimento. **S**
- [ ] Definição e criação do esquema do banco de dados para casos legais e jurisprudência. **M**
- [ ] Desenvolvimento da API para entrada de dados de casos legais (RF-04, US-07). **M**
- [ ] Implementação da validação e processamento inicial dos dados de entrada (US-08). **M**
- [ ] Criação de endpoints para gerenciamento de tipos de processos (RF-07, US-13). **S**

### Frontend / UI
- [ ] Configuração inicial do projeto frontend e ambiente. **S**
- [ ] Desenvolvimento da tela de entrada de dados de casos legais (US-07). **M**

### Integração / Infra
- [ ] Configuração de repositório de código e CI/CD básico. **S**
- [ ] Setup inicial de ambiente de desenvolvimento/homologação. **S**

---

## Sprint 2 — Modelo de Previsão e Geração de Política Inicial

**Objetivo:** Desenvolver o modelo central de previsão de resultados processuais e a lógica inicial para geração automática da política de acordos.

### Backend / API
- [ ] Desenvolvimento do modelo de IA para previsão de resultados processuais (RF-01, US-01, US-02). **L**
- [ ] Implementação da lógica para geração automática da política de acordos (árvore de decisão) (RF-03, US-05). **L**
- [ ] Criação de endpoint para receber dados de caso e retornar previsão de resultados. **M**
- [ ] Integração inicial de dados históricos/jurisprudência (RF-08) para o modelo de previsão. **M**

### Frontend / UI
- [ ] Desenvolvimento da visualização dos resultados probabilísticos de um processo (US-01). **M**
- [ ] Criação da interface para detalhamento dos cenários de resultado processual previsto (US-02). **M**

### Integração / Infra
- [ ] Configuração de ambiente para treinamento e inferência do modelo de IA. **M**

---

## Sprint 3 — Copiloto: Recomendação e Justificativa

**Objetivo:** Implementar as funcionalidades do copiloto para advogados, fornecendo recomendações claras, probabilidades e justificativas iniciais.

### Backend / API
- [ ] Desenvolvimento da lógica para recomendação de acordo ou processo com probabilidade (RF-05, US-09, US-10). **M**
- [ ] Implementação da lógica inicial para justificativa da recomendação (RF-11, US-21). **M**
- [ ] Criação de endpoint para receber dados de caso e retornar recomendação e justificativa. **M**

### Frontend / UI
- [ ] Desenvolvimento da interface para exibir a recomendação de acordo ou processo (US-09). **M**
- [ ] Implementação da visualização da probabilidade de sucesso da recomendação (US-10). **M**
- [ ] Criação da interface para visualizar a justificativa da recomendação (US-21). **M**
- [ ] Desenvolvimento da interface para detalhamento dos fatores influenciadores na justificativa (US-22). **M**

### Integração / Infra
- [ ] Otimização de performance da API de inferência do modelo. **S**

---

## Sprint 4 — Copiloto: Proposta de Acordo e Adaptação de Política

**Objetivo:** Aprimorar o copiloto com sugestões de valor de indenização e permitir a adaptação do sistema a diferentes tipos de processos e jurisprudência regional.

### Backend / API
- [ ] Desenvolvimento da lógica para geração de proposta de acordo e valor de indenização (RF-02, US-03). **L**
- [ ] Implementação da funcionalidade de ajuste de parâmetros para a proposta de acordo (US-04). **M**
- [ ] Aprimoramento da integração de jurisprudência para considerar variações regionais (RF-08, US-16). **M**
- [ ] Desenvolvimento da lógica para geração de políticas específicas por tipo de processo (RF-07, US-14). **M**

### Frontend / UI
- [ ] Desenvolvimento da interface para exibir a sugestão de valor de indenização (US-03). **M**
- [ ] Criação da interface para ajuste dos parâmetros da proposta de acordo (US-04). **M**
- [ ] Desenvolvimento da interface para configuração de tipos de processos legais (US-13). **M**
- [ ] Implementação da visualização de políticas específicas por tipo de processo (US-14). **M**

### Integração / Infra
- [ ] Refinamento da pipeline de dados para incluir dados de jurisprudência regional. **M**

---

## Sprint 5 — Otimização de Política, Simulação e Dashboard

**Objetivo:** Implementar a otimização contínua da política de acordos, a simulação de políticas dinâmicas e o dashboard de visualização de performance.

### Backend / API
- [ ] Desenvolvimento da lógica para otimização contínua da política de acordos (RF-03, US-06). **L**
- [ ] Implementação do motor de simulação de políticas dinâmicas (RF-10, US-19). **L**
- [ ] Criação de endpoints para o dashboard: métricas de desempenho, recomendações, performance da política (RF-06, US-11, US-12). **M**
- [ ] Desenvolvimento da lógica para comparação de desempenho entre políticas simuladas (US-20). **M**

### Frontend / UI
- [ ] Desenvolvimento do dashboard intuitivo com métricas de desempenho geral (US-11). **L**
- [ ] Implementação da visualização do monitoramento da performance da política de acordos (US-12). **M**
- [ ] Criação da interface para simulação de políticas de acordo em cenários hipotéticos (US-19). **M**
- [ ] Desenvolvimento da interface para comparação de desempenho entre políticas simuladas (US-20). **M**

### Integração / Infra
- [ ] Configuração de ferramentas de monitoramento e logging para o sistema. **S**

---

## Sprint 6 — Loop de Feedback, Refinamento e Preparação para Go-live

**Objetivo:** Integrar o mecanismo de feedback do usuário, refinar os modelos com base nesse feedback e preparar o sistema para o lançamento em produção.

### Backend / API
- [ ] Desenvolvimento da API para captura de feedback do advogado sobre as recomendações (RF-09, US-17). **M**
- [ ] Implementação da lógica para utilização do feedback no refinamento contínuo do modelo de IA (US-18). **L**
- [ ] Otimização final dos modelos de IA e políticas de acordo. **M**

### Frontend / UI
- [ ] Desenvolvimento da interface para registro de feedback do advogado sobre as recomendações (US-17). **M**
- [ ] Ajustes finos na UI/UX com base em testes e feedback interno. **M**

### Integração / Infra
- [ ] Execução de testes de integração e ponta a ponta completos. **L**
- [ ] Testes de performance e segurança. **M**
- [ ] Preparação da documentação técnica e de usuário. **M**
- [ ] Plano de Go-live e configuração do ambiente de produção. **M**
- [ ] Treinamento inicial para usuários-chave. **S**

---

_Gerado em: 17/04/2026_
