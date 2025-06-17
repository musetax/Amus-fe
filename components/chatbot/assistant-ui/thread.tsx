import {
  ActionBarPrimitive,
  BranchPickerPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive
} from "@assistant-ui/react";
import { useEffect, useRef, useState, type FC } from "react";
import {
  ArrowDownIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  Mic,
  PencilIcon,
  Percent,
  PieChart,
  SendHorizontalIcon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/chatbot/ui/button";
import { TooltipIconButton } from "./tooltip-icon-button";
import { MarkdownText } from "./markdown-text";
import axios from "axios";
import TaxDataModal from "./tax-data";
import { useSpeechRecognition } from "./speech";
import { useThread } from "@assistant-ui/react";

import { ComposerAttachments } from "@/components/assistant-ui/attachment";

import { UserMessageAttachments } from "@/components/assistant-ui/attachment";
import { axiosInstance } from "@/utilities/axios";
export const Thread: any = ({ activeTab, setActiveTab }: any) => {
  useEffect(() => {
    const handleBeforeUnload = () => {
      window.speechSynthesis.cancel();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const { messages } = useThread();

  const assistantMessages = [...messages]
    .reverse()
    .filter((msg) => msg.role === "assistant");

  const latest = assistantMessages[0];
  const suggestions = (latest?.metadata?.custom?.suggestions ?? []) as string[];

  const [taxBoxPopUp, setTaxBoxPopUp] = useState(true);

  const taxBoxApi = async (data: any) => {
    try {
      console.log("usedddd-----")
      

      await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/tax-profile/checkboost`,
        // `https://3a20-103-223-15-108.ngrok-free.app/api/tax-profile/checkboost`,

        data,
      );
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };
  const handleChange = () => {
    setActiveTab("tax");
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center space-x-4 mb-10 border border-lightGray7 rounded-full p-2">
            <button
              onClick={() => handleChange()}
              className={`px-4 py-2  rounded-full text-lg font-medium flex items-center justify-center gap-2  transition-all duration-200 ${
                activeTab === "tax"
                  ? "bg-mediumBlueGradient text-white"
                  : "text-textgray "
              }`}
            >
              <PieChart /> Tax Calculation
            </button>
            <button
              onClick={() => setActiveTab("learn")}
              className={`px-5 py-2  rounded-full text-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
                activeTab === "learn"
                  ? "bg-mediumBlueGradient text-white"
                  : "text-textgray"
              }`}
            >
              <Percent /> Learn About Tax
            </button>
          </div>
        </div>
        {activeTab === "tax" ? (
          <>
            {
              <>
                {taxBoxPopUp ? (
                  <TaxDataModal
                    isOpen={taxBoxPopUp}
                    onClose={() => setTaxBoxPopUp(false)}
                    apiCall={taxBoxApi}
                  />
                ) : (
                  <ThreadPrimitive.Root
                    className="bg-background box-border flex flex-col overflow-hidden"
                    style={{
                      ["--thread-max-width" as string]: "42rem",
                    }}
                  >
                    <ThreadPrimitive.Viewport className="flex h-[calc(100vh-260px)] flex-col items-center chat-scroll overflow-y-scroll scroll-smooth bg-inherit px-4 pt-8">
                      <ThreadWelcomeTax />

                      <ThreadPrimitive.Messages
                        components={{
                          UserMessage: UserMessage,
                          EditComposer: EditComposer,
                          AssistantMessage: AssistantMessage,
                        }}
                      />

                      <ThreadPrimitive.If empty={false}>
                        <div className="min-h-8 flex-grow" />
                      </ThreadPrimitive.If>
                      {/* <div className="mt-3 p-4 flex w-full items-stretch justify-center gap-4">
                        {suggestions.map((s, i) => (
                          <ThreadPrimitive.Suggestion
                            key={i}
                            prompt={s}
                            autoSend
                            method="replace"
                            className="hover:bg-muted/80 flex max-w-sm grow basis-0 flex-col items-center justify-center rounded-lg border p-3 transition-colors ease-in"
                          >
                            <span className="line-clamp-2 text-ellipsis text-sm font-semibold">
                              {s}
                            </span>
                          </ThreadPrimitive.Suggestion>
                        ))}
                      </div> */}
                      {/* <ThreadPrimitive.Suggestion /> */}
                      <Composer />
                    </ThreadPrimitive.Viewport>
                  </ThreadPrimitive.Root>
                )}
              </>
            }
          </>
        ) : (
          <ThreadPrimitive.Root
            className="bg-background box-border flex flex-col overflow-hidden"
            style={{
              ["--thread-max-width" as string]: "42rem",
            }}
          >
            <ThreadPrimitive.Viewport className="flex h-[calc(100vh-260px)] flex-col items-center chat-scroll overflow-y-scroll scroll-smooth bg-inherit px-4 pt-8">
              <ThreadWelcome />

              <ThreadPrimitive.Messages
                components={{
                  UserMessage: UserMessage,
                  EditComposer: EditComposer,
                  AssistantMessage: AssistantMessage,
                }}
              />

              <ThreadPrimitive.If empty={false}>
                <div className="min-h-8 flex-grow" />
              </ThreadPrimitive.If>

              <div className="sticky bottom-0 mt-3 flex w-full max-w-[var(--thread-max-width)] flex-col items-center justify-end rounded-t-lg bg-inherit pb-4">
                <ThreadScrollToBottom />
                <div className="mt-3 p-4 flex w-full items-stretch justify-center gap-4">
                  {suggestions.map((s, i) => (
                    <ThreadPrimitive.Suggestion
                      key={i}
                      prompt={s}
                      autoSend
                      method="replace"
                      className="hover:bg-muted/80 flex max-w-sm grow basis-0 flex-col items-center justify-center rounded-lg border p-3 transition-colors ease-in"
                    >
                      <span className="line-clamp-2 text-ellipsis text-sm font-semibold">
                        {s}
                      </span>
                    </ThreadPrimitive.Suggestion>
                  ))}
                </div>
                <Composer />
              </div>
            </ThreadPrimitive.Viewport>
          </ThreadPrimitive.Root>
        )}
      </div>
    </>
  );
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
const ThreadWelcomeTax: FC = () => {
  return (
    <ThreadPrimitive.Empty>
      <div className="flex w-full max-w-[var(--thread-max-width)] flex-grow flex-col">
        <div className="flex w-full flex-grow flex-col items-center justify-center">
          <p className="mt-4 font-medium">
            Hello valued customer! I'm Uncle Sam, your tax assistant. How can I
            help you today?
          </p>
        </div>
        {/* <ThreadWelcomeSuggestions /> */}
      </div>
    </ThreadPrimitive.Empty>
  );
};

const ThreadWelcome: FC = () => {
  return (
    <ThreadPrimitive.Empty>
      <div className="flex w-full max-w-[var(--thread-max-width)] flex-grow flex-col">
        <div className="flex w-full flex-grow flex-col items-center justify-center">
          <p className="mt-4 font-medium">
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
        className="hover:bg-muted/80 flex max-w-sm grow basis-0 flex-col items-center justify-center rounded-lg border p-3 transition-colors ease-in"
        prompt="How can I claim my tax refund?"
        method="replace"
        autoSend
      >
        <span className="line-clamp-2 text-ellipsis text-sm font-semibold">
          How can I claim my tax refund?
        </span>
      </ThreadPrimitive.Suggestion>
      <ThreadPrimitive.Suggestion
        className="hover:bg-muted/80 flex max-w-sm grow basis-0 flex-col items-center justify-center rounded-lg border p-3 transition-colors ease-in"
        prompt="What is a W-4 Form?"
        method="replace"
        autoSend
      >
        <span className="line-clamp-2 text-ellipsis text-sm font-semibold">
          What is a W-4 Form?
        </span>
      </ThreadPrimitive.Suggestion>
    </div>
  );
};

const Composer: FC = () => {
  const composerRef = useRef<HTMLTextAreaElement | null>(null);

  return (
    <ComposerPrimitive.Root className="focus-within:border-ring/20 flex w-full flex-wrap items-end rounded-lg border bg-inherit px-2.5 shadow-sm transition-colors ease-in gap-2">
      <ComposerAttachments />
      <ComposerPrimitive.Input
        ref={composerRef}
        rows={1}
        autoFocus
        placeholder="Write a message..."
        className="placeholder:text-muted-foreground max-h-40 flex-grow resize-none border-none bg-transparent px-2 py-4 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed"
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
  console.log("Submitted message:", message);
   useEffect(() => {
    if (transcript && composerRef.current) {
      const message =
        typeof transcript === "string" ? transcript : String(transcript);
      console.log(message, "messages");

      // Set value via native setter
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value"
      )?.set;
      nativeSetter?.call(composerRef.current, message);

      // Trigger input event for Assistant UI to detect change
      composerRef.current.dispatchEvent(new Event("input", { bubbles: true }));

      // Submit after speech ends
      if (!listening) {
        const enterEvent = new KeyboardEvent("keydown", {
          key: "Enter",
          code: "Enter",
          bubbles: true,
        });
        console.log("ccccccccccccccccc");

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

        <TooltipIconButton
          tooltip={listening ? "Stop recording" : "Voice input"}
          onClick={listening ? stopListening : startListening}
          variant="default"
          className={`my-2.5 size-8 p-2 border border-lightGray4 rounded-full transition-opacity ease-in ${
            listening ? "bg-lightGray2" : "bg-transparent"
          }`}
        >
          {listening ? (
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          ) : (
            <Mic className="text-textgray" />
          )}
        </TooltipIconButton>

        <ComposerPrimitive.Send asChild>
          <TooltipIconButton
            tooltip="Send"
            variant="default"
            className="my-2.5 size-8 p-2 bg-mediumBlueGradient rounded-full transition-opacity ease-in"
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

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="grid auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 [&:where(>*)]:col-start-2 w-full max-w-[var(--thread-max-width)] py-4">
      <UserActionBar />
      <UserMessageAttachments />

      <div className="bg-lightBlue text-slateColor max-w-[calc(var(--thread-max-width)*0.8)] break-words rounded-3xl px-5 py-2.5 col-start-2 row-start-2">
        <MessagePrimitive.Content />
      </div>

      <BranchPicker className="col-span-full col-start-1 row-start-3 -mr-1 justify-end" />
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

const AssistantMessage: React.FC = () => {
  return (
    <MessagePrimitive.Root className="grid grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] relative w-full max-w-[var(--thread-max-width)] py-4">
      <div className="text-foreground max-w-[calc(var(--thread-max-width)*0.8)] break-words leading-7 col-span-2 col-start-2 row-start-1 my-1.5">
        <MessagePrimitive.Content components={{ Text: MarkdownText }} />
      </div>
      <AssistantActionBar />
      <BranchPicker className="col-start-2 row-start-2 -ml-2 mr-2" />
    </MessagePrimitive.Root>
  );
};

const AssistantActionBar: FC = () => {
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
