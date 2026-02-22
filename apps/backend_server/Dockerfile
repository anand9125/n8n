# Base: Node 20 on Alpine (small, secure) ----
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Stage 1: Builder — install deps, generate Prisma client, compile TS ----
FROM base AS builder

WORKDIR /app

# Copy workspace and package manifests first (better layer caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/db/package.json packages/db/tsconfig.json ./packages/db/
COPY packages/worker-core/package.json packages/worker-core/tsconfig.json ./packages/worker-core/
COPY apps/backend_server/package.json apps/backend_server/tsconfig.json ./apps/backend_server/

RUN pnpm install --frozen-lockfile

# Copy source
COPY packages/db ./packages/db
COPY packages/worker-core ./packages/worker-core
COPY apps/backend_server ./apps/backend_server

# Prisma client is required at runtime; generate it in the db package
RUN pnpm --filter @repo/db exec prisma generate

# Build in dependency order: db -> worker-core -> backend_server
RUN pnpm --filter @repo/db build
RUN pnpm --filter @repo/worker-core build
RUN pnpm --filter backend_server build

# Stage 2: Runner — minimal image to run the server
FROM base AS runner

WORKDIR /app

# Copy only package manifests and install production deps (keeps image smaller)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/db/package.json ./packages/db/
COPY packages/worker-core/package.json ./packages/worker-core/
COPY apps/backend_server/package.json ./apps/backend_server/

RUN pnpm install --frozen-lockfile --prod

# Copy built outputs and Prisma schema (needed for generate at runtime)
COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/packages/db/prisma ./packages/db/prisma
COPY --from=builder /app/packages/worker-core/dist ./packages/worker-core/dist
COPY --from=builder /app/apps/backend_server/dist ./apps/backend_server/dist

# Regenerate Prisma client so node_modules has the correct generated code
RUN pnpm --filter @repo/db exec prisma generate

# Server runs from backend_server dir; Node resolves @repo/db via workspace
WORKDIR /app/apps/backend_server

EXPOSE 3030

# Pass env at run time: docker run -p 3030:3030 --env-file .env n8n-backend
CMD ["node", "dist/index.js"]
