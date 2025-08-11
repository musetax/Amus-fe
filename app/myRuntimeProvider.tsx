"use client";

import { getCachedSessionId } from "@/services/chatSession";
import { getAccessToken, refreshAccessToken } from "@/utilities/auth";
import { type ChatModelAdapter } from "@assistant-ui/react";

export const MyModelAdapter: ChatModelAdapter = {
  async *run({ messages }) {
    try {
      const history = [];
      const count = 5;
      const start = messages.length > count ? messages.length - count : 0;
      const message: any = messages;
      for (let i = message.length - 1; i >= start; i--) {
        const text = message[i].content[0].text;
        if (message[i].role === "user") {
          history.push(`user:${text}`);
        } else {
          history.push(`assistant:${text}`);
        }
      }

      const token = getAccessToken();

      // ✅ Create FormData
      const formData = new FormData();
      formData.append("query", message[messages.length - 1].content[0].text);
      formData.append("chat_type", "EDUCATION");
      formData.append("session_id", getCachedSessionId() || "");

      let response = await fetch(`https://316f9c390f70.ngrok-free.app/chatbot`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ No Content-Type needed for FormData
        },
        body: formData,
      });

      // Handle 401 and retry with refreshed token
      if (response.status === 401) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          const retryFormData = new FormData();
          retryFormData.append("query", message[messages.length - 1].content[0].text);
          retryFormData.append("chat_type", "EDUCATION");
          retryFormData.append("session_id", getCachedSessionId() || "");

          response = await fetch(`https://316f9c390f70.ngrok-free.app/chatbot`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
            body: retryFormData,
          });
        }
      }

      if (!response.ok || !response.body) {
        throw new Error("Network response was not ok or stream missing");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let text = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkStr = decoder.decode(value, { stream: true });
        const lines = chunkStr.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            const chunkText = json.response || "";
            text += chunkText;

            yield {
              content: [{ type: "text", text: text }],
              metadata: {},
            };
          } catch (err) {
            console.error("Failed to parse JSON chunk:", line, err);
          }
        }
      }
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
};
