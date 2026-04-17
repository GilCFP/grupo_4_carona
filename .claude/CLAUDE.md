# CLAUDE.md — HACKATON

Este arquivo fornece contexto ao Claude Code sobre o projeto **HACKATON**.
Documentação gerada automaticamente pela plataforma **Aris**.

---

## Project

**Nome:** HACKATON

**Objetivo de Negócio:**
Desenvolvimento de um sistema baseado em IA para auxiliar na decisão entre acordo e processo para casos legais, utilizando uma arquitetura multiagente. O projeto inclui a criação de um modelo/agente para simular e otimizar a política de acordos do banco, um copiloto para advogados e um dashboard para visualização. A política de acordos será um conjunto de regras (árvore de decisão) gerado e otimizado pelo sistema, fornecendo uma recomendação com probabilidade e justificativa. A solução deve ser adaptável a diferentes tipos de processos e incorporar análise histórica (jurisprudência).

**Stage Atual:** ARCHITECTURE
**Criado em:** 17/04/2026

---

## Stack

- _Stack não definida ainda._

---

## Architecture

O padrão arquitetural do projeto está detalhado em `docs/architecture/architecture-document.md`.

Decisões arquiteturais relevantes estão documentadas como ADRs em `docs/architecture/decisions/`. Consulte-as antes de propor mudanças estruturais.

---

## Key Decisions

As ADRs abaixo registram as decisões técnicas vinculantes do projeto:

- Consulte `docs/architecture/decisions/` para a lista completa de ADRs.
- Cada arquivo segue o padrão `ADR-NNN.md` com status, contexto, decisão e justificativa.

---

## Functional Scope

**Requisitos Funcionais Aceitos:** 11 RF(s)

A lista completa de requisitos e histórias de usuário está em:
- Requisitos Funcionais: [docs/specs/functional-requirements.md](docs/specs/functional-requirements.md)
- User Stories: [docs/specs/user-stories.md](docs/specs/user-stories.md)
- Tech Stack: [docs/architecture/tech-stack.md](docs/architecture/tech-stack.md)
- Documento de Arquitetura: [docs/architecture/architecture-document.md](docs/architecture/architecture-document.md)
- Briefing do Projeto: [docs/project/briefing.md](docs/project/briefing.md)
- Histórico de Stages: [docs/project/stages.md](docs/project/stages.md)
- Sprints Sugeridas: [docs/project/sprints.md](docs/project/sprints.md)

---

## Agents

Este repositório inclui agentes Claude Code pré-configurados em `.claude/agents/`:

- **developer.md** — Agente de desenvolvimento com contexto completo de stack e ADRs
- **qa.md** — Agente de QA com critérios de aceite das user stories
- **architect.md** — Agente arquiteto com todas as ADRs e princípios guia

---

## Commands

```bash
# TODO: adicione aqui os comandos de build, test e lint
```
