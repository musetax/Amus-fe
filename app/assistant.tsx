"use client";
import React, { useEffect, useState } from "react";
import { Thread } from "@/components/chatbot/assistant-ui/thread";
import TaxDetails from "@/components/chatbot/taxDetails";
import { AssistantRuntimeProvider, useLocalRuntime } from "@assistant-ui/react";
import { MyModelAdapter } from "./MyRuntimeProvider";
import { TaxModelAdapter } from "./TaxModelAdapter";

import {
  CompositeAttachmentAdapter,
  SimpleTextAttachmentAdapter,
} from "@assistant-ui/react";
import { CustomAttachmentAdapter } from "./AttachmentAdapter";

export const Assistant = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"tax" | "learn">("learn");
  const [sessionId, setSessionId] = useState("");
  const [hasSubmittedTaxData, setHasSubmittedTaxData] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmail(localStorage.getItem("email"));
    }
  }, []);

  const userId = (data: any) => {
    setSessionId(data);
  };

  const commonAdapters = {
    attachments: new CompositeAttachmentAdapter([
      new CustomAttachmentAdapter(),
      new SimpleTextAttachmentAdapter(),
    ]),
  };

  const learnRuntime = useLocalRuntime(MyModelAdapter(email), {
    adapters: commonAdapters,
  });

  const taxRuntime = useLocalRuntime(TaxModelAdapter(sessionId, email), {
    adapters: commonAdapters,
  });

  const runtime = activeTab === "tax" ? taxRuntime : learnRuntime;

  // Prevent rendering until email is loaded
  if (!email) return null;

  return (
    <AssistantRuntimeProvider key={activeTab} runtime={runtime}>
      <div className="flex justify-between px-4 py-5">
        <div className="grid h-dvh grid-cols-1 gap-x-2 px-4 py-4 w-full">
          <Thread
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            userId={userId}
            hasSubmittedTaxData={hasSubmittedTaxData}
            setHasSubmittedTaxData={setHasSubmittedTaxData}
          />
        </div>
        <div className="block w-96 min-w-[352px]">
          <TaxDetails />
        </div>
      </div>
    </AssistantRuntimeProvider>
  );
};
