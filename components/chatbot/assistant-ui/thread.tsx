import {
  ActionBarPrimitive,
  BranchPickerPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  TextContentPartComponent,
  ThreadPrimitive,
  useMessage,
  useThreadRuntime,
} from "@assistant-ui/react";
import { useEffect, useLayoutEffect, useRef, useState, type FC } from "react";
import {
  ArrowDownIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  LinkIcon,
  PencilIcon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";
import { cn } from "../../../lib/utils";
// import { Button } from "../../../components/chatbot/ui/button";
import { TooltipIconButton } from "./tooltip-icon-button";
import { MarkdownText } from "./markdown-text";
import { useSpeechRecognition } from "./speech";
import { useThread } from "@assistant-ui/react";
import { UserMessageAttachments } from "../../../components/assistant-ui/attachment";
// import toast from "react-hot-toast";
// import { downloadPdf, sendEmail } from "../../../app/taxModelAdapter";
import { URLDisplay } from "./url-display";
import { Tooltip, TooltipTrigger } from "../ui/tooltip";
import TaxChatbot from "../../../app/payrollQuestionchat";
import { ErrorBanner } from "./error-ui";
import Image from "next/image";
// import { HomeScreen } from "./home-screen";
// import { LifeEventsScreen } from "./life-events-screen";
// import { LifeEventsForm } from "./life-events-form";
import { SelcectForHowToFillDataButton } from "./handleUploadOCR";
import { OCRUploadComponent } from "./OCRUploadComponent";
import { ScenarioCheckbox } from "./scenario-checkbox";
import { SendHorizontalIcon } from "../../../app/payrollQuestion/icons";
// import Image from "next/image";

export const CHAT_HISTORY_KEY = "chat_history";

export function saveMessagesToLocalStorage(messages: any[]) {
  const trimmed = messages.slice(-20);
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(trimmed));
}

