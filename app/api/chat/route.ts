import { openai } from "@ai-sdk/openai";
import { jsonSchema, streamText, type LanguageModel, type ToolSet } from "ai";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, system, tools } = await req.json();

  const result = streamText({
    // openai currently returns a V1 model; coerce to the V2-compatible type expected here.
    model: openai("gpt-4o") as unknown as LanguageModel,
    messages,
    // forward system prompt and tools from the frontend
    system,
    tools: Object.fromEntries(
      Object.entries<{ parameters: unknown }>(tools).map(([name, tool]) => [
        name,
        {
          parameters: jsonSchema(tool.parameters!),
        },
      ]),
    ) as unknown as ToolSet,
  });
  return result.toTextStreamResponse();
}
