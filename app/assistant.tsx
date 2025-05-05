
"use client";
import React, {useState } from "react";
import { Thread } from "@/components/chatbot/assistant-ui/thread";
import { ThreadList } from "@/components/chatbot/assistant-ui/thread-list";
import TaxDetails from "@/components/chatbot/taxDetails";
import { AssistantRuntimeProvider, useLocalRuntime } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { MyModelAdapter } from "./MyRuntimeProvider";
import { TaxModelAdapter } from "./TaxModelAdapter";
import { Toaster, toast } from 'react-hot-toast';
import {
  CompositeAttachmentAdapter,
  SimpleImageAttachmentAdapter,
  SimpleTextAttachmentAdapter,
} from "@assistant-ui/react";
import {CustomAttachmentAdapter} from './AttachmentAdapter'
export const Assistant = () => {
  const [activeTab, setActiveTab] = useState<"tax" | "learn">("learn");
  
const [sessionId,setSessionId]=useState('')
 const userId=(data:any)=>{

  setSessionId(data)
 }
 const commonAdapters = {
  attachments: new CompositeAttachmentAdapter([
    new CustomAttachmentAdapter(),
    new SimpleTextAttachmentAdapter(),
  ]),
};

const learnRuntime = useLocalRuntime(MyModelAdapter, {
  adapters: commonAdapters,
});

const taxRuntime = useLocalRuntime(TaxModelAdapter(sessionId), {
  adapters: commonAdapters,
});

// ✅ Choose runtime based on tab
const runtime = activeTab === "tax" ? taxRuntime : learnRuntime;
  

  return (
    
    <AssistantRuntimeProvider key={activeTab} runtime={runtime}>
      <div className="flex justify-between px-4 py-5">
        <div className="grid h-dvh grid-cols-1 gap-x-2 px-4 py-4 w-full">
          <Thread activeTab={activeTab} setActiveTab={setActiveTab} userId={userId} />
        </div>
        <div className="block w-96 min-w-[352px] ">
          <TaxDetails />
        </div>
      </div>
    </AssistantRuntimeProvider>
  );
};

