"use client";
import React, { useState } from "react";
import { Thread } from "@/components/chatbot/assistant-ui/thread";
import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  WebSpeechSynthesisAdapter,
} from "@assistant-ui/react";

import { MyModelAdapter } from "./myRuntimeProvider";
import { TaxModelAdapter } from "./taxModelAdapter";

import {
  CompositeAttachmentAdapter,
  SimpleTextAttachmentAdapter,
} from "@assistant-ui/react";
import { CustomAttachmentAdapter } from "./attachmentAdapter";
export const Assistant = () => {
  const [activeTab, setActiveTab] = useState<"tax" | "learn">("learn");

  const commonAdapters = {
    attachments: new CompositeAttachmentAdapter([
      new CustomAttachmentAdapter(),
      new SimpleTextAttachmentAdapter(),
      // new WebSpeechSynthesisAdapter(),
    ]),
  };

  const learnRuntime = useLocalRuntime(MyModelAdapter, {
    adapters: {
      ...commonAdapters, // Spread the commonAdapters properties here
      speech: new WebSpeechSynthesisAdapter(),
    },
  });

  const taxRuntime = useLocalRuntime(TaxModelAdapter(), {
    adapters: {
      ...commonAdapters, // Spread the commonAdapters properties here
      speech: new WebSpeechSynthesisAdapter(),
    },
  });

  // ✅ Choose runtime based on tab
  const runtime = activeTab === "tax" ? taxRuntime : learnRuntime;

  return (
    <AssistantRuntimeProvider key={activeTab} runtime={runtime}>
      <div className="flex justify-between px-4 py-5">
        <div className="grid grid-cols-1 gap-x-2 px-4 py-4 w-full">
          <Thread activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </AssistantRuntimeProvider>
  );
};
