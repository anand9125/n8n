import Mustache from "mustache";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import prisma from "../../../lib.js";
import { tools } from "./tools/tools.js";

type RunAgentParams = {
  credentialId: string | null | undefined;
  template: any;
  context: Record<string, any>;
  workflowId?: string;
  executionId?: string;
  nodeId?: string;
  useMemory?: boolean;
};

function resolveTemplate(template: string, context: Record<string, any>): string {
  if (!template || typeof template !== "string") return template;

  const replaced = template
    .replace(/\{\{\s*\$json\.body\.([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
      return context.$json?.body?.[key] ?? `{{${key}}}`;
    })
    .replace(/\{\{\s*\$node\.([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)\s*\}\}/g, (_, nodeId, prop) => {
      return context.$node?.[nodeId]?.[prop] ?? `{{$node.${nodeId}.${prop}}}`;
    });

  try {
    return Mustache.render(replaced, context);
  } catch {
    return replaced;
  }
}

function createGeminiModelFromCreds(credsData: any) {
  const data = typeof credsData === "string" ? JSON.parse(credsData) : credsData;
  const apiKey = data?.geminiApiKey ?? data?.api_key ?? data?.apiKey;
  if (!apiKey) throw new Error("Missing Gemini API key in credential data");

  return new ChatGoogleGenerativeAI({
    apiKey,
    model: data?.model ?? "gemini-2.0-flash",
    temperature: typeof data?.temperature === "number" ? data.temperature : 0.2,
  });
}

export async function runGeminiAgent({
  credentialId,
  template,
  context,
}: RunAgentParams) {
  try {
    let rawPrompt = template?.prompt ?? template?.message ?? "";
    if (!rawPrompt || typeof rawPrompt !== "string" || rawPrompt.trim() === "") {
      throw new Error("Prompt must be provided in the template");
    }

    const prompt = resolveTemplate(rawPrompt, context || {});

    if (!credentialId) throw new Error("credentialId required");

    const creds = await prisma.credentials.findUnique({
      where: { id: credentialId },
    });

    if (!creds) throw new Error("Gemini credentials not found");

    const model = createGeminiModelFromCreds(creds.data);

    // 👇 THIS replaces agents in LangChain v1
    const modelWithTools = model.bindTools(tools);

    const promptTemplate = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are a helpful AI assistant with access to tools. Use tools when needed. If asked to return JSON, return only valid JSON."
      ],
      ["user", "{input}"],
    ]);

    const chain = promptTemplate.pipe(modelWithTools);

    const result = await chain.invoke({
      input: String(prompt),
    });

    let rawText = String(result?.content ?? "").trim();
    rawText = rawText.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();

    try {
      const parsed = JSON.parse(rawText);
      if (parsed && typeof parsed === "object") {
        return { text: parsed, query: prompt };
      }
    } catch {}

    return { text: rawText, query: prompt };

  } catch (err: any) {
    console.error("runGeminiAgent error:", err?.message ?? err);
    return { result: `Agent execution failed: ${err?.message ?? String(err)}` };
  }
}
