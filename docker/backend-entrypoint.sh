#!/bin/sh
set -eu

APP_DIR="/app"
DB_FILE="${SQLITE_DB_PATH:-/app/data/hackaton.sqlite}"
FORCE_RESET="${DB_FORCE_RESET:-false}"

find_seed_file() {
  suffix="$1"
  find "$APP_DIR/data/exemplos" "$APP_DIR" -maxdepth 1 -type f -name "*$suffix" 2>/dev/null | head -n 1
}

SUBSIDIES_CSV_PATH="${SUBSIDIES_CSV_PATH:-$(find_seed_file "disponibilizados.csv")}"
OUTCOMES_CSV_PATH="${OUTCOMES_CSV_PATH:-$(find_seed_file "Resultados dos processos.csv")}"

mkdir -p "$(dirname "$DB_FILE")" "$APP_DIR/logs/agent-traces" "$APP_DIR/temp"

if [ "$FORCE_RESET" = "true" ] || [ "$FORCE_RESET" = "1" ]; then
  echo "DB_FORCE_RESET habilitado: removendo banco em $DB_FILE"
  rm -f "$DB_FILE"
fi

if [ ! -f "$DB_FILE" ]; then
  echo "Banco SQLite não encontrado. Inicializando schema..."
  npm run db:push

  if [ -z "$SUBSIDIES_CSV_PATH" ] || [ -z "$OUTCOMES_CSV_PATH" ]; then
    echo "CSV de seed não encontrado dentro da imagem."
    exit 1
  fi

  echo "Executando seed com:"
  echo "  Subsídios: $SUBSIDIES_CSV_PATH"
  echo "  Resultados: $OUTCOMES_CSV_PATH"
  node scripts/database/importCsvs.js "$SUBSIDIES_CSV_PATH" "$OUTCOMES_CSV_PATH"
else
  echo "Banco existente encontrado em $DB_FILE. Pulando inicialização."
fi

exec npm run backend:api:start
