# Docker

Este projeto pode ser executado com Docker em **Windows**, **macOS** e **Linux** usando Docker Desktop ou Docker Engine + Docker Compose.

## O que sobe

O `docker-compose.yml` sobe dois serviços:

- `backend`
  roda o `new/backend` em `http://localhost:3001`
- `frontend`
  serve o frontend já buildado em `http://localhost:4173`

O frontend usa o `nginx` como servidor estático e faz proxy de:

- `/api/*` -> `backend:3001`
- `/health` -> `backend:3001/health`

Isso evita problemas de CORS no navegador.

## Banco SQLite e seed

O backend usa um volume Docker persistente para o SQLite:

- `sqlite-data`

Na **primeira subida**, o container:

1. cria o schema Prisma;
2. encontra automaticamente os CSVs no diretório raiz do projeto;
3. roda o seed no SQLite;
4. inicia a API.

Os arquivos usados no seed são:

- `*disponibilizados.csv`
- `*Resultados dos processos.csv`

Ou seja, as planilhas CSV da raiz do repositório entram na imagem e são usadas para popular o banco.

## Pré-requisitos

- Docker instalado
- Docker Compose disponível
- arquivo `.env` na raiz do projeto

Se necessário:

```bash
cp .env.example .env
```

Depois ajuste principalmente:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`

## Subir tudo

Na raiz do projeto:

```bash
docker compose up --build
```

## URLs

- Frontend: `http://localhost:4173`
- Backend health: `http://localhost:3001/health`

## Rodar em background

```bash
docker compose up --build -d
```

## Ver logs

```bash
docker compose logs -f
```

Logs de um serviço específico:

```bash
docker compose logs -f backend
docker compose logs -f frontend
```

## Parar

```bash
docker compose down
```

## Resetar o banco e reseedar

Se você quiser apagar o SQLite persistido e recriar tudo a partir das planilhas:

```bash
docker compose down -v
docker compose up --build
```

Outra opção é forçar o reset apenas do backend:

```bash
DB_FORCE_RESET=true docker compose up --build
```

## Volumes usados

- `sqlite-data`
  persiste o banco SQLite
- `agent-logs`
  persiste logs e traces dos agentes
- `temp-storage`
  persiste arquivos temporários do backend

## Observações

- O backend sobe em `0.0.0.0:3001` dentro do container.
- O frontend é buildado com `VITE_API_BASE_URL=/`, então as chamadas usam o mesmo host do `nginx`.
- O seed só roda automaticamente quando o arquivo do banco ainda não existe ou quando `DB_FORCE_RESET=true`.
