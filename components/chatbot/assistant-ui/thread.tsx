import {
  ActionBarPrimitive,
  BranchPickerPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  TextContentPartComponent,
  ThreadPrimitive,
  useMessage,
} from "@assistant-ui/react";
import { useEffect, useRef, useState, type FC } from "react";
import {
  AlertCircle,
  ArrowDownIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  LinkIcon,
  PencilIcon,
  SendHorizontalIcon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";
import { cn } from "../../../lib/utils";

import { Button } from "../../../components/chatbot/ui/button";
import { TooltipIconButton } from "./tooltip-icon-button";
import { MarkdownText } from "./markdown-text";
import { useSpeechRecognition } from "./speech";
import { useThread } from "@assistant-ui/react";
import { UserMessageAttachments } from "../../../components/assistant-ui/attachment";
import toast from "react-hot-toast";
import { downloadPdf, sendEmail } from "../../../app/taxModelAdapter";
import { URLDisplay } from "./url-display";
import { Tooltip, TooltipTrigger } from "../ui/tooltip";
import TaxChatbot from "../../../app/payrollQuestionchat";
import { ErrorBanner } from './error-ui'

export const CHAT_HISTORY_KEY = "chat_history";

export function saveMessagesToLocalStorage(messages: any[]) {
  const trimmed = messages.slice(-20);
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(trimmed));
}

