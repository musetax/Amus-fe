"use client";

import { type ChatModelAdapter } from "@assistant-ui/react";
import axios from "axios";

export const MyModelAdapter = (email: any): ChatModelAdapter => ({
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

      const message: any = messages;
      for (let i = message.length - 1; i >= start; i--) {
        const text = message[i].content[0].text;
        if (message[i].role === "user") {
          history.push(`user:${text}`);
        } else {
          history.push(`assistant:${text}`);
        }
      }

      const latestQuestion = message[messages.length - 1].content[0].text;
      console.log(email, "eeeeeeee");
      const result: any = await axios.post(
        "https://amus-devapi.musetax.com/tax_education/query",
        {
          query: latestQuestion,
          email,
          chat_type: "EDUCATION",
        }
      );
      console.log(result.data.response, "responseresponseresponse");

      const stream = result?.data?.response;
      const suggestions = result.data.questions;

      let text = "";
      for await (const part of stream) {
        text += part || "";

        yield {
          content: [{ type: "text", text }],
          metadata: {
            custom: {
              suggestions,
            },
          },
        };
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
});
