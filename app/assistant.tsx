"use client";

import { useEffect, useMemo, useState } from "react";
import { Thread } from "../components/chatbot/assistant-ui/thread";
import "../utilities/auth"; // Import to activate axios interceptors
import axios from "axios";

import {
  type ChatModelRunOptions,
  type ChatModelRunResult,
  type ThreadAssistantMessagePart,
} from "@assistant-ui/react";
import {
  AssistantRuntimeProvider,
  useLocalThreadRuntime,
  WebSpeechSynthesisAdapter,
  CompositeAttachmentAdapter,
  SimpleTextAttachmentAdapter,
} from "@assistant-ui/react";

import { MyModelAdapter } from "../app/myRuntimeProvider";
import { CustomAttachmentAdapter } from "../app/attachmentAdapter";

export const CHAT_HISTORY_KEY = "chat_history";

type ApiChat = { user?: string; assistant?: string; search_urls?: string[] };


import {
  type ThreadHistoryAdapter,
  type ExportedMessageRepository,
} from "@assistant-ui/react";

// Convert your API chats → ExportedMessageRepository
import {
  type ThreadMessage,
  type MessageStatus,
} from "@assistant-ui/react";
import { getSessionId, getUserAndSessionId, tokenCreateFromclientIdandSecret } from "./taxModelAdapter";


function makeThreadMessage(
  role: "user" | "assistant",
  text: string,
  urls?: string[]
): ThreadMessage {
  const status: MessageStatus = { type: "complete", reason: "stop" };

  const base = {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    status,
  };

  if (role === "user") {
    return {
      ...base,
      role: "user",
      content: [{ type: "text", text }],
      attachments: [],
      metadata: { custom: {} }, // ✅ only needs `custom`
    };
  } else {
    return {
      ...base,
      role: "assistant",
      content: [{ type: "text", text }],
      metadata: {
        unstable_state: null,
        unstable_annotations: [],
        unstable_data: [],
        steps: [],
        custom: {
          urls: urls && urls.length > 0 ? urls : undefined,
        },
      },
    };
  }
}


function mapApiChatsToRepository(
  chats: { user?: string; assistant?: string; search_urls?: string[] }[],
  setLoadingHistory?: (loading: boolean) => void
): ExportedMessageRepository {
  const messages: { id: string; message: ThreadMessage; parentId: string | null }[] = [];

  let lastMessageId: string | null = null;

  chats.forEach((chat) => {
    if (chat.user) {
      const msg = makeThreadMessage("user", chat.user);
      messages.push({
        id: msg.id,               // ✅ use message's own id
        message: msg,
        parentId: lastMessageId,  // ✅ chain to previous message
      });
      lastMessageId = msg.id;
    }

    if (chat.assistant) {
      const msg = makeThreadMessage("assistant", chat.assistant, chat.search_urls);
      messages.push({
        id: msg.id,
        message: msg,
        parentId: lastMessageId,
      });
      lastMessageId = msg.id;
    }
  });
  return {
    messages,
    headId: messages.length > 0 ? messages[messages.length - 1].id : null, // ✅ head is last msg
  };
}




function makeHistoryAdapter(
  userId: string,
  sessionId?: string,
  setLoadingHistory?: (loading: boolean) => void
): ThreadHistoryAdapter {
  return {

    async load(): Promise<ExportedMessageRepository> {
      try {
        setLoadingHistory?.(true);
        const res = await axios.post(
          "https://amus-devapi.musetax.com/v1/api/export/get-user-chats",
          {
            userId,
            session_id: sessionId,
          }
        );

        const finalData = mapApiChatsToRepository(res.data.chats || []);
        setLoadingHistory?.(false)
        return finalData

      } catch (err) {
        console.error("Error fetching chats:", err);
        setLoadingHistory?.(false)
        return { messages: [] };
      }
    },

    async append({ message }) {
      console.log("append new message", message);
    },

    async *resume({ messages }: ChatModelRunOptions): AsyncGenerator<ChatModelRunResult> {
      console.log("resume thread with messages", messages);

      // yield a "no-op" completion just to satisfy the interface
      const status: MessageStatus = { type: "complete", reason: "stop" };

      yield {
        content: [] as ThreadAssistantMessagePart[], // nothing new from assistant
        status,
      };
    },
  };
}


