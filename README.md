# Banco UFMG Legal Analytics

Plataforma de análise jurídica para o desafio da Enter AI, com:

- `frontend` em React + Vite + TypeScript
- `backend` em Node.js + Fastify + Prisma
- banco SQLite com seed a partir dos CSVs do projeto
- execução local simplificada com Docker

## Estrutura atual

```text
grupo_4_carona/
├── backend/                  # API principal, workflows, agentes, serviços e pacote shared interno
│   ├── agents/               # agentes usados nos workflows de policy e decisão
│   ├── configs/              # env, SQLite, storage local e policy estática
│   ├── datasources/          # acesso a Prisma, SQLite e storage local
│   ├── domain/               # regras de domínio e testes de lógica
│   ├── graphs/               # grafos/orquestração dos workflows
│   ├── packages/shared/      # único pacote compartilhado do projeto (@grupo4/shared)
│   ├── platform/             # integrações utilitárias de plataforma
│   ├── repositories/         # contratos e implementações SQLite
│   ├── scripts/              # push de schema, demo e bootstrap de policy
│   ├── services/             # serviços de policy calibration e case decision
│   ├── test-helpers/         # fixtures e helpers de teste
│   ├── tools/                # tools usadas pelos agentes
│   ├── transportlayers/api/  # rotas HTTP do backend
│   ├── usecase/              # casos de uso expostos pela API
│   ├── utils/                # utilitários gerais
│   ├── index.ts              # composition root do backend
│   ├── server.ts             # bootstrap HTTP principal
│   └── tsconfig.json         # TypeScript isolado do backend
├── frontend/                 # aplicação web do advogado
│   ├── src/components/       # layout e componentes reutilizáveis
│   ├── src/pages/            # Dashboard, Novo Processo, Resultado, Consultar
│   ├── src/services/         # integração com a API
│   ├── src/types/            # tipos do frontend
│   └── src/routes/           # rotas React Router
├── prisma/                   # schema Prisma usado pelo backend
├── scripts/database/         # seed CSV legado usado no bootstrap do banco
├── docker/                   # Dockerfiles, entrypoint e config nginx
├── data/                     # banco local e documentação de dados
├── docker-compose.yml        # sobe frontend + backend + volumes
├── package.json              # scripts raiz do projeto
└── DOCKER.md                 # detalhes extras de execução via Docker
```

## Como rodar tudo com um comando

### Pré-requisitos

- Docker
- Docker Compose
- arquivo `.env` na raiz

Se ainda não existir:

```bash
cp .env.example .env
```

Depois preencha ao menos:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`

### Comando único

Na raiz do projeto:

```bash
npm run start:all
```

Esse comando:

- builda as imagens
- sobe o `backend` em `http://localhost:3001`
- sobe o `frontend` em `http://localhost:4173`
- cria o banco SQLite no volume Docker na primeira execução
- aplica o schema Prisma
- roda o seed com os CSVs da raiz do projeto
- executa o workflow 1 para calibrar e publicar a policy inicial
- aplica fallback de policy estática se a calibração falhar

## URLs

- Frontend: `http://localhost:4173`
- Backend health: `http://localhost:3001/health`

## Scripts principais

### Execução

```bash
npm run start:all
```

Sobe tudo em foreground.

```bash
npm run start:all:detached
```

Sobe tudo em background.

```bash
npm run docker:down
```

Derruba os containers.

```bash
npm run docker:logs
```

Segue os logs dos serviços.

### Backend

```bash
npm run backend:api:start
```

Sobe apenas a API fora do Docker.

```bash
npm run backend:policy:ensure
```

Garante uma policy estática publicada.

```bash
npm run backend:demo:workflows
```

Roda o fluxo de demonstração do backend.

```bash
npm run backend:typecheck
```

Typecheck do backend.

```bash
npm run backend:test:integration
```

Teste de integração do backend.

### Banco

```bash
npm run db:generate
```

Gera o Prisma Client.

```bash
npm run db:push
```

Aplica o schema Prisma ao SQLite.

```bash
npm run db:seed
```

Importa os CSVs para o banco.

### Frontend

```bash
cd frontend
npm run dev
```

Roda o frontend em modo desenvolvimento.

```bash
cd frontend
npm run build
```

Build de produção do frontend.

## Fluxo de primeira execução

1. Configure `.env`.
2. Garanta que os CSVs do desafio estão na raiz do projeto.
3. Rode:

```bash
npm run start:all
```

4. Abra:

```text
http://localhost:4173
```

## Dados e seed

Os dois arquivos CSV usados no seed ficam em `data/exemplos/`:

- `data/exemplos/Cópia de Hackaton_Enter_Base_Candidatos.xlsx - Subsídios disponibilizados.csv`
- `data/exemplos/Cópia de Hackaton_Enter_Base_Candidatos.xlsx - Resultados dos processos.csv`

Na primeira subida do container do backend:

- o banco é criado em volume Docker
- o schema é aplicado
- os CSVs são importados

Se quiser recriar tudo do zero:

```bash
docker compose down -v
npm run start:all
```

## Stack

### Frontend

- React
- Vite
- TypeScript
- TailwindCSS
- React Router
- Recharts

### Backend

- Node.js
- Fastify
- Prisma
- SQLite
- OpenAI
- Zod

## Observações importantes

- O projeto não usa mais `apps/api`.
- O projeto usa apenas um pacote compartilhado: `backend/packages/shared`.
- O runtime principal está em [backend](/home/bernardo/Desktop/Hackton/grupo_4_carona/backend).
- O frontend já está integrado com as rotas reais do backend.

## Documentação complementar

- [DOCKER.md](./DOCKER.md)
- [backend/README.md](./backend/README.md)
- [backend/FRONTEND_ENDPOINTS.md](./backend/FRONTEND_ENDPOINTS.md)
- [frontend/README.md](./frontend/README.md)