interface PayloadInterface {
  enterManually: boolean;
  ocr: boolean;
}
export const Thread: any = ({
  // activeTab,
  // setActiveTab,
  // typing,
  image,
  companyLogo,
  userId,
  // loadingHistory,
  sessionId,
  showTaxChatbot,
  payrollData,
  onTaxChatbotComplete,
  onContinueToChat,
  globalError,
  showHomeScreen,
  // onSelectIntent,
  // onReturnToHome,
  // showLifeEventsScreen,
  // showLifeEventsForm,
  // selectedLifeEventCategory,
  // onSelectLifeEventCategory,
  // onBackToLifeEventsCategories,
  // onSaveLifeEvents,
  agentIntent,
}: any) => {
  console.log(showHomeScreen, "jknjkdw");
  const { messages } = useThread();
  // const [isLoading, setIsLoading] = useState(false);
  // const [pdfData, setPdfData] = useState<any[]>([]);
  // const [showDownloadLink, setShowDownloadLink] = useState(false);
  console.log(globalError, "messages", "----------------", messages);
  // const isStreaming = messages.some(
  //   (msg: any) => msg.role === "assistant" && msg.status?.type === "running"
  // );
  console.log(payrollData, "p--hjegsj");
  const assistantMessages = [...messages]
    .reverse()
    .filter((msg) => msg.role === "assistant");

  const latest = assistantMessages[0];
  const suggestions = (latest?.metadata?.custom?.suggestions ?? []) as string[];

  // Handle tax chatbot completion - now using props
  const handleTaxChatbotComplete = (taxData: any) => {
    console.log("Tax data collected:", taxData);
    if (onTaxChatbotComplete) {
      onTaxChatbotComplete(taxData);
    }
  };

  // Handle continue to chat from tax chatbot - now using props
  const handleContinueToChat = () => {
    if (onContinueToChat) {
      onContinueToChat();
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      window.speechSynthesis.cancel();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Check if we should show the tax chatbot based on props
  // const shouldShowTaxChatbot = messages.length === 0 && showTaxChatbot;
  const shouldShowTaxChatbot = showTaxChatbot;
  const [showScenarios, setShowScenarios] = useState(false);
  const [payloadButton, setPayloadButton] = useState<PayloadInterface>({
    enterManually: false,
    ocr: false,
  });
  const taxChatbotScrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (payloadButton.enterManually && taxChatbotScrollRef.current) {
      taxChatbotScrollRef.current.scrollTop = 0;
    }
  }, [payloadButton.enterManually]);

  return (
    <>
      <div>
        <ThreadPrimitive.Root
          className="bg-[#ECE8F8] box-border flex flex-col overflow-hidden rounded-xl"
          style={{
            ["--thread-max-width" as string]: "42rem",
          }}
        >
          <div
            className=" overflow-hidden rounded-xl as"
            style={{ maxHeight: "935px", position: "sticky", top: "0" }}
          >
            <div>
              {/* Show tax chatbot if no messages and form not completed */}

              {/* { <div key={1} className="flex justify-center my-8">
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 max-w-md w-full shadow-sm">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-red-800 font-semibold text-sm mb-1">Error</p>
                      <p className="text-red-700 text-sm">{"123432"}</p>
                    </div>
                  </div>
                </div>
              </div>} */}

              {globalError ? (
                <ErrorBanner message={globalError} />
              ) : // ) : showHomeScreen ? (
              //   <HomeScreen
              //     onSelectIntent={onSelectIntent}
              //     companyLogo={companyLogo}
              //   />
              // ) : showLifeEventsScreen ? (
              //   <LifeEventsScreen
              //     onSelectCategory={onSelectLifeEventCategory}
              //     onBack={onReturnToHome}
              //   />
              // ) : showLifeEventsForm ? (
              //   <LifeEventsForm
              //     category={selectedLifeEventCategory}
              //     onBack={onBackToLifeEventsCategories}
              //     onSave={onSaveLifeEvents}
              //     userId={userId}
              //   />
              shouldShowTaxChatbot ? (
                <div
                  ref={taxChatbotScrollRef}
                  style={{
                    height: "calc(100vh - 130px)",
                    minHeight: "440px",
                    overflowY: "auto",
                    overflowAnchor: "none",
                  }}
                >
                  {!payloadButton.enterManually && !payloadButton.ocr && (
                    <SelcectForHowToFillDataButton
                      setPayloadButton={setPayloadButton}
                    />
                  )}

                  {/* <TaxChatbot
                      onComplete={handleTaxChatbotComplete}
                      onContinueToChat={handleContinueToChat}
                      prefilledData={payrollData.payroll}
                      allfillData={payrollData}

                      image={image}
                      companyLogo={companyLogo}
                      agentIntent={agentIntent as "tax_refund_calculation" | "tax_paycheck_calculation"}
                      
                    /> */}
                  {payloadButton.enterManually && (
                    <TaxChatbot
                      onComplete={handleTaxChatbotComplete}
                      onContinueToChat={handleContinueToChat}
                      prefilledData={payrollData.payroll}
                      allfillData={payrollData}
                      image={image}
                      companyLogo={companyLogo}
                      agentIntent={
                        agentIntent as
                          | "tax_refund_calculation"
                          | "tax_paycheck_calculation"
                      }
                    />
                  )}

                  {payloadButton.ocr && (
                    <OCRUploadComponent
                      userId={userId}
                      onComplete={handleTaxChatbotComplete}
                      // onSave={(payload) => {
                      //   console.log("OCR payload:", payload);
                      //   // then trigger TaxChatbot with prefilled data
                      // }}
                    />
                  )}
                </div>
              ) : (
                <>
                  <ThreadPrimitive.Viewport
                    style={{
                      height: "calc(100vh - 80px)",
                      minHeight: "120px",
                      maxHeight: "740px",
                    }}
                    className="flex flex-col items-center chat-scroll overflow-y-scroll scroll-smooth bg-inherit pr-0 pl-3 pt-0"
                  >
                    <ThreadWelcome agentIntent={agentIntent} />

                    <ThreadPrimitive.Messages
                      components={{
                        UserMessage: (props) => (
                          <UserMessage {...props} image={image} />
                        ),
                        // EditComposer: EditComposer,
                        AssistantMessage: (props) => (
                          <AssistantMessage
                            {...props}
                            companyLogo={companyLogo}
                            // onReturnToHome={onReturnToHome}
                            userId={userId}
                            sessionId={sessionId}
                            agentIntent={agentIntent}
                            showScenarios={showScenarios}
                            setShowScenarios={setShowScenarios}
                          />
                        ),
                      }}
                    />

                    <ThreadPrimitive.If empty={false}>
                      <div className="min-h-8 flex-grow" />
                    </ThreadPrimitive.If>
                    <div className="mt-3 p-4 flex w-full flex-col items-center justify-center gap-2">
                      {!showScenarios &&
                        suggestions.map((s, i) => (
                          <ThreadPrimitive.Suggestion
                            key={i}
                            prompt={s}
                            autoSend
                            method="replace"
                            className="hover:bg-muted/80 flex max-w-sm grow basis-0 flex-col items-center justify-center rounded-lg border px-2 py-3 transition-colors ease-in custom-hover"
                          >
                            <span className="line-clamp-2 text-ellipsis text-sm font-medium">
                              {s}
                            </span>
                          </ThreadPrimitive.Suggestion>
                        ))}
                    </div>
                  </ThreadPrimitive.Viewport>

                  <div className="sticky bg-[#ECE8F8] bottom-0 px-3 pt-3 flex w-full max-w-[var(--thread-max-width)] flex-col items-center justify-end rounded-t-lg pb-2">
                    <Composer />
                    <ThreadScrollToBottom />
                  </div>
                </>
              )}
            </div>
          </div>
        </ThreadPrimitive.Root>
      </div>
    </>
  );
};

