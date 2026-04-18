# Data

Arquivos de exemplo e seed do projeto.

## Estrutura

```text
data/
├── exemplos/
│   ├── Cópia de Hackaton_Enter_Base_Candidatos.xlsx - Subsídios disponibilizados.csv
│   └── Cópia de Hackaton_Enter_Base_Candidatos.xlsx - Resultados dos processos.csv
└── hackaton.sqlite
```

## Observações

- Os CSVs em `data/exemplos/` são usados no seed inicial do banco.
- O backend procura esses arquivos primeiro em `data/exemplos/`.
- Em fallback, o projeto ainda aceita arquivos com o mesmo sufixo na raiz.
- `hackaton.sqlite` é o banco local fora do Docker, quando aplicável.
