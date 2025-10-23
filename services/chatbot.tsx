import { ExportedMessageRepository, MessageStatus, ThreadAssistantMessagePart, ThreadHistoryAdapter, ThreadMessage,ChatModelRunOptions,ChatModelRunResult } from "@assistant-ui/react";
import {axiosInstanceAuth} from '../utilities/auth'
function makeThreadMessage(
  role: "user" | "assistant",
  text: string,
  urls?: string[]
): ThreadMessage {
  const status: MessageStatus = { type: "complete", reason: "stop" };

  const base = {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    status,
  };

  if (role === "user") {
    return {
      ...base,
      role: "user",
      content: [{ type: "text", text }],
      attachments: [],
      metadata: { custom: {} }, // ✅ only needs `custom`
    };
  } else {
    return {
      ...base,
      role: "assistant",
      content: [{ type: "text", text }],
      metadata: {
        unstable_state: null,
        unstable_annotations: [],
        unstable_data: [],
        steps: [],
        custom: {
          urls: urls && urls.length > 0 ? urls : undefined,
        },
      },
    };
  }
}

function mapApiChatsToRepository(
  chats: { user?: string; assistant?: string; search_urls?: string[] }[],
  // setLoadingHistory?: (loading: boolean) => void
): ExportedMessageRepository {
  const messages: { id: string; message: ThreadMessage; parentId: string | null }[] = [];

  let lastMessageId: string | null = null;

  chats.forEach((chat) => {
    if (chat.user) {
      const msg = makeThreadMessage("user", chat.user);
      messages.push({
        id: msg.id,               // ✅ use message's own id
        message: msg,
        parentId: lastMessageId,  // ✅ chain to previous message
      });
      lastMessageId = msg.id;
    }

    if (chat.assistant) {
      const msg = makeThreadMessage("assistant", chat.assistant, chat.search_urls);
      messages.push({
        id: msg.id,
        message: msg,
        parentId: lastMessageId,
      });
      lastMessageId = msg.id;
    }
  });
  return {
    messages,
    headId: messages.length > 0 ? messages[messages.length - 1].id : null, // ✅ head is last msg
  };
}

type AgentIntent = "tax_education" | "tax_refund_calculation" | "tax_paycheck_calculation" |"life_events_update" |null;

function makeHistoryAdapter(
  userId: string,
  sessionId?: string,
  setLoadingHistory?: (loading: boolean) => void,
  agentIntent?: AgentIntent
): ThreadHistoryAdapter {
  return {

    async load(): Promise<ExportedMessageRepository> {
      try {
        setLoadingHistory?.(true);

        if (!userId) {
          console.warn("No userId provided, skipping chat history load");
          setLoadingHistory?.(false);
          return { messages: [], headId: null };
        }

        const res = await axiosInstanceAuth.post(
          "/get-user-chats",
          {
            user_id: userId,
            session_id: sessionId,
            user_intent: agentIntent,
          }
        );

        const finalData = mapApiChatsToRepository(res.data.chats || []);
        setLoadingHistory?.(false);
        return finalData;

      } catch (err: any) {
        // Use console.warn instead of console.error to avoid Next.js error overlay
        console.warn("Failed to load chat history:", {
          message: err?.message,
          response: err?.response?.data,
          status: err?.response?.status,
          url: err?.config?.url,
        });
        setLoadingHistory?.(false);
        // Return empty state - this is expected behavior when no history exists
        return { messages: [], headId: null };
      }
    },

    async append({ message }) {
      console.log("append new message", message);
    },

    async *resume({ messages }: ChatModelRunOptions): AsyncGenerator<ChatModelRunResult> {
      console.log("resume thread with messages", messages);

      // yield a "no-op" completion just to satisfy the interface
      const status: MessageStatus = { type: "complete", reason: "stop" };

      yield {
        content: [] as ThreadAssistantMessagePart[], // nothing new from assistant
        status,
      };
    },
  };
}
export default makeHistoryAdapter
 