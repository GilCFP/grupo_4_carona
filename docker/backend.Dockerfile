FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci
RUN npx prisma generate

COPY . .

RUN chmod +x /app/docker/backend-entrypoint.sh

ENV HOST=0.0.0.0
ENV PORT=3001
ENV NEW_BACKEND_HOST=0.0.0.0
ENV NEW_BACKEND_PORT=3001
ENV DATABASE_URL=file:../data/hackaton.sqlite
ENV SQLITE_DB_PATH=/app/data/hackaton.sqlite

EXPOSE 3001

ENTRYPOINT ["/app/docker/backend-entrypoint.sh"]
