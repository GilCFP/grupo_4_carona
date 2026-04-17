# User Stories

### RF-03: Previsão de Resultados Processuais

#### US-01: Visualização de Resultados Probabilísticos de Processo

> Como Advogado, quero visualizar os resultados probabilísticos de um processo legal específico, para que para tomar decisões mais informadas sobre a estratégia do caso..

**Critérios de Aceite:**
  - Dado que um caso legal foi inserido no sistema, quando o advogado solicita a análise, então o sistema exibe as probabilidades para cada um dos resultados possíveis (extinção, improcedência, procedência parcial, procedência, acordo).
  - Dado que o sistema previu os resultados, quando o advogado analisa as probabilidades, então ele consegue identificar o cenário mais provável para o desfecho do processo.

#### US-02: Detalhamento dos Cenários de Resultado Processual

> Como Advogado, quero compreender os detalhes de cada cenário de resultado processual previsto, para que para avaliar as implicações financeiras e estratégicas de cada desfecho..

**Critérios de Aceite:**
  - Dado que o sistema exibiu os resultados probabilísticos, quando o advogado seleciona um tipo de resultado (ex: "procedência parcial"), então o sistema apresenta informações adicionais sobre o que esse resultado implica.
  - Dado que um resultado de "acordo" foi previsto, quando o advogado visualiza os detalhes, então o sistema indica que este é um dos possíveis desfechos, conforme a descrição do RF.

---

### RF-04: Geração de Proposta de Acordo

#### US-03: Sugestão de Valor de Indenização para Acordo

> Como Advogado, quero receber uma sugestão de valor de indenização para um acordo, para que para ter um ponto de partida embasado em dados para negociações..

**Critérios de Aceite:**
  - Dado que o sistema recomendou "acordo" para um caso, quando o advogado visualiza a recomendação, então o sistema exibe um valor de indenização sugerido.
  - Dado que um valor de indenização foi sugerido, quando o advogado analisa a proposta, então ele compreende que o valor é derivado de dados históricos e tendências.

#### US-04: Ajuste da Proposta de Acordo Baseado em Parâmetros

> Como Advogado, quero ajustar os parâmetros que influenciam a proposta de indenização, para que para personalizar a oferta de acordo de acordo com a estratégia do caso e o conhecimento específico..

**Critérios de Aceite:**
  - Dado que uma proposta de indenização foi gerada, quando o advogado modifica um parâmetro relevante do caso (ex: valor da causa, tempo de processo), então o sistema recalcula e atualiza o valor sugerido.
  - Dado que o sistema gera propostas de indenização, quando o advogado revisa a sugestão, então ele pode aceitar ou refinar o valor para a negociação.

---

### RF-05: Otimização da Política de Acordos

#### US-05: Geração Automática de Política de Acordos

> Como Administrador do Sistema / Analista de Políticas, quero gerar automaticamente uma política de acordos para o banco, para que para ter uma política de decisão consistente e baseada em dados para casos legais..

**Critérios de Aceite:**
  - Dado que dados históricos de processos e acordos estão disponíveis, quando o administrador inicia o processo de geração de política, então o sistema cria uma política de acordos em formato de árvore de decisão.
  - Dado que uma política de acordos foi gerada, quando o administrador a revisa, então ele pode visualizar as regras que compõem a árvore de decisão.

#### US-06: Otimização Contínua da Política de Acordos

> Como Administrador do Sistema / Analista de Políticas, quero otimizar a política de acordos existente, para que para garantir que a política se mantenha eficaz e adaptada às novas tendências e resultados..

**Critérios de Aceite:**
  - Dado que uma política de acordos está ativa e novos dados foram processados, quando o administrador executa a otimização, então o sistema ajusta as regras da árvore de decisão para melhorar a performance.
  - Dado que a política foi otimizada, quando o administrador compara as versões, então ele consegue identificar as mudanças e melhorias implementadas pelo sistema.

---

### RF-01: Análise de Casos Legais

#### US-07: Entrada de Dados de Casos Legais para Análise

> Como Advogado, quero inserir os dados de um caso legal específico no sistema, para que para que o sistema possa realizar a análise e fornecer recomendações..

**Critérios de Aceite:**
  - Dado que o advogado acessa a interface de entrada de dados, quando ele preenche os campos com as informações do caso (ex: tipo de processo, valor da causa, partes envolvidas), então o sistema armazena esses dados para processamento.
  - Dado que os dados de um caso foram inseridos, quando o advogado confirma a entrada, então o sistema valida os dados e os prepara para a análise de decisão.

