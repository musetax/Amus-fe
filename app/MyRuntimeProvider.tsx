"use client";

import { getCachedEmail, getCachedSessionId } from "@/services/chatSession";
import { type ChatModelAdapter } from "@assistant-ui/react";



export const MyModelAdapter: ChatModelAdapter = {
  async *run({ messages, abortSignal, context }) {
    try {
      console.log(
        messages,
        "messages",
        abortSignal,
        "abortSignal",
        context,
        "context"
      );
      const history = [];
      const count = 5;
      const start = messages.length > count ? messages.length - count : 0;
      console.log(start);
      const message: any = messages;
      for (let i = message.length - 1; i >= start; i--) {
        console.log(message[i].role);

        const text = message[i].content[0].text;
        if (message[i].role === "user") {
          history.push(`user:${text}`);
        } else {
          history.push(`assistant:${text}`);
        }
      }

      
//  const result = await axios.post(
//    `${process.env.NEXT_PUBLIC_BACKEND_API}/api/tax_education/query`,
//    {
//      query: message[messages.length - 1].content[0].text,
//      // history: history,
//      email: getCachedEmail(),
//      chat_type: "EDUCATION",
//      session_id: getCachedSessionId(), 
 
//    }
//  );
//       console.log(result,'result?.data?.response?.response');
      
//       // console.log(result)
//       const stream = result?.data?.response || "Something went wrong";

//       // const suggestions =[]

//       // let text = "";
//       // for await (const part of stream) {
//       //   text += part || "";

//       yield {
//         content: [{ type: "text", text: stream }],
//         metadata: {
//           // custom: {
//           //   suggestions
//           // }
//         },
//       };
      // }

       const response = await fetch(
           `${process.env.NEXT_PUBLIC_BACKEND_API}/api/tax_education/query`,
        // `https://515c-2401-4900-46d6-a52b-b4fc-9174-349a-158e.ngrok-free.app/api/tax_education/query`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
             //     // history: history,
            query: message[messages.length - 1].content[0].text,
            email: getCachedEmail(),
            chat_type: "EDUCATION",
            session_id: getCachedSessionId(),
          }),
        }
      );
      console.log(response, 'result?.data?.response?.response');
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

            console.log(text, "texterrererr");

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