// Modified ThreadWelcome to handle the transition case
const ThreadWelcome: FC<any> = ({ agentIntent }) => {
  const thread = useThreadRuntime();
  const handleCalculateClick = async () => {
    // This sends a message into the assistant thread
    thread.append({
      role: "user",
      content: [
        {
          type: "text",
          text: `Let’s begin calculating my ${
            agentIntent === "tax_paycheck_calculation" ? "paycheck" : "tax"
          }`,
        },
      ],
    });
  };
  return (
    <ThreadPrimitive.Empty>
      <div className="flex w-full max-w-[var(--thread-max-width)] flex-grow flex-col px-4">
        <div className="flex w-full flex-grow flex-col items-center justify-center">
          <div
            className="mt-4 font-medium text-sm"
            style={{
              maxWidth: "500px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {/* Stuck with Taxes. No Worries Uncle Sam is Here */}
            <h4
              style={{
                fontSize: "16px",
                fontWeight: 400,
                textAlign: "center",
                marginBottom: "8px",
              }}
            >
              {/* Hi, I’m Uncle Sam your personal tax helper! */}
              Ready to Calculate Your Taxes?
            </h4>
            <p
              style={{ fontSize: "14px", fontWeight: 400, textAlign: "center" }}
              className="mt-2 text-center text-sm text-muted-foreground max-w-md"
            >
              {/* Have questions about your taxes, want to check your refund, or
              need to update your profile after a life event? Don’t worry Uncle
              Sam is here to help! */}
              Hi, I’m Uncle Sam ! Your personal tax assistant. Need help
              calculating your taxes, checking your refund, or updating your
              info after a life change? I’ve got you covered. Let’s get started!
            </p>
            {(agentIntent === "tax_paycheck_calculation" ||
              agentIntent === "tax_refund_calculation") && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleCalculateClick}
                  className="px-6 py-2 rounded-full font-medium text-white shadow-md transition-all"
                  style={{
                    backgroundColor: "#6F56DD",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#6F56DD")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#6F56DD")
                  }
                >
                  Start My{" "}
                  {agentIntent === "tax_paycheck_calculation"
                    ? "paycheck"
                    : "tax"}{" "}
                  Calculation
                </button>
              </div>
            )}
          </div>
        </div>
        {/* <ThreadWelcomeSuggestions /> */}
      </div>
    </ThreadPrimitive.Empty>
  );
};

// const ThreadWelcomeSuggestions: FC = () => {
//   return (
//     <div className="mt-3 flex w-full items-stretch justify-center gap-4">
//       <ThreadPrimitive.Suggestion
//         className="hover:bg-muted/80 flex  max-w-sm grow basis-0 flex-col items-center justify-center rounded-lg border p-3 transition-colors ease-in"
//         prompt="How can I claim my tax refund?"
//         method="replace"
//         autoSend
//       >
//         <span className="line-clamp-2 text-ellipsis text-sm font-medium">
//           How can I claim my tax refund?
//         </span>
//       </ThreadPrimitive.Suggestion>
//       <ThreadPrimitive.Suggestion
//         className="hover:bg-muted/80 flex max-w-sm grow basis-0 flex-col items-center justify-center rounded-lg border p-3 transition-colors ease-in"
//         prompt="What is a W-4 Form?"
//         method="replace"
//         autoSend
//       >
//         <span className="line-clamp-2 text-ellipsis text-sm font-medium">
//           What is a W-4 Form?
//         </span>
//       </ThreadPrimitive.Suggestion>
//     </div>
//   );
// };

export const formatTime = (date: Date | string | number): string => {
  const d = new Date(date);
  return d
    .toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/\bam\b/i, "AM")
    .replace(/\bpm\b/i, "PM");
};

