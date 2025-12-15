import { openai } from "@ai-sdk/openai";
import { jsonSchema, streamText } from "ai";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, system, tools } = await req.json();

  const result = streamText({
    // @ts-expect-error - AI SDK version compatibility issue
    model: openai("gpt-4o"),
    messages,
    // forward system prompt and tools from the frontend
    system,
    // @ts-expect-error - Tool type compatibility issue
    tools: Object.fromEntries(
      Object.entries<{ parameters: unknown }>(tools).map(([name, tool]) => [
        name,
        {
          parameters: jsonSchema(tool.parameters!),
        },
      ]),
    ),
  });
   // @ts-expect-error - Method name changed in newer AI SDK versions
   return result.toDataStreamResponse();
}
