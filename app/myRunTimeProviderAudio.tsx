"use client";

import { getCachedSessionId } from "@/services/chatSession";
import { type ChatModelAdapter } from "@assistant-ui/react";
  import Cookies from "js-cookie";

export const myRunTimeProviderAudio: ChatModelAdapter = {
  async *run({ messages }) {
    function playAudioFromBase64(base64Audio: string) {
      try {
        // Decode base64 to binary data
        const byteCharacters = atob(base64Audio);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // Create blob and play audio
        const blob = new Blob([byteArray], { type: "audio/mpeg" }); // adjust MIME type if needed
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.play().catch(e => {
          console.warn("Audio playback prevented:", e);
        });
      } catch (err) {
        console.error("Failed to play audio:", err);
      }
    }

    try {
      const count = 5;
      const start = messages.length > count ? messages.length - count : 0;
      const message: any = messages;

      // (Optional) Prepare history if you want
      const history = [];
      for (let i = message.length - 1; i >= start; i--) {
        const text = message[i].content[0].text;
        history.push(`${message[i].role}:${text}`);
      }
            const token = Cookies.get("collintoken");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/tax_education/query`,
        // ` https://3a20-103-223-15-108.ngrok-free.app/api/tax_education/query`,
       
        {
          method: "POST",
          headers: { "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
           },
          body: JSON.stringify({
            query: message[messages.length - 1].content[0].text,
            // email: getCachedEmail(),
             chat_type: "EDUCATION",
            session_id: getCachedSessionId(),
          }),
        }
      );

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

        // Split multiple JSON chunks by newlines
        const lines = chunkStr.split("\n").filter(line => line.trim());

        for (const line of lines) {
          try {
            const json = JSON.parse(line);

            if (json.response) {
              text += json.response;
            }

            if (json.audio_base64) {
              playAudioFromBase64(json.audio_base64);
            }

            yield {
              content: [{ type: "text", text }],
              metadata: {},
            };
          } catch (err) {
            console.error("Failed to parse JSON line:", line, err);
          }
        }
      }
    } catch (error) {
      console.error("Error in MyModelAdapter:", error);
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


