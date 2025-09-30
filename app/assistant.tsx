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
import { getPayrollDetails, getSessionId, getUserAndSessionId, payrollDetailsUpdate, tokenCreateFromclientIdandSecret } from "./taxModelAdapter";

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
          "https://amus-devapi.musetax.com/v1/api/amus/get-user-chats",
          {
            user_id: userId,
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
  const [loadingHistory, setloadingHistory] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>();
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();

  const [payrollData, setPayrollData] = useState(null);
  const [showTaxChatbot, setShowTaxChatbot] = useState(false);
  const [isLoadingPayroll, setIsLoadingPayroll] = useState(false);

  // console.log(window.location.search)
  const params = new URLSearchParams(window.location.search);
  const sessionId: any = params.get("session_id");
  const userId: any = params.get("user_id")
  const access_token: any = params.get("access_token");
  // const refresh_access_token: any = params.get("refresh_token");
  const [globalError, setGlobalError] = useState<string | null>(null);

  console.log(userId, sessionId, access_token)

  useEffect(() => {
    const storedSessionId = localStorage.getItem("chat_session_id");
    if (!sessionId || !userId || !access_token) {
      setGlobalError("Missing session_id, user_id or access_token in URL.");
      return;
    }
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
    // if (refresh_access_token) {
    //   localStorage.setItem("refreshTokenMuse", refresh_access_token)
    // }
    if (userId) {
      localStorage.setItem("userId", userId)
      setCurrentUserId(userId)
    }
  }, [sessionId, access_token, userId])

  // Check if payroll data is complete
  const isPayrollDataComplete = (data: any) => {
    if (!data) return false;

    return !!(
      data.income_type &&
      data.annual_salary !== null &&
      data.annual_salary !== undefined &&
      data.filing_status &&
      data.pay_frequency &&
      data.current_withholding_per_paycheck !== null &&
      data.current_withholding_per_paycheck !== undefined &&
      data.additional_income !== 0 &&
      data.deductions !== 0 &&
      data.dependents !== 0
    );
  };

  useEffect(() => {
    const userInfo = async () => {
      try {
        setIsLoadingPayroll(true);
        const response = await getPayrollDetails(userId);
        // console.log(response, "payroll response");

        setPayrollData(response);

        // Check if any required field is missing
        const isComplete = isPayrollDataComplete(response.payroll);
        // console.log(isComplete,"iscomplete")
        setShowTaxChatbot(!isComplete);

        setIsLoadingPayroll(false);
        // loadHistory()
      } catch (error: any) {
        setGlobalError(error.response.data.detail || "User ID not found")
        console.error("Error fetching payroll:", error);
        setShowTaxChatbot(true);
      } finally {
        setIsLoadingPayroll(false);
      }
    }
    if (!globalError && userId) {
      userInfo();

    }
  }, [userId, globalError]);
  // Handle tax chatbot completion
  const handleTaxChatbotComplete = async (taxData: any) => {
    try {
      const response = await payrollDetailsUpdate(userId, taxData)
      console.log(response, "response")
      setShowTaxChatbot(false);
      setPayrollData(taxData);
    } catch (error: any) {
      setGlobalError(error.response.data.details || "Failed to update payroll data.");
    }
    // You might want to save this data to your backend here
  };

  // Handle continue to chat action
  const handleContinueToChat = () => {
    setShowTaxChatbot(false);
  };

  // Load history when page renders
  // const loadHistory = async () => {


  //   if (currentSessionId && userId) {
  //     const historyAdapter = makeHistoryAdapter(userId, sessionId, setloadingHistory);
  //     try {
  //       await historyAdapter.load();
  //     } catch (error) {
  //       console.log("Error loading history on page render:", error);
  //     }
  //   }
  // };

  // IMPORTANT: history adapter is created with the current userId so it can load the right messages
  const history = useMemo(
    () => (sessionId ? makeHistoryAdapter(userId, sessionId, setloadingHistory) : undefined),
    [userId, sessionId]
  );

  const learnRuntime = useLocalThreadRuntime(MyModelAdapter(userId, setTyping, currentSessionId, setGlobalError), {
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

  // Show loading state while checking payroll data
  if (isLoadingPayroll) {
    return (
      <div className="myUniquechatbot">
        <div className="flex items-center justify-center py-10 min-h-[400px]">
          <div className="text-center">
            <div className="flex items-center justify-center w-full mb-2"><div className="smooth-ring"></div></div>

            {/* <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#4d37f5] mb-4"></div> */}
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Loading your information...
            </h3>
            <p className="text-sm text-gray-500">
              Please wait while we check your profile
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="myUniquechatbot">
      {/* key includes userId so switching users re-initializes the runtime + history load */}
      <AssistantRuntimeProvider key={`${activeTab}-${userId}`} runtime={learnRuntime}>
        <div className="flex justify-between px-0 py-0 w-full">
          <div className="grid grid-cols-1 gap-x-2 px-0 py-0 w-full">
            <Thread
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              typing={typing}
              image={''}
              loadingHistory={loadingHistory}
              sessionId={sessionId}
              userId={userId}
              showTaxChatbot={showTaxChatbot}
              payrollData={payrollData}
              onTaxChatbotComplete={handleTaxChatbotComplete}
              onContinueToChat={handleContinueToChat}
              globalError={globalError}
            />
          </div>
        </div>
      </AssistantRuntimeProvider>
    </div>
  );
}

export default Assistant;