function Assistant() {
  const [activeTab, setActiveTab] = useState<"tax" | "learn">("learn");
  const [typing, setTyping] = useState(false);
  const [loadingHistory, setloadingHistory] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>('123383892');
  const params = new URLSearchParams(window.location.search);
  const sessionId: any = params.get("sessionId");
  const userId:any=params.get("userId")
  const access_token: any = params.get("accessToken");
  const refresh_access_token: any = params.get("refreshToken");



  // localStorage.setItem("chatType", chatType)

  // localStorage.setItem("sessionId",sessionId)



  // useEffect(()=>{
  //   const creatToken=async()=>{
  //       try{
  //         let payload={
  //           client_id:clientId,
  //           client_secret:clientSecret
  //         }
  //         const response=await tokenCreateFromclientIdandSecret(payload)
  //         if(response&&!sessionId)
  //         {
  //           let sessionPayload={
  //             payroll_details:payrollDetails,
  //             company_name:companyName,
  //             first_name:first_name,
  //             last_name:last_name,
  //             email:email
  //           }
  //           const sessionId=await getUserAndSessionId(sessionPayload)
  //           return
  //         }
  //   }catch(error:any){
  //     console.log(error)

  //   }
  //   }
  //   if(clientId&&clientSecret)
  //   {
  //     creatToken()
  //   }

  // },[clientId,clientSecret])
  // console.log(access_token,refresh_access_token,"==========================")

  useEffect(() => {
    const storedSessionId = localStorage.getItem("chat_session_id");

    if (sessionId) {
      // Save new sessionId to localStorage
      localStorage.setItem("chat_session_id", sessionId);
      setCurrentSessionId(sessionId);
    } else if (storedSessionId) {
      // Use stored sessionId if no prop provided
      setCurrentSessionId(storedSessionId);
    }
    if (access_token) {
      localStorage.setItem("authTokenMuse", access_token)
    }
    if (refresh_access_token) {
      localStorage.setItem("refreshTokenMuse", refresh_access_token)
    }
    if (userId) {
      localStorage.setItem("userId", userId)
    }
  }, [sessionId, access_token, refresh_access_token])

  // useEffect(() => {
  //   const userInfo = async () => {
  //     try {
  //       const response = await createUserInfo(taxPayload, email, url_type)
  //       console.log(response, "fjniudjnj")
  //       loadHistory()
  //     } catch (error) {
  //       loadHistory()
  //       console.log(error, "error")
  //     }
  //   }
  //   userInfo()
  // }, [taxPayload])

  // Load history when page renders
  const loadHistory = async () => {
    console.log(currentSessionId, 'currentSessionId');
    console.log(userId, 'emailemail');

    if (currentSessionId && userId) {
      const historyAdapter = makeHistoryAdapter(userId, currentSessionId, setloadingHistory);
      try {
        await historyAdapter.load();
      } catch (error) {
        console.log("Error loading history on page render:", error);
      }
    }
  };





  // IMPORTANT: history adapter is created with the current email so it can load the right messages
  const history = useMemo(
    () => (currentSessionId ? makeHistoryAdapter(userId, currentSessionId,  setloadingHistory) : undefined),
    [userId, currentSessionId]
  );

  const learnRuntime = useLocalThreadRuntime(MyModelAdapter(userId, setTyping, currentSessionId), {
    adapters: {
      // your existing adapters
      attachments: new CompositeAttachmentAdapter([
        new CustomAttachmentAdapter(),
        new SimpleTextAttachmentAdapter(),
      ]),
      speech: new WebSpeechSynthesisAdapter(),
      // NEW: hydrate the thread from your API
      ...(history ? { history } : {})
    },
  });

  return (
    <div className="myUniquechatbot">
      {/* key includes email so switching users re-initializes the runtime + history load */}

      <AssistantRuntimeProvider key={`${activeTab}-${userId}`} runtime={learnRuntime}>
        <div className="flex justify-between px-0 py-0 w-full">
          <div className="grid grid-cols-1 gap-x-2 px-0 py-0 w-full">
            <Thread
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              typing={typing}
              image={''}
              // email={email}
              loadingHistory={loadingHistory}
              // url_type={url_type}
              sessionId={currentSessionId}
            />
          </div>
        </div>
      </AssistantRuntimeProvider>

    </div>
  );
}

export default Assistant;
