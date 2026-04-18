# Setup e Execução

Este projeto foi preparado para subir com **um único comando**, usando Docker.

## Pré-requisitos

- Docker
- Docker Compose
- arquivo `.env` na raiz do projeto

Se ainda não existir:

```bash
cp .env.example .env
```

Preencha pelo menos:

```env
OPENAI_API_KEY=sua_chave
OPENAI_MODEL=gpt-4.1-mini
```

## Estrutura relevante

```text
grupo_4_carona/
├── backend/         # API principal e workflows
├── frontend/        # aplicação web
├── data/exemplos/   # CSVs usados no seed
├── prisma/          # schema Prisma
├── docker/          # Dockerfiles e entrypoint
└── package.json     # scripts principais
```

## Como rodar tudo

Na raiz do projeto:

```bash
npm run start:all
```

Esse comando:

1. builda as imagens Docker;
2. sobe o backend;
3. cria e popula o banco SQLite na primeira execução;
4. inicia o **workflow 1** automaticamente em background;
5. só libera o frontend quando o backend estiver realmente pronto.

## Importante: aguarde o workflow 1 terminar

Na subida, o backend executa o **workflow 1** para calibrar e publicar a policy inicial.

Isso pode demorar.

Durante esse período:

- o container do backend já está de pé;
- o endpoint `/health` responde `503`;
- o frontend **ainda não sobe**, porque depende do backend saudável.

Você deve esperar aparecer algo nessa linha dos logs:

```txt
Workflow1 concluído com sucesso. Policy publicada: ...
```

Depois disso:

- o `/health` passa a responder `200`;
- o frontend sobe;
- a aplicação fica pronta para uso.

## URLs

Quando tudo estiver pronto:

- Frontend: `http://localhost:4173`
- Backend health: `http://localhost:3001/health`

## Como acompanhar os logs

Se estiver rodando em foreground, basta observar o terminal do `npm run start:all`.

Se quiser rodar em background:

```bash
npm run start:all:detached
```

E depois acompanhar:

```bash
npm run docker:logs
```

## Banco e seed

Os CSVs usados pelo seed ficam em:

- `data/exemplos/Cópia de Hackaton_Enter_Base_Candidatos.xlsx - Subsídios disponibilizados.csv`
- `data/exemplos/Cópia de Hackaton_Enter_Base_Candidatos.xlsx - Resultados dos processos.csv`

Na primeira subida do backend:

- o schema Prisma é aplicado;
- os CSVs são importados;
- o banco é criado no volume Docker.

## Reset completo

Se quiser apagar banco, volumes e começar do zero:

```bash
docker compose down -v
npm run start:all
```

## Comandos úteis

Subir tudo:

```bash
npm run start:all
```

Subir tudo em background:

```bash
npm run start:all:detached
```

Ver logs:

```bash
npm run docker:logs
```

Parar containers:

```bash
npm run docker:down
```

Gerar Prisma Client:

```bash
npm run db:generate
```

Aplicar schema:

```bash
npm run db:push
```

Rodar seed manual:

```bash
npm run db:seed
```

## Observações

- O projeto não usa mais `apps/api`.
- O backend oficial está em `backend/`.
- O pacote compartilhado único está em `backend/packages/shared`.
- O frontend depende do backend saudável, então é normal ele demorar a subir enquanto o workflow 1 ainda está em execução.
