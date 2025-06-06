"use client";

import { getCachedEmail, getCachedSessionId } from "@/services/chatSession";
import { type ChatModelAdapter } from "@assistant-ui/react";



export const MyModelAdapter: ChatModelAdapter = {
  async *run({ messages}) {
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
 

       const response = await fetch(
           `${process.env.NEXT_PUBLIC_BACKEND_API}/api/tax_education/query`,
         {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
             //     // history: history,
            query: message[messages.length - 1].content[0].text,
            // email: getCachedEmail(),
            email: "raja@yopmail.com",

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
      let text = ""; // ✅ Initialize as empty string

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkStr = decoder.decode(value, { stream: true });

        // Split by newlines in case multiple JSON objects are in one chunk
        const lines = chunkStr.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          try {
            const json = JSON.parse(line); // ✅ Parse chunk
            const chunkText = json.response || "";

            text += chunkText; // ✅ Accumulate string correctly

 
            yield {
              content: [{ type: "text", text: text }],
              metadata: {
                 //       // custom: {
      //       //   suggestions
      //       // }
              },
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
