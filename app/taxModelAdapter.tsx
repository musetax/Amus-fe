"use client";
import { getCachedSessionId } from "@/services/chatSession";
import { refreshToken } from "@/utilities/axios";
import { type ChatModelAdapter } from "@assistant-ui/react";
import Cookies from "js-cookie";



export const TaxModelAdapter = (): ChatModelAdapter => ({
  async *run({ messages }) {
    try {
      const count = 5;
      const start = messages.length > count ? messages.length - count : 0;
      const history: string[] = [];

      for (let i = messages.length - 1; i >= start; i--) {
        const part = messages[i].content[0];
        if (part.type === "text") {
          const text = part.text;
          history.push(`${messages[i].role}:${text}`);
        }
      }

      const lastPart = messages[messages.length - 1].content[0];
      const userMessage = lastPart.type === "text" ? lastPart.text : "";

      const fetchChat = async (token: string) => {
        return fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/chat/message`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
            body: JSON.stringify({
              message: userMessage,
              chat_type: "CALCULATION",
              session_id: getCachedSessionId(),
            }),
          }
        );
      };

      let token = Cookies.get("collintoken") || "";
      let response = await fetchChat(token);

      if (response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          token = newToken;
          response = await fetchChat(token);
        } else {
          throw new Error("Unauthorized and failed to refresh token");
        }
      }

      if (!response.ok || !response.body) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        console.log('rajaaa', decoder.decode(value, { stream: true }));
        

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf("\n")) >= 0) {
          const line = buffer.slice(0, newlineIndex).trim();
          buffer = buffer.slice(newlineIndex + 1);

          if (!line) continue;

          try {
            const parsed = JSON.parse(line);
            if (parsed?.response) {
              fullText += parsed.response;

              yield {
                content: [{ type: "text", text: fullText }],
              };
            }
          } catch (err) {
            console.warn("Stream parse error:", err, "Chunk:", line);
          }
        }
      }

      // Handle remaining buffer (no newline at end)
      if (buffer.trim()) {
        try {
          const parsed = JSON.parse(buffer.trim());
          if (parsed?.response) {
            fullText += parsed.response;
            yield {
              content: [{ type: "text", text: fullText }],
            };
          }
        } catch (err) {
          console.warn("Final buffer parse error:", err, "Chunk:", buffer);
        }
      }

      yield {
        content: [{ type: "text", text: fullText }],
        metadata: {
          custom: {
            suggestions: [
              "What are the tax benefits?",
              "Can I deduct this expense?",
            ],
          },
        },
      };
    } catch (error) {
      console.error("Error in TaxModelAdapter:", error);
      yield {
        content: [
          {
            type: "text",
            text: "Sorry, something went wrong. Please try again.",
          },
        ],
      };
    }
  },
});