export const BACKEND_URL = "http://localhost:4000/api/v1";
export const TOKEN = "n8n-token";

// Generate workflowId only once per page load
const workflowId = crypto.randomUUID() as string;

export { workflowId };
