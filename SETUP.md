# Setup e Execução

> Preencha este arquivo com as instruções específicas da sua solução.

---

## Pré-requisitos

Liste aqui as dependências necessárias para rodar a solução:

- [ ] ...
- [ ] ...

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as variáveis necessárias:

```env
OPENAI_API_KEY=sua_chave_aqui
DATABASE_URL="file:../data/hackaton.sqlite"
```

> **Nunca commite o arquivo `.env` com credenciais reais.**  
> Um arquivo `.env.example` com as variáveis (sem valores) já está incluído neste repo.

## Instalação

```bash
npm install
npm run db:generate
npm run db:push
```

## Execução

```bash
npm run db:seed
```

## Preparação do SQLite

Para consolidar os dois CSVs do hackathon em um banco SQLite local com Prisma:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

Os principais artefatos ficam em:
- `prisma/schema.prisma`
- `src/database/importCsvs.js`

O processo cria o arquivo `data/hackaton.sqlite` com:
- `processes`
- `process_subsidies`
- `process_outcomes`
- `process_case_features`
- `vw_case_outcome_summary`
- `vw_subsidy_patterns`

Se quiser inspecionar visualmente o banco:

```bash
npm run db:studio
```

Observação: `npm run db:push` recria o arquivo SQLite local a partir do `prisma/schema.prisma`.

## Dados

Coloque os arquivos de dados fornecidos na pasta `data/`. Consulte [`data/README.md`](./data/README.md) para instruções detalhadas.

## Estrutura do Projeto

```
├── src/          # código-fonte
├── data/         # dados (não versionados — ver .gitignore)
├── docs/         # apresentação e documentação
├── .env.example  # variáveis de ambiente necessárias
├── SETUP.md      # este arquivo
└── README.md     # descrição do desafio
```
