# Worker image: runs BullMQ jobs (workflow execution). Depends on @repo/db and @repo/worker-core.
# Build from repo root: docker build -f apps/worker/Dockerfile -t n8n-worker .

FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Builder: install, Prisma generate, build db -> worker-core -> worker
FROM base AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/db/package.json packages/db/tsconfig.json ./packages/db/
COPY packages/worker-core/package.json packages/worker-core/tsconfig.json ./packages/worker-core/
COPY apps/worker/package.json apps/worker/tsconfig.json ./apps/worker/

RUN pnpm install --frozen-lockfile

COPY packages/db ./packages/db
COPY packages/worker-core ./packages/worker-core
COPY apps/worker ./apps/worker

RUN pnpm --filter @repo/db exec prisma generate
RUN pnpm --filter @repo/db build
RUN pnpm --filter @repo/worker-core build
RUN pnpm --filter worker build

# Runner: production deps + built artifacts only
FROM base AS runner

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/db/package.json ./packages/db/
COPY packages/worker-core/package.json ./packages/worker-core/
COPY apps/worker/package.json ./apps/worker/

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/packages/db/prisma ./packages/db/prisma
COPY --from=builder /app/packages/worker-core/dist ./packages/worker-core/dist
COPY --from=builder /app/apps/worker/dist ./apps/worker/dist

RUN pnpm --filter @repo/db exec prisma generate

WORKDIR /app/apps/worker

# Pass REDIS_URL (and DATABASE_URL if worker-core uses DB) at run time
CMD ["node", "dist/index.js"]