const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        className="absolute -top-8 rounded-full disabled:invisible"
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

const Composer: FC = () => {
  const composerRef = useRef<HTMLTextAreaElement | null>(null);

  return (
    <ComposerPrimitive.Root className=" flex w-full flex-wrap items-end  bg-inherit px-2.5 py-0  transition-colors ease-in gap-2  ">
      <ComposerPrimitive.Input
        ref={composerRef}
        rows={1}
        autoFocus
        placeholder="Please Ask Your Query..."
        className="placeholder:text-muted-foreground custom_input flex-grow resize-none  px-2 py-4 focus-within:border-ring/20  border border-[#E9E9E9] rounded-xl text-sm outline-none focus:ring-0 disabled:cursor-not-allowed  shadow-sm"
        style={{ backgroundColor: "#F4F3F9" }}
      />
      <ComposerAction composerRef={composerRef} />
    </ComposerPrimitive.Root>
  );
};

interface ComposerActionProps {
  composerRef: React.RefObject<HTMLTextAreaElement | null>;
}

const ComposerAction: FC<ComposerActionProps> = ({ composerRef }) => {
  // const { transcript, listening, startListening, stopListening } =
  const { transcript, listening } = useSpeechRecognition();
  // const message = composerRef.current?.value.trim();

  useEffect(() => {
    if (transcript && composerRef.current) {
      const message =
        typeof transcript === "string" ? transcript : String(transcript);

      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value",
      )?.set;
      nativeSetter?.call(composerRef.current, message);

      composerRef.current.dispatchEvent(new Event("input", { bubbles: true }));

      if (!listening) {
        const enterEvent = new KeyboardEvent("keydown", {
          key: "Enter",
          code: "Enter",
          bubbles: true,
        });

        composerRef.current.dispatchEvent(enterEvent);
      }
    }
  }, [transcript, listening, composerRef]);

  return (
    <>
      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.AddAttachment
          asChild
        ></ComposerPrimitive.AddAttachment>

        <ComposerPrimitive.Send asChild>
          <TooltipIconButton
            tooltip="Send"
            variant="default"
            className=" p-0 size-12  bg-ChatBtnGradient rounded-xl transition-opacity ease-in"
            style={{ height: "52px", width: "52px" }}
          >
            <SendHorizontalIcon />
          </TooltipIconButton>
        </ComposerPrimitive.Send>
      </ThreadPrimitive.If>

      <ThreadPrimitive.If running>
        <ComposerPrimitive.Cancel asChild>
          <TooltipIconButton
            tooltip="Cancel"
            variant="default"
            className=" size-12 p-2 transition-opacity ease-in"
            style={{ height: "52px", width: "52px" }}
          >
            <CircleStopIcon />
          </TooltipIconButton>
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </>
  );
};

