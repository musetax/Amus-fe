"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Thread } from "../components/chatbot/assistant-ui/thread";
import "../utilities/auth"; // Import to activate axios interceptors
import makeHistoryAdapter from "../services/chatbot";

import {
  AssistantRuntimeProvider,
  useLocalRuntime,
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

interface AssistantProps {
  userId?: string;
  sessionId?: string;
  accessToken?: string;
  userImage?: string;
  companyLogo?: string;
  clientId?: string;
  clientSecret?: string;
}

function Assistant({
  userId: propUserId,
  sessionId: propSessionId,
  accessToken: propAccessToken,
  userImage: propUserImage,
  companyLogo: propCompanyLogo,
  clientId: propClientId,
  clientSecret: propClientSecret,
}: AssistantProps = {}) {
  const [activeTab, setActiveTab] = useState<"tax" | "learn">("learn");
  const [typing, setTyping] = useState(false);
  const [loadingHistory, setloadingHistory] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<
    string | undefined
  >();
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();

  const [payrollData, setPayrollData] = useState<any | null>(null);
  const [showTaxChatbot, setShowTaxChatbot] = useState(false);
  const [isLoadingPayroll, setIsLoadingPayroll] = useState(false);
  // Agent intent state management
  const [agentIntent, setAgentIntent] = useState<AgentIntent>("tax_education");
  const [showHomeScreen, setShowHomeScreen] = useState(false);

  // Life events state management
  const [showLifeEventsScreen, setShowLifeEventsScreen] = useState(false);
  const [showLifeEventsForm, setShowLifeEventsForm] = useState(false);
  const [selectedLifeEventCategory, setSelectedLifeEventCategory] =
    useState<LifeEventCategory>(null);

  const searchParams = useSearchParams();
  const sessionId = (propSessionId || searchParams.get("session_id")) ?? "";
  const userId = (propUserId || searchParams.get("user_id")) ?? "";
  const access_token = (propAccessToken || searchParams.get("access_token")) ?? "";
  const user_image = (propUserImage || searchParams.get("user_image")) ?? "";
  const companyLogo = (propCompanyLogo || searchParams.get("company_logo")) ?? "";
  const clientId = (propClientId || searchParams.get("client_id")) ?? "";
  const clientSecret = (propClientSecret || searchParams.get("client_secret")) ?? "";

  const [globalError, setGlobalError] = useState<string | null>(null);

  console.log(userId, sessionId, access_token);
  useEffect(() => {
    if (companyLogo) localStorage.setItem("companyLogo", companyLogo);
    if (user_image) localStorage.setItem("image", user_image);
    if (clientId) localStorage.setItem("clientId", clientId);
    if (clientSecret) localStorage.setItem("clientSecret", clientSecret);

    if (sessionId) {
      localStorage.setItem("chat_session_id", sessionId);
      setCurrentSessionId(sessionId);
    } else {
      const storedSessionId = localStorage.getItem("chat_session_id");
      if (storedSessionId) setCurrentSessionId(storedSessionId);
    }

    if (access_token) {
      localStorage.setItem("authTokenMuse", access_token);
    }

    if (userId) {
      localStorage.setItem("userId", userId);
      setCurrentUserId(userId);
    }

    if (!sessionId || !userId || !access_token) {
      setGlobalError("Missing session_id, user_id or access_token in URL.");
    }
  }, [sessionId, access_token, userId, companyLogo, user_image, clientId, clientSecret]);

  useEffect(() => {
    const userInfo = async () => {
      if (!userId) return;
      try {
        setIsLoadingPayroll(true);
        const response = await getPayrollDetails(userId);
        setPayrollData(response);
        setShowHomeScreen(true);
        setShowTaxChatbot(false);
      } catch (error: any) {
        setGlobalError(error.response?.data?.detail || "User ID not found");
        console.error("Error fetching payroll:", error);
        setShowTaxChatbot(true);
        setShowHomeScreen(false);
      } finally {
        setIsLoadingPayroll(false);
      }
    };

    if (!globalError && userId) {
      userInfo();
    }
  }, [userId, globalError]);

  // Handle tax chatbot completion
  const handleTaxChatbotComplete = async (taxData: any) => {
    try {
      const response = await payrollDetailsUpdate(userId, taxData);
      console.log(response, "response");
      setShowTaxChatbot(false);
      setPayrollData(taxData);

      // After form completion, decide what to do based on agent intent
      if (
        agentIntent === "tax_refund_calculation" ||
        agentIntent === "tax_paycheck_calculation"
      ) {
        // Start chat directly after form completion for these intents
        setShowHomeScreen(false);
      } else {
        // Otherwise show home screen
        setShowHomeScreen(true);
      }
    } catch (error: any) {
      setGlobalError(
        error.response?.data?.details || "Failed to update payroll data.",
      );
    }
  };

  // Handle continue to chat action
  const handleContinueToChat = () => {
    setShowTaxChatbot(false);
  };

  // Handle agent intent selection from home screen
  const handleIntentSelection = async (intent: AgentIntent) => {
    console.log("currentUserId selected:", currentUserId);
    setAgentIntent(intent);

    // Fetch payroll details when intent changes
    try {
      setIsLoadingPayroll(true);
      const response = await getPayrollDetails(userId);
      setPayrollData(response);
    } catch (error: any) {
      console.error("Error fetching payroll on intent change:", error);
      setGlobalError(
        error.response?.data?.detail || "Failed to fetch payroll details",
      );
    } finally {
      setIsLoadingPayroll(false);
    }

    if (intent === "tax_education") {
      // Direct to chat - no questions needed
      setShowHomeScreen(false);
      setShowTaxChatbot(false);
      setShowLifeEventsScreen(false);
      setShowLifeEventsForm(false);
    } else if (
      intent === "tax_refund_calculation" ||
      intent === "tax_paycheck_calculation"
    ) {
      // Show question flow first
      if (
        intent === "tax_refund_calculation" &&
        !payrollData?.is_refund_data_fill
      ) {
        setShowHomeScreen(false);
        setShowTaxChatbot(true);
        setShowLifeEventsScreen(false);
        setShowLifeEventsForm(false);
      } else if (
        intent === "tax_paycheck_calculation" &&
        !payrollData?.is_paycheck_data_fill
      ) {
        setShowHomeScreen(false);
        setShowTaxChatbot(true);
        setShowLifeEventsScreen(false);
        setShowLifeEventsForm(false);
      } else {
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
  const history = useMemo(() => {
    if (!sessionId || !userId || !agentIntent) {
      console.log("⏸️  History adapter NOT created:", {
        sessionId: !!sessionId,
        userId: !!userId,
        agentIntent,
      });
      return undefined;
    }
    console.log("✅ Creating history adapter for intent:", agentIntent);
    return makeHistoryAdapter(
      userId,
      sessionId,
      // setloadingHistory,
      agentIntent,
    );
  }, [userId, sessionId, agentIntent]);

  // Single unified runtime with history adapter
  // The runtime will automatically call history.load() and import messages when initialized with a history adapter
  const runtimeOptions = useMemo(
    () => ({
      adapters: {
        attachments: new CompositeAttachmentAdapter([
          new CustomAttachmentAdapter(),
          new SimpleTextAttachmentAdapter(),
        ]),
        speech: new WebSpeechSynthesisAdapter(),
        // Include history adapter only when available
        ...(history ? { history } : {}),
      },
    }),
    [history],
  );

  const paycheck = useLocalRuntime(
    MyModelAdapter(
      userId,
      setTyping,
      currentSessionId,
      setGlobalError,
      agentIntent,
    ),
    runtimeOptions,
  );
  const refund = useLocalRuntime(
    MyModelAdapter(
      userId,
      setTyping,
      currentSessionId,
      setGlobalError,
      agentIntent,
    ),
    runtimeOptions,
  );
  const normalChat = useLocalRuntime(
    MyModelAdapter(
      userId,
      setTyping,
      currentSessionId,
      setGlobalError,
      agentIntent,
    ),
    runtimeOptions,
  );
  //   const learnRuntime = useLocalRuntime(
  //     MyModelAdapter(
  //   userId,
  //   setTyping,
  //   currentSessionId,
  //   setGlobalError,
  //   agentIntent
  // ),
  //     runtimeOptions
  //   );
  const learnRuntime =
    agentIntent === "tax_education"
      ? normalChat
      : agentIntent === "tax_paycheck_calculation"
        ? paycheck
        : refund;

  // Manually load and import history when agentIntent changes
  // This is necessary because the automatic history loading might not trigger properly on intent change
  useEffect(() => {
    if (!agentIntent || !history || !learnRuntime) {
      console.log("⏸️  Skipping manual history import:", {
        hasIntent: !!agentIntent,
        hasHistory: !!history,
        hasRuntime: !!learnRuntime,
      });
      return;
    }

    console.log(
      "🔄 Manually loading and importing chat history for intent:",
      agentIntent,
    );

    setloadingHistory(true);
    history
      .load()
      .then((repository: any) => {
        console.log("✅ Chat history loaded from API:", {
          messagesCount: repository.messages.length,
          headId: repository.headId,
          firstMessage: repository.messages[0],
        });

        if (repository.messages.length > 0) {
          try {
            learnRuntime.thread.import(repository);
            console.log("✅ Chat history imported into runtime successfully");
          } catch (importError) {
            console.error(
              "❌ Failed to import history into runtime:",
              importError,
            );
          }
        }
        setloadingHistory(false);
      })
      .catch((err: any) => {
        console.error("❌ Failed to load chat history:", err);
        setloadingHistory(false);
      });
  }, [agentIntent, history, learnRuntime]); // Only depend on agentIntent to avoid infinite loops

  return (
    <div className="myUniquechatbot">
      {/* key includes userId and agentIntent so switching users or intent re-initializes the runtime + history load */}
      <AssistantRuntimeProvider
        key={`${agentIntent}-${userId}`}
        runtime={learnRuntime}
      >
        <div className="flex justify-between px-0 py-0 w-full">
          <div className="grid grid-cols-1 gap-x-2 px-0 py-0 w-full">
            <Thread
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              typing={typing}
              image={user_image}
              companyLogo={companyLogo}
              loadingHistory={loadingHistory || isLoadingPayroll}
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
