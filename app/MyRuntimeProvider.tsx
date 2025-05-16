"use client";

import { getSessionId } from "@/services/chatbot";
import { type ChatModelAdapter } from "@assistant-ui/react";
import axios from "axios";


 

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

      
      const result = await axios.post(
        "https://117b-2405-201-5004-703c-bad1-8e0a-5275-8a55.ngrok-free.app/tax_education/query",
        {
          query: message[messages.length - 1].content[0].text,
          // history: history,
          email: "test@yopmail.com",
          chat_type: "EDUCATION",
          session_id: getSessionId(), 

        }
      );
       
      // console.log(result)
      const stream = result?.data?.response || "Something went wrong";

      // const suggestions =[]

      // let text = "";
      // for await (const part of stream) {
      //   text += part || "";

      yield {
        content: [{ type: "text", text: stream }],
        metadata: {
          // custom: {
          //   suggestions
          // }
        },
      };
      // }
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
