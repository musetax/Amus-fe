"use client";

import {

  type ChatModelAdapter,
} from "@assistant-ui/react";
import axios from "axios";



export const MyModelAdapter: ChatModelAdapter = {
  async *run({ messages, abortSignal, context }) {
    try{
    console.log(messages, "messages", abortSignal, "abortSignal", context, "context")
    const history = [];
    const count = 5;
    const start = messages.length > count ? messages.length - count : 0;
    console.log(start)
    const message: any = messages
    for (let i = message.length - 1; i >= start; i--) {
      console.log(message[i].role);

      const text = message[i].content[0].text;
      if (message[i].role === "user") {
        history.push(`user:${text}`);
      } else {
        history.push(`assistant:${text}`);
      }
    }


    console.log(history)
    const result = await axios.post('https://amus-devapi.musetax.com/api/message', { "question": message[messages.length - 1].content[0].text, "query": "", "chat_history": history, "options": [] })
    console.log(result)
    const stream = result.data.message || "hello"
    console.log('hiihhihiih')
    const suggestions =result.data.questions ;

    let text = "";
    for await (const part of stream) {
      text += part || "";

      yield {
        content: [{ type: "text", text }],
        metadata: {
          custom: {
            suggestions
          }
      }
      };
    }
  }catch(error){
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
}
};  