#### US-08: Validação e Processamento de Dados de Entrada

> Como Advogado, quero garantir que os dados do caso legal sejam válidos e completos, para que para que a análise do sistema seja precisa e confiável..

**Critérios de Aceite:**
  - Dado que o advogado inseriu os dados de um caso, quando ele tenta submeter o caso para análise, então o sistema verifica a completude e o formato dos dados, alertando sobre inconsistências.
  - Dado que os dados de entrada foram validados com sucesso, quando o sistema os processa, então ele os prepara para serem utilizados pelos modelos de IA e agentes de decisão.

---

### RF-02: Recomendação de Acordo ou Processo

#### US-09: Obtenção de Recomendação de Acordo ou Processo

> Como Advogado, quero receber uma recomendação clara entre acordo ou processo para um caso específico, para que para auxiliar na tomada de decisão estratégica e reduzir a incerteza..

**Critérios de Aceite:**
  - Dado que os dados de um caso legal foram processados, quando o advogado solicita a recomendação, então o sistema exibe "Acordo" ou "Processo" como a decisão principal.
  - Dado que uma recomendação foi gerada, quando o advogado a visualiza, então ele também vê a probabilidade de sucesso associada a essa recomendação.

#### US-10: Análise da Probabilidade de Sucesso da Recomendação

> Como Advogado, quero entender a probabilidade de sucesso associada à recomendação, para que para avaliar o risco e o potencial retorno da estratégia sugerida..

**Critérios de Aceite:**
  - Dado que o sistema recomendou "Acordo" ou "Processo", quando o advogado analisa a probabilidade de sucesso, então ele pode usar essa métrica para ponderar a decisão.
  - Dado que a probabilidade de sucesso é exibida, quando o advogado compara diferentes cenários, então ele pode identificar qual opção oferece maior chance de um resultado favorável.

---

### RF-07: Visualização de Dados e Resultados

#### US-11: Visualização de Dashboard de Performance Geral

> Como Administrador do Sistema / Analista de Políticas, quero visualizar um dashboard intuitivo com métricas de desempenho e recomendações, para que para monitorar a eficácia do sistema e a performance das políticas de acordo..

**Critérios de Aceite:**
  - Dado que o administrador acessa o sistema, quando ele navega para a seção de dashboard, então o sistema exibe um painel com as principais recomendações e métricas de desempenho agregadas.
  - Dado que o dashboard está visível, quando o administrador o analisa, então ele consegue identificar tendências e a performance geral do sistema.

#### US-12: Monitoramento da Performance da Política de Acordos

> Como Administrador do Sistema / Analista de Políticas, quero monitorar a performance da política de acordos do banco, para que para avaliar a eficácia das regras de decisão e identificar oportunidades de otimização..

**Critérios de Aceite:**
  - Dado que o dashboard está ativo, quando o administrador visualiza a seção de performance da política de acordos, então o sistema exibe gráficos e indicadores sobre a taxa de sucesso e o impacto financeiro dos acordos.
  - Dado que métricas de performance são apresentadas, quando o administrador as compara com metas, então ele pode determinar se a política de acordos está atingindo os objetivos esperados.

---

### RF-08: Adaptação a Diferentes Processos

#### US-13: Configuração de Tipos de Processos Legais

> Como Administrador do Sistema, quero configurar o sistema para diferentes tipos de processos legais, para que para que a solução possa ser aplicada a uma variedade de casos e contextos jurídicos..

**Critérios de Aceite:**
  - Dado que o administrador acessa as configurações do sistema, quando ele define um novo tipo de processo legal (ex: "Empréstimo Consignado", "Dívida Bancária"), então o sistema registra essa categoria.
  - Dado que um novo tipo de processo foi configurado, quando o sistema processa casos, então ele pode associar os dados de entrada a essa categoria específica.

#### US-14: Geração de Políticas Específicas por Tipo de Processo

> Como Administrador do Sistema / Analista de Políticas, quero gerar políticas de acordo específicas para cada tipo de processo legal, para que para garantir que as recomendações sejam altamente relevantes e eficazes para o contexto particular de cada caso..

**Critérios de Aceite:**
  - Dado que diferentes tipos de processos foram configurados, quando o administrador solicita a geração de uma política, então o sistema permite selecionar o tipo de processo para o qual a política será otimizada.
  - Dado que uma política específica foi gerada, quando o sistema a aplica, então as recomendações de acordo ou processo consideram as particularidades daquele tipo de processo.

---

### RF-09: Análise de Jurisprudência Histórica

#### US-16: Análise de Variações Regionais na Jurisprudência