export const Thread: any = ({
  activeTab,
  setActiveTab,
  typing,
  image,
  userId,
  loadingHistory,
  sessionId,
  showTaxChatbot,
  payrollData,
  onTaxChatbotComplete,
  onContinueToChat,
  globalError
}: any) => {
  const { messages } = useThread();
  const [isLoading, setIsLoading] = useState(false);
  const [pdfData, setPdfData] = useState<any[]>([]);
  const [showDownloadLink, setShowDownloadLink] = useState(false);
  console.log(globalError, "messages", "----------------");
  const isStreaming = messages.some(
    (msg: any) => msg.role === "assistant" && msg.status?.type === "running"
  );
  console.log(payrollData, "p--hjegsj")
  const assistantMessages = [...messages]
    .reverse()
    .filter((msg) => msg.role === "assistant");

  const latest = assistantMessages[0];
  const suggestions = (latest?.metadata?.custom?.suggestions ?? []) as string[];

  // Handle tax chatbot completion - now using props
  const handleTaxChatbotComplete = (taxData: any) => {
    console.log('Tax data collected:', taxData);
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
  const shouldShowTaxChatbot = messages.length === 0 && showTaxChatbot;

  return (
    <>
      <div>
        <ThreadPrimitive.Root
          className="bg-white box-border flex flex-col overflow-hidden rounded-xl"
          style={{
            ["--thread-max-width" as string]: "42rem",
          }}
        >
          <div
            className="bg-[#255be305] overflow-hidden rounded-xl as"
            style={{ maxHeight: "935px" }}
          >
            <div
              style={{
                backgroundImage:
                  "url(https://i.ibb.co/0p2p5DSG/chat-Header-Bg.png)",
                backgroundSize: "cover",
                backgroundColor: "#255be305",
                backgroundRepeat: "no-repeat",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundPosition: "bottom",
                width: "100%",
                padding: "20px 16px 55px",
                position: "relative",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <img
                  src='https://appweb-bucket.s3.us-east-1.amazonaws.com/muse-logo.png'
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    maxHeight: "40px",
                    background: "white",
                  }}
                  alt="chatbot-Icon"
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <h3
                    style={{
                      color: "#ffffff",
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    How Can I Help You Today?
                  </h3>
                  <p
                    style={{
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: "normal",
                    }}
                  >
                    We typically reply in few minutes
                  </p>
                </div>
              </div>
            </div>

            {loadingHistory ? (
              <div className="flex items-center justify-center py-10 min-h-300">
                <div className="text-center">
                    <div className="flex items-center justify-center w-full mb-2"><div className="smooth-ring"></div></div>
                  {/* <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#4d37f5] mb-4"></div> */}
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Loading your conversation
                  </h3>
                  <p className="text-sm text-gray-500 animate-pulse">
                    Please wait while we retrieve your chat history...
                  </p>
        
                </div>
              </div>
            ) : (
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


                {globalError ? <ErrorBanner message={globalError} />
                  : shouldShowTaxChatbot ? (

                    <div style={{ height: "calc(100vh - 105px)", minHeight: "440px", overflowY: "auto" }}>
                      <TaxChatbot
                        onComplete={handleTaxChatbotComplete}
                        onContinueToChat={handleContinueToChat}
                        prefilledData={payrollData.payroll}
                      />
                    </div>
                  ) : (
                    <>
                      <ThreadPrimitive.Viewport
                        style={{
                          height: "calc(100vh - 210px)",
                          minHeight: "120px",
                          maxHeight: "740px",
                        }}
                        className="flex flex-col items-center chat-scroll overflow-y-scroll scroll-smooth bg-inherit pr-0 pl-3 pt-0"
                      >
                        <ThreadWelcome />

                        <ThreadPrimitive.Messages
                          components={{
                            UserMessage: (props) => (
                              <UserMessage {...props} image={image} />
                            ),
                            EditComposer: EditComposer,
                            AssistantMessage: (props) => (
                              <AssistantMessage {...props} />
                            ),
                          }}
                        />

                        <ThreadPrimitive.If empty={false}>
                          <div className="min-h-8 flex-grow" />
                        </ThreadPrimitive.If>
                      </ThreadPrimitive.Viewport>

                      <div className="sticky bg-[#255be305] bottom-0 px-3 pt-3 flex w-full max-w-[var(--thread-max-width)] flex-col items-center justify-end rounded-t-lg pb-2">
                        <Composer />
                        <ThreadScrollToBottom />
                      </div>
                    </>
                  )}
              </div>
            )}
          </div>
        </ThreadPrimitive.Root>
      </div>
    </>
  );
};

// Modified ThreadWelcome to handle the transition case
const ThreadWelcome: FC = () => {
  return (
    <ThreadPrimitive.Empty>
      <div className="flex w-full max-w-[var(--thread-max-width)] flex-grow flex-col px-4">
        <div className="flex w-full flex-grow flex-col items-center justify-center">
          <p className="mt-4 font-medium text-sm">
            Stuck with Taxes. No Worries Uncle Sam is Here
          </p>
        </div>
        <ThreadWelcomeSuggestions />
      </div>
    </ThreadPrimitive.Empty>
  );
};

const ThreadWelcomeSuggestions: FC = () => {
  return (
    <div className="mt-3 flex w-full items-stretch justify-center gap-4">
      <ThreadPrimitive.Suggestion
        className="hover:bg-muted/80 flex  max-w-sm grow basis-0 flex-col items-center justify-center rounded-lg border p-3 transition-colors ease-in"
        prompt="How can I claim my tax refund?"
        method="replace"
        autoSend
      >
        <span className="line-clamp-2 text-ellipsis text-sm font-medium">
          How can I claim my tax refund?
        </span>
      </ThreadPrimitive.Suggestion>
      <ThreadPrimitive.Suggestion
        className="hover:bg-muted/80 flex max-w-sm grow basis-0 flex-col items-center justify-center rounded-lg border p-3 transition-colors ease-in"
        prompt="What is a W-4 Form?"
        method="replace"
        autoSend
      >
        <span className="line-clamp-2 text-ellipsis text-sm font-medium">
          What is a W-4 Form?
        </span>
      </ThreadPrimitive.Suggestion>
    </div>
  );
};

const formatTime = (date: Date | string | number) => {
  const d = new Date(date);
  return d
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace("AM", "AM")
    .replace("PM", "PM");
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
    <ComposerPrimitive.Root
      className="focus-within:border-ring/20 flex w-full flex-wrap items-end rounded-full border border-[#E9E9E9] bg-inherit px-2.5 py-0 shadow-sm transition-colors ease-in gap-2 bg-white "
    >
      <ComposerPrimitive.Input
        ref={composerRef}
        rows={1}
        autoFocus
        placeholder="Write Your Message..."
        className="placeholder:text-muted-foreground custom_input flex-grow resize-none border-none bg-transparent px-2 py-4 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed"
      />
      <ComposerAction composerRef={composerRef} />
    </ComposerPrimitive.Root>
  );
};

interface ComposerActionProps {
  composerRef: React.RefObject<HTMLTextAreaElement | null>;
}

const ComposerAction: FC<ComposerActionProps> = ({ composerRef }) => {
  const { transcript, listening, startListening, stopListening } =
    useSpeechRecognition();
  const message = composerRef.current?.value.trim();

  useEffect(() => {
    if (transcript && composerRef.current) {
      const message =
        typeof transcript === "string" ? transcript : String(transcript);

      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value"
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
            className="my-2.5 size-8 p-2 bg-ChatBtnGradient rounded-full transition-opacity ease-in"
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
            className="my-2.5 size-8 p-2 transition-opacity ease-in"
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
    <MessagePrimitive.Root className="grid auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 [&:where(>*)]:col-start-2 w-full max-w-[var(--thread-max-width)] py-4">
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
          <div className="bg-ChatBtnGradient text-white d max-w-[calc(var(--thread-max-width)*0.8)] text-sm break-all break-words rounded-3xl px-5 py-2.5 col-start-2 row-start-2">
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
          <img
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
          <img
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

const EditComposer: FC = () => {
  return (
    <ComposerPrimitive.Root className="bg-muted my-4 flex w-full max-w-[var(--thread-max-width)] flex-col gap-2 rounded-xl">
      <ComposerPrimitive.Input className="text-foreground flex h-8 w-full resize-none bg-transparent p-4 pb-0 outline-none" />

      <div className="mx-3 mb-3 flex items-center justify-center gap-2 self-end">
        <ComposerPrimitive.Cancel asChild>
          <Button variant="ghost">Cancel</Button>
        </ComposerPrimitive.Cancel>
        <ComposerPrimitive.Send asChild>
          <Button>Send</Button>
        </ComposerPrimitive.Send>
      </div>
    </ComposerPrimitive.Root>
  );
};

const AssistantMessage: React.FC<any> = () => {
  const message = useMessage();
  const messageId = message?.id;
  const time = formatTime(message?.createdAt || Date.now());

  const urls: any = message?.metadata?.custom?.urls;
  const isMessageLoading = message?.metadata?.custom?.loading;
  const isStreaming = message?.metadata?.custom?.streaming;
  const [showUrls, setShowUrls] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: "8px",
        width: "100%",
        paddingLeft: "16px",
        paddingRight: "10px",
      }}
    >
      <span style={{ position: "relative", top: "10px" }}>
        <img
          style={{
            width: "25px",
            height: "25px",
            minWidth: "25px",
            minHeight: "25px",
            objectFit: "cover",
            borderRadius: "50%",
          }}
          src="https://appweb-bucket.s3.us-east-1.amazonaws.com/muse-logo.png"
          alt="useIcon"
        />
      </span>
      <MessagePrimitive.Root className="grid grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] relative w-full max-w-[var(--thread-max-width)] py-4 pr-2">
        <div className="text-foreground max-w-[calc(var(--thread-max-width)*0.8)] break-words leading-7 col-span-2 col-start-2 row-start-1 my-1.5">
          {isMessageLoading ? (
            <div className="flex flex-col  py-4">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
              </div>

              <span className="block text-sm text-gray-600 animate-pulse mt-2">
                Searching for information....
              </span>
            </div>

          ) : (
            <>
              <MessagePrimitive.Content components={{ Text: MarkdownText }} />

              {isStreaming && (
                <span className="inline-block w-2 h-0.5 bg-blue-500 animate-pulse ml-1"></span>
              )}

              {urls && !isStreaming && showUrls && (
                <URLDisplay urls={urls} messageId={messageId} />
              )}

              <span
                style={{ color: "#45556c", fontSize: "12px", marginTop: "4px" }}
              >
                {time}
              </span>
            </>
          )}
        </div>
        <AssistantActionBar urls={urls} onToggleUrls={() => setShowUrls((p) => !p)} />
        <BranchPicker className="col-start-2 row-start-2 -ml-2 mr-2" />
      </MessagePrimitive.Root>
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

  const firstUrl = urls[0];

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
        className
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