const TrimmedText: TextContentPartComponent = ({ text }) => {
  return <>{text.trimEnd()}</>;
};

interface UserMessageProps {
  image?: any;
}

const UserMessage: React.FC<UserMessageProps> = ({ image }) => {
  const message = useMessage();
  const time = formatTime(message?.createdAt || Date.now());

  return (
    <MessagePrimitive.Root
      className="grid auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 [&:where(>*)]:col-start-2 w-full max-w-[var(--thread-max-width)] "
      style={{ paddingTop: "4px", paddingBottom: "2px" }}
    >
      <div style={{ minWidth: "70px" }}>
        <UserActionBar />
      </div>
      <UserMessageAttachments />

      <div
        style={{
          display: "flex",
          justifyContent: "end",
          gap: "8px",
          alignItems: "start",
          paddingLeft: "16px",
          paddingRight: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
          }}
        >
          <div className="bg-ChatBtnGradient text-white d max-w-[calc(var(--thread-max-width)*0.8)] text-sm break-all break-words rounded-xl px-5 py-2.5 col-start-2 row-start-2">
            <MessagePrimitive.Content components={{ Text: TrimmedText }} />
          </div>
          <span
            style={{ color: "#45556c", fontSize: "12px", marginTop: "4px" }}
          >
            {time}
          </span>
        </div>
        <BranchPicker className="col-span-full col-start-1 row-start-3 -mr-1 justify-end" />
        {image ? (
          <Image
            priority
            width={25}
            height={25}
            style={{
              width: "25px",
              height: "25px",
              minHeight: "25px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
            src={image}
            alt="useIcon"
          />
        ) : (
          <Image
            priority
            width={25}
            height={25}
            style={{
              width: "25px",
              height: "25px",
              minHeight: "25px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
            src="https://i.ibb.co/Ty3Grj0/dummy-Icon.png"
            alt="useIcon"
          />
        )}
      </div>
    </MessagePrimitive.Root>
  );
};

const UserActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="flex flex-col items-end col-start-1 row-start-2 mr-3 mt-2.5"
    >
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton tooltip="Edit">
          <PencilIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};

// const EditComposer: FC = () => {
//   return (
//     <ComposerPrimitive.Root className="bg-muted my-4 flex w-full max-w-[var(--thread-max-width)] flex-col gap-2 rounded-xl">
//       <ComposerPrimitive.Input className="text-foreground flex h-8 w-full resize-none bg-transparent p-4 pb-0 outline-none" />

//       <div className="mx-3 mb-3 flex items-center justify-center gap-2 self-end">
//         <ComposerPrimitive.Cancel asChild>
//           <Button variant="ghost">Cancel</Button>
//         </ComposerPrimitive.Cancel>
//         <ComposerPrimitive.Send asChild>
//           <Button>Send</Button>
//         </ComposerPrimitive.Send>
//       </div>
//     </ComposerPrimitive.Root>
//   );
// };

const AssistantMessage: React.FC<any> = ({
  companyLogo,
  // onReturnToHome,
  userId,
  sessionId,
  agentIntent,
  showScenarios,
  setShowScenarios,
}) => {
  const message = useMessage();
  const { messages } = useThread();
  const messageId = message?.id;
  const time = formatTime(message?.createdAt || Date.now());

  const urls: any = message?.metadata?.custom?.urls;
  const isMessageLoading = message?.metadata?.custom?.loading;
  const isStreaming = message?.metadata?.custom?.streaming;
  // const refundCalculated = message?.metadata?.custom?.refundCalculated;
  const paycheckCalculated = message?.metadata?.custom?.paycheckCalculated;
  const [showUrls, setShowUrls] = useState(false);
  // const [showScenarios, setShowScenarios] = useState(false);

  // Check if this is the last assistant message
  const assistantMessages = messages.filter(
    (msg: any) => msg.role === "assistant",
  );
  const isLastMessage =
    assistantMessages[assistantMessages.length - 1]?.id === messageId;

  // Check if any message is currently streaming
  const isAnyMessageStreaming = messages.some(
    (msg: any) => msg.role === "assistant" && msg.metadata?.custom?.streaming,
  );

  // Debug logging for scenario button
  // console.log("🔍 AssistantMessage metadata:", {
  //   messageId,
  //   refundCalculated,
  //   paycheckCalculated,
  //   agentIntent,
  //   isLastMessage,
  //   isStreaming,
  //   isMessageLoading,
  //   metadata: message?.metadata?.custom
  // });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        paddingLeft: "10px",
        paddingRight: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "8px",
          width: "100%",
        }}
      >
        <span
          style={{
            display: "inline-block",
            position: "relative",
            marginTop: "10px",
          }}
        >
          {companyLogo ? (
            <Image
              priority
              width={25}
              height={25}
              src={companyLogo}
              style={{
                width: "25px",
                height: "25px",
                minWidth: "25px",
                minHeight: "25px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
              alt="Company Logo"
            />
          ) : (
            <Image
              priority
              width={25}
              height={25}
              style={{
                width: "25px",
                height: "25px",
                minWidth: "25px",
                minHeight: "25px",
                objectFit: "contain",
                borderRadius: "50%",
              }}
              src="https://appweb-bucket.s3.us-east-1.amazonaws.com/muse-logo.png"
              alt="useIcon"
            />
          )}
        </span>
        <MessagePrimitive.Root className="grid grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] relative w-full max-w-[var(--thread-max-width)] py-2 pr-2">
          <div className="text-foreground max-w-[calc(var(--thread-max-width)*0.8)] break-words leading-7 col-span-2 col-start-2 row-start-1 my-1.5">
            {isMessageLoading ? (
              <div className="flex flex-col  py-4">
                <div className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0s" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></span>
                </div>

                <span className="block text-sm text-gray-600 animate-pulse mt-2">
                  Searching for information....
                </span>
              </div>
            ) : (
              <>
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "12px",
                    borderRadius: "12px",
                  }}
                >
                  <MessagePrimitive.Content
                    components={{ Text: MarkdownText }}
                  />

                  {isStreaming && (
                    <span className="inline-block w-2 h-0.5 bg-blue-500 animate-pulse ml-1"></span>
                  )}

                  {urls && !isStreaming && showUrls && (
                    <URLDisplay urls={urls} messageId={messageId} />
                  )}
                </div>
                <span
                  style={{
                    color: "#45556c",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {time}
                </span>
              </>
            )}
          </div>
          <AssistantActionBar
            urls={urls}
            onToggleUrls={() => setShowUrls((p) => !p)}
          />
          <BranchPicker className="col-start-2 row-start-2 -ml-2 mr-2" />
        </MessagePrimitive.Root>
      </div>

      {/* Return to Home Screen Button - Only show on last message when not streaming */}
      {/* {!isAnyMessageStreaming &&
        !isMessageLoading &&
        onReturnToHome &&
        isLastMessage && (
          <div style={{ marginTop: "12px", marginLeft: "32px" }}>
            <button
              onClick={onReturnToHome}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#ffffff",
                background:
                  "linear-gradient(90deg, #69DEC6 0%, #49C2D4 50%, #1595EA 100%)",
                border: "none",
                borderRadius: "24px",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                boxShadow: "0 2px 8px rgba(21, 149, 234, 0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(21, 149, 234, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(21, 149, 234, 0.2)";
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Return to Home Screen
            </button>
          </div>
        )} */}

      {/* Check Other Scenarios Button - Show when refund or paycheck calculated */}
      {!isAnyMessageStreaming &&
        !isMessageLoading &&
        isLastMessage &&
        paycheckCalculated &&
        agentIntent === "tax_paycheck_calculation" &&
        !showScenarios && (
          <div style={{ marginTop: "12px", marginLeft: "32px" }}>
            <button
              onClick={() => setShowScenarios(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#ffffff",
                background:
                  "linear-gradient(90deg, #69DEC6 0%, #49C2D4 50%, #1595EA 100%)",
                border: "none",
                borderRadius: "24px",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                boxShadow: "0 2px 8px rgba(21, 149, 234, 0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(21, 149, 234, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(21, 149, 234, 0.2)";
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
                <polyline points="7.5 19.79 7.5 14.6 3 12" />
                <polyline points="21 12 16.5 14.6 16.5 19.79" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              Check Other Scenarios
            </button>
          </div>
        )}

      {/* Inline Scenario Checkbox - Show when button is clicked */}
      {!isAnyMessageStreaming &&
        !isMessageLoading &&
        isLastMessage &&
        paycheckCalculated &&
        agentIntent === "tax_paycheck_calculation" &&
        showScenarios && (
          <div
            style={{ marginTop: "12px", marginLeft: "32px", maxWidth: "600px" }}
          >
            <ScenarioCheckbox
              userId={userId}
              sessionId={sessionId}
              agentIntent={agentIntent}
              setShowScenarios={setShowScenarios}
            />
          </div>
        )}
    </div>
  );
};

interface ActionBarProps {
  urls: string[];
  onToggleUrls: () => void;
}

const AssistantActionBar: FC<ActionBarProps> = ({ urls, onToggleUrls }) => {
  const [open, setOpen] = useState(false);
  if (!urls || !Array.isArray(urls) || urls.length === 0) return null;

  // const firstUrl = urls[0];

  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
      className="text-muted-foreground flex gap-1 col-start-3 row-start-2 -ml-1 data-[floating]:bg-background data-[floating]:absolute data-[floating]:rounded-md data-[floating]:border data-[floating]:p-1 data-[floating]:shadow-sm"
    >
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip="Copy">
          <MessagePrimitive.If copied>
            <CheckIcon />
          </MessagePrimitive.If>
          <MessagePrimitive.If copied={false}>
            <CopyIcon />
          </MessagePrimitive.If>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>

      <MessagePrimitive.If speaking={false}>
        <ActionBarPrimitive.Speak asChild>
          <TooltipIconButton tooltip="Speak">
            <Volume2Icon />
          </TooltipIconButton>
        </ActionBarPrimitive.Speak>
      </MessagePrimitive.If>

      <MessagePrimitive.If speaking>
        <ActionBarPrimitive.StopSpeaking asChild>
          <TooltipIconButton tooltip="Stop speaking">
            <VolumeXIcon />
          </TooltipIconButton>
        </ActionBarPrimitive.StopSpeaking>
      </MessagePrimitive.If>

      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <TooltipIconButton
            tooltip="Related resources"
            onClick={(e) => {
              e.preventDefault();
              onToggleUrls();
            }}
          >
            <LinkIcon />
          </TooltipIconButton>
        </TooltipTrigger>
      </Tooltip>
    </ActionBarPrimitive.Root>
  );
};

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
  className,
  ...rest
}) => {
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn(
        "text-muted-foreground inline-flex items-center text-xs",
        className,
      )}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton tooltip="Previous">
          <ChevronLeftIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className="font-medium">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton tooltip="Next">
          <ChevronRightIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};

const CircleStopIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      width="16"
      height="16"
    >
      <rect width="10" height="10" x="3" y="3" rx="2" />
    </svg>
  );
};
