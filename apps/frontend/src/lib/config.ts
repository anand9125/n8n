export const BACKEND_URL = "http://localhost:4000/api/v1";
export const TOKEN = "n8n-token";
import { v4 as uuidv4 } from 'uuid';

// Generate workflowId only once per page load
const workflowId = uuidv4();

export { workflowId };
