"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Thread } from "../components/chatbot/assistant-ui/thread";
import "../utilities/auth"; // Import to activate axios interceptors
import makeHistoryAdapter from '../services/chatbot'

import {
  AssistantRuntimeProvider,
  useLocalThreadRuntime,
  WebSpeechSynthesisAdapter,
  CompositeAttachmentAdapter,
  SimpleTextAttachmentAdapter,
} from "@assistant-ui/react";

import { MyModelAdapter } from "../app/myRuntimeProvider";
import { CustomAttachmentAdapter } from "../app/attachmentAdapter";
import { AgentIntent } from "../components/chatbot/assistant-ui/home-screen";
import { LifeEventCategory } from "../components/chatbot/assistant-ui/life-events-screen";

export const CHAT_HISTORY_KEY = "chat_history";

// type ApiChat = { user?: string; assistant?: string; search_urls?: string[] };

import { getPayrollDetails, payrollDetailsUpdate } from "./taxModelAdapter";

function Assistant() {
  const [activeTab, setActiveTab] = useState<"tax" | "learn">("learn");
  const [typing, setTyping] = useState(false);
  const [loadingHistory, setloadingHistory] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>();
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();

  const [payrollData, setPayrollData] = useState<any | null>(null);
  const [showTaxChatbot, setShowTaxChatbot] = useState(false);
  const [isLoadingPayroll, setIsLoadingPayroll] = useState(false);
  // Agent intent state management
  const [agentIntent, setAgentIntent] = useState<AgentIntent>(null);
  const [showHomeScreen, setShowHomeScreen] = useState(true);

  // Life events state management
  const [showLifeEventsScreen, setShowLifeEventsScreen] = useState(false);
  const [showLifeEventsForm, setShowLifeEventsForm] = useState(false);
  const [selectedLifeEventCategory, setSelectedLifeEventCategory] = useState<LifeEventCategory>(null);
  console.log("agentintent", agentIntent)
  const searchParams = useSearchParams();
  const sessionId: any = searchParams.get("session_id");
  const userId: any = searchParams.get("user_id")
  const access_token: any = searchParams.get("access_token");
  const user_image: any = searchParams.get("user_image")
  const companyLogo: any = searchParams.get("company_logo")
  const clientId: any = searchParams.get("client_id")
  const clientSecret: any = searchParams.get("client_secret")

  // const refresh_access_token: any = params.get("refresh_token");
  const [globalError, setGlobalError] = useState<string | null>(null);

  console.log(userId, sessionId, access_token)
  if (companyLogo) {
    localStorage.setItem("companyLogo", companyLogo)
  }
  if (user_image) {
    localStorage.setItem("image", user_image)
  }
  if (clientId) localStorage.setItem("clientId", clientId)
  if (clientSecret) localStorage.setItem("clientSecret", clientSecret)

  console.log(currentUserId)
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

  useEffect(() => {
    const userInfo = async () => {
      try {
        setIsLoadingPayroll(true);
        const response = await getPayrollDetails(userId);
        // console.log(response, "payroll response");

        setPayrollData(response);

        // Always show home screen initially when agentIntent is null
        // User must select an intent from home screen to proceed
        setShowHomeScreen(true);
        setShowTaxChatbot(false);

        setIsLoadingPayroll(false);
        // loadHistory()
      } catch (error: any) {
        setGlobalError(error.response.data.detail || "User ID not found")
        console.error("Error fetching payroll:", error);
        setShowTaxChatbot(true);
        setShowHomeScreen(false);
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

      // After form completion, decide what to do based on agent intent
      if (agentIntent === "tax_refund_calculation" || agentIntent === "tax_paycheck_calculation") {
        // Start chat directly after form completion for these intents
        setShowHomeScreen(false);
      } else {
        // Otherwise show home screen
        setShowHomeScreen(true);
      }
    } catch (error: any) {
      setGlobalError(error.response.data.details || "Failed to update payroll data.");
    }
    // You might want to save this data to your backend here
  };

  // Handle continue to chat action
  const handleContinueToChat = () => {
    setShowTaxChatbot(false);
  };

  // Handle agent intent selection from home screen
  const handleIntentSelection = async (intent: AgentIntent) => {
    setAgentIntent(intent);

    // Fetch payroll details when intent changes
    try {
      setIsLoadingPayroll(true);
      const response = await getPayrollDetails(userId);
      setPayrollData(response);
    } catch (error: any) {
      console.error("Error fetching payroll on intent change:", error);
      setGlobalError(error.response?.data?.detail || "Failed to fetch payroll details");
    } finally {
      setIsLoadingPayroll(false);
    }

    if (intent === "tax_education") {
      // Direct to chat - no questions needed
      setShowHomeScreen(false);
      setShowTaxChatbot(false);
      setShowLifeEventsScreen(false);
      setShowLifeEventsForm(false);
    } else if (intent === "tax_refund_calculation" || intent === "tax_paycheck_calculation") {
      // Show question flow first
      if (intent === "tax_refund_calculation" && !payrollData?.is_refund_data_fill) {
        setShowHomeScreen(false);
        setShowTaxChatbot(true);
        setShowLifeEventsScreen(false);
        setShowLifeEventsForm(false);
      }
      else if (intent === "tax_paycheck_calculation" && !payrollData?.is_paycheck_data_fill) {
        setShowHomeScreen(false);
        setShowTaxChatbot(true);
        setShowLifeEventsScreen(false);
        setShowLifeEventsForm(false);
      }
      else {
        setShowHomeScreen(false);
        setShowTaxChatbot(false);
        setShowLifeEventsScreen(false);
        setShowLifeEventsForm(false);
      }
    } else if (intent === "life_events_update") {
      // Show life events category selection
      setShowHomeScreen(false);
      setShowTaxChatbot(false);
      setShowLifeEventsScreen(true);
      setShowLifeEventsForm(false);
    }
  };

  // Handle return to home screen
  const handleReturnToHome = () => {
    setShowHomeScreen(true);
    setShowTaxChatbot(false);
    setShowLifeEventsScreen(false);
    setShowLifeEventsForm(false);
    setAgentIntent(null);
    setSelectedLifeEventCategory(null);
  };

  // Handle life event category selection
  const handleLifeEventCategorySelection = (category: LifeEventCategory) => {
    setSelectedLifeEventCategory(category);
    setShowLifeEventsScreen(false);
    setShowLifeEventsForm(true);
  };

  // Handle back from life events form to category selection
  const handleBackToLifeEventsCategories = () => {
    setShowLifeEventsForm(false);
    setShowLifeEventsScreen(true);
    setSelectedLifeEventCategory(null);
  };

  // Handle save life events data
  const handleSaveLifeEvents = async (data: any) => {
    try {
      // TODO: Implement API call to save life events data
      console.log("Saving life events data:", data);

      // For now, just log the data
      // In production, you would make an API call here
      // await saveLifeEventsData(data);

      // Don't navigate away - let the form show the saved state
      // User will click "Continue" to go back to main menu
    } catch (error) {
      console.error("Error saving life events data:", error);
      throw error; // Re-throw to let the form handle the error
    }
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
  // Re-create history adapter when agentIntent changes to reload chat history with new context
  // ONLY create history when agentIntent is available (not null)
  const history = useMemo(
    () => {
      if (!sessionId || !userId || !agentIntent) {
        console.log("⏸️  History adapter NOT created:", { sessionId: !!sessionId, userId: !!userId, agentIntent });
        return undefined;
      }
      console.log("✅ Creating history adapter for intent:", agentIntent);
      return makeHistoryAdapter(userId, sessionId, setloadingHistory, agentIntent);
    },
    [userId, sessionId, agentIntent]
  );

  // Single unified runtime with history adapter
  // The runtime will automatically call history.load() and import messages when initialized with a history adapter
  const runtimeOptions = useMemo(() => ({
    adapters: {
      attachments: new CompositeAttachmentAdapter([
        new CustomAttachmentAdapter(),
        new SimpleTextAttachmentAdapter(),
      ]),
      speech: new WebSpeechSynthesisAdapter(),
      // Include history adapter only when available
      ...(history ? { history } : {}),
    },
  }), [history]);

  const paycheck=useLocalThreadRuntime(
    MyModelAdapter(
  userId,
  setTyping,
  currentSessionId,
  setGlobalError,
  agentIntent
),
    runtimeOptions
  );
  const refund=useLocalThreadRuntime(
    MyModelAdapter(
  userId,
  setTyping,
  currentSessionId,
  setGlobalError,
  agentIntent
),
    runtimeOptions
  );
  const normalChat=useLocalThreadRuntime(
    MyModelAdapter(
  userId,
  setTyping,
  currentSessionId,
  setGlobalError,
  agentIntent
),
    runtimeOptions
  );
//   const learnRuntime = useLocalThreadRuntime(
//     MyModelAdapter(
//   userId,
//   setTyping,
//   currentSessionId,
//   setGlobalError,
//   agentIntent
// ),
//     runtimeOptions
//   );
const learnRuntime=agentIntent==='tax_education'?normalChat:agentIntent==='tax_paycheck_calculation'?paycheck:refund

  // Manually load and import history when agentIntent changes
  // This is necessary because the automatic history loading might not trigger properly on intent change
  useEffect(() => {
    if (!agentIntent || !history || !learnRuntime) {
      console.log("⏸️  Skipping manual history import:", {
        hasIntent: !!agentIntent,
        hasHistory: !!history,
        hasRuntime: !!learnRuntime
      });
      return;
    }

    console.log("🔄 Manually loading and importing chat history for intent:", agentIntent);
    setloadingHistory(true);

    history.load()
      .then((repository) => {
        console.log("✅ Chat history loaded from API:", {
          messagesCount: repository.messages.length,
          headId: repository.headId,
          firstMessage: repository.messages[0],
        });

        // Import the loaded messages into the runtime thread
        if (repository.messages.length > 0) {
          try {
            learnRuntime.thread.import(repository);
            console.log("✅ Chat history imported into runtime successfully");
          } catch (importError) {
            console.error("❌ Failed to import history into runtime:", importError);
          }
        } else {
          console.log("ℹ️  No chat history messages to import");
        }
        setloadingHistory(false);
      })
      .catch((err) => {
        console.error("❌ Failed to load chat history:", err);
        setloadingHistory(false);
      });
  }, [agentIntent,history,learnRuntime]);  // Only depend on agentIntent to avoid infinite loops

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
      {/* key includes userId and agentIntent so switching users or intent re-initializes the runtime + history load */}
      <AssistantRuntimeProvider key={`${agentIntent}-${userId}`} runtime={learnRuntime}>
        <div className="flex justify-between px-0 py-0 w-full">
          <div className="grid grid-cols-1 gap-x-2 px-0 py-0 w-full">
            <Thread
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              typing={typing}
              image={user_image}
              companyLogo={companyLogo}
              loadingHistory={loadingHistory}
              sessionId={sessionId}
              userId={userId}
              showTaxChatbot={showTaxChatbot}
              payrollData={payrollData}
              onTaxChatbotComplete={handleTaxChatbotComplete}
              onContinueToChat={handleContinueToChat}
              globalError={globalError}
              showHomeScreen={showHomeScreen}
              onSelectIntent={handleIntentSelection}
              onReturnToHome={handleReturnToHome}
              showLifeEventsScreen={showLifeEventsScreen}
              showLifeEventsForm={showLifeEventsForm}
              selectedLifeEventCategory={selectedLifeEventCategory}
              onSelectLifeEventCategory={handleLifeEventCategorySelection}
              onBackToLifeEventsCategories={handleBackToLifeEventsCategories}
              onSaveLifeEvents={handleSaveLifeEvents}
              agentIntent={agentIntent}
           
            />
          </div>
        </div>
      </AssistantRuntimeProvider>
    </div>
  );
}

export default Assistant;