> Como Advogado / Analista de Políticas, quero considerar variações de jurisprudência por estado e comarca, para que para que as recomendações sejam contextualizadas e reflitam as particularidades jurídicas regionais..

**Critérios de Aceite:**
  - Dado que os dados de um caso incluem informações de estado e comarca, quando o sistema gera uma recomendação, então ele ajusta a análise com base na jurisprudência específica daquela localidade.
  - Dado que a análise regional é aplicada, quando o advogado revisa a justificativa da recomendação, então ele pode identificar como a jurisprudência local influenciou a decisão.

---

### RF-10: Captura de Feedback do Usuário

#### US-17: Registro de Feedback do Advogado sobre Recomendações

> Como Advogado, quero fornecer feedback sobre as recomendações de acordo ou processo, para que para contribuir com o aprimoramento contínuo do modelo de IA e suas futuras recomendações..

**Critérios de Aceite:**
  - Dado que uma recomendação foi gerada, quando o advogado visualiza a recomendação, então ele tem a opção de registrar seu feedback (ex: "concordo", "discordo", "sugestão de ajuste").
  - Dado que o feedback foi registrado, quando o advogado submete, então o sistema armazena essa informação para análise e refinamento do modelo.

#### US-18: Utilização do Feedback para Refinamento do Modelo

> Como Administrador do Sistema / Engenheiro de IA, quero utilizar o feedback dos advogados para refinar o modelo de IA, para que para melhorar a precisão e a relevância das recomendações ao longo do tempo..

**Critérios de Aceite:**
  - Dado que feedback de advogados foi coletado, quando o engenheiro de IA executa o processo de retreinamento, então o sistema incorpora esse feedback para ajustar os pesos e regras do modelo.
  - Dado que o modelo foi refinado, quando novas recomendações são geradas, então elas refletem os aprendizados obtidos com o feedback anterior.

---

### RF-11: Simulação de Políticas Dinâmicas

#### US-19: Simulação de Políticas de Acordo em Cenários Hipotéticos

> Como Administrador do Sistema / Analista de Políticas, quero simular o impacto de diferentes políticas de acordo, para que para avaliar cenários e otimizar a política antes de sua implementação real, minimizando riscos..

**Critérios de Aceite:**
  - Dado que uma política de acordos foi definida (ou está em rascunho), quando o administrador inicia uma simulação, então o sistema executa a política contra um conjunto de dados históricos ou hipotéticos.
  - Dado que a simulação foi concluída, quando o administrador analisa os resultados, então ele visualiza métricas como taxa de acordos, valores médios e impacto financeiro.

#### US-20: Comparação de Desempenho entre Políticas Simuladas

> Como Administrador do Sistema / Analista de Políticas, quero comparar o desempenho de múltiplas políticas de acordo simuladas, para que para identificar a política mais eficaz e vantajosa para o banco..

**Critérios de Aceite:**
  - Dado que várias simulações de políticas foram executadas, quando o administrador solicita uma comparação, então o sistema apresenta um relatório comparativo das métricas de desempenho de cada política.
  - Dado que as políticas são comparadas, quando o administrador seleciona a melhor opção, então ele pode decidir qual política será implementada ou otimizada.

---

### RF-12: Justificativa da Recomendação

#### US-21: Visualização da Justificativa da Recomendação

> Como Advogado, quero visualizar uma justificativa clara e compreensível para cada recomendação, para que para entender o raciocínio por trás da sugestão e embasar sua própria decisão..

**Critérios de Aceite:**
  - Dado que uma recomendação de "Acordo" ou "Processo" foi gerada, quando o advogado clica na recomendação, então o sistema exibe uma explicação detalhada dos fatores que levaram a essa decisão.
  - Dado que a justificativa é apresentada, quando o advogado a lê, então ele consegue compreender os principais pontos de dados e regras que influenciaram a recomendação.

#### US-22: Detalhamento dos Fatores Influenciadores na Justificativa

> Como Advogado, quero entender quais fatores específicos do caso influenciaram a recomendação, para que para validar a análise do sistema e identificar pontos críticos para a estratégia legal..

**Critérios de Aceite:**
  - Dado que a justificativa é exibida, quando o advogado a analisa, então o sistema destaca os dados de entrada do caso (ex: tipo de juiz, histórico de acordos similares) que tiveram maior peso na decisão.
  - Dado que os fatores influenciadores são detalhados, quando o advogado os compara com seu conhecimento do caso, então ele pode avaliar a coerência da recomendação.

---

_Última atualização: 17/04/2026_
