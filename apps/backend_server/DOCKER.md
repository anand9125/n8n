# Backend Docker — First Principles

## Why we use Docker

- **Same environment everywhere**: Your laptop, CI, and EC2 all run the same image. No “works on my machine.”
- **Isolation**: The app runs in a container with its own filesystem and process tree.
- **Reproducibility**: Given the same Dockerfile and build context, you get the same image.

## Image vs container

- **Image** = blueprint (filesystem + default command). Built from a Dockerfile.
- **Container** = a running instance of an image. You can run many containers from one image.

## What’s in this Dockerfile

### 1. Base image (`FROM node:20-alpine`)

We start from a minimal Linux (Alpine) with Node 20. Everything we add is layered on top. We enable **pnpm** so install and build match your monorepo (`packageManager: pnpm@9.0.0`).

### 2. Multi-stage build (builder → runner)

We use **two stages**:

- **Builder**: Full repo context, install deps, run Prisma generate, compile TypeScript. Produces `dist/` and Prisma client.
- **Runner**: Only what’s needed to run the server — production deps, built JS, Prisma schema + generate. No devDependencies, no source.

Result: smaller, more secure image and faster deploys.

### 3. Why build from repo root?

The backend depends on workspace packages:

- `@repo/db` — Prisma client and DB access
- `@repo/worker-core` — queues and workers

Those are linked by pnpm workspaces. So we must build from the **monorepo root** and keep workspace layout in the image so `require('@repo/db/client')` resolves correctly.

### 4. Layer order for cache

We copy **package manifests first**, then run `pnpm install`. So when you change only app code, Docker reuses the “install” layer and only reruns build steps. Copying source and running build comes after.

### 5. Prisma generate (twice)

- **In builder**: So TypeScript build can rely on generated types and so the client exists for the build.
- **In runner**: We copy only `dist/` and `prisma/` from builder, not the full `node_modules` from builder. So we run `prisma generate` again in the runner so the **runner’s** `node_modules` gets the generated client for the correct schema.

### 6. `EXPOSE 3030` and `CMD`

- `EXPOSE 3030` documents that the app listens on port 3030. It does **not** publish the port; you do that with `docker run -p 3030:3030`.
- `CMD ["node", "dist/index.js"]` is the default command when the container starts. Env (e.g. `DATABASE_URL`, `REDIS_URL`, `JWT_KEY`) is passed at **run** time via `--env-file` or `-e`.

## How to build and run

From the **monorepo root** (`s30/Proj/n8n`):

```bash
# Build the image (context = current dir = repo root)
docker build -f apps/backend_server/Dockerfile -t n8n-backend .

# Run the container (pass env from .env in backend_server or root)
docker run -p 3030:3030 --env-file apps/backend_server/.env n8n-backend
```

Or with explicit env:

```bash
docker run -p 3030:3030 \
  -e PORT=3030 \
  -e DATABASE_URL="mongodb+srv://..." \
  -e REDIS_URL="redis://..." \
  -e JWT_KEY="your-secret" \
  -e CORS_ORIGIN="http://localhost:3000" \
  n8n-backend
```

## Summary

| Concept        | In this Dockerfile |
|----------------|--------------------|
| **Dockerfile** | Recipe to build the backend image. |
| **Stages**     | `builder` = install + build; `runner` = only runtime. |
| **Context**    | Repo root, so workspace packages are available. |
| **Final image** | Node 20, production deps, built JS, Prisma client; runs `node dist/index.js`. |
