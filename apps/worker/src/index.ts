/**
 * Standalone worker process. Run as a separate service from the API.
 * Requires: Redis, and @repo/worker-core built (pnpm build at repo root).
 */
import "dotenv/config";
import { nodeWorker } from "@repo/worker-core";

async function shutdown() {
  console.log("Shutting down worker...");
  await nodeWorker.close();
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

console.log("Worker running. Processing workflowNodeQueue...");
