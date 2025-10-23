import { saveMessagesToLocalStorage } from "../components/chatbot/assistant-ui/thread";
import { getTokens, refreshToken } from "../utilities/auth";

type AgentIntent = "tax_education" | "tax_refund_calculation" | "tax_paycheck_calculation" | "life_events_update" | null;

export const MyModelAdapter = (
  userId: string,
  setTyping: (typing: boolean) => void,
  sessionId?: string,
  setGlobalError?:(message:string|null)=>void,
  agentIntent?: AgentIntent
): any => ({
  async *run({ messages }: any) {
    setTyping(true);

    // Start immediately - no loading placeholder!

    try {
      let {accessToken}= getTokens();
        if (!accessToken) {
        const newToken = await refreshToken();
        if (!newToken) {
          setTyping(false);
          setGlobalError?.("Your session has timed out for security. Please sign in again.");
          throw new Error("No valid access token found");
        }
        accessToken = newToken;
      }

      const lastUserText = messages[messages.length - 1].content[0]?.text || "";
      const AUTH_API_URL = process.env.NEXT_PUBLIC_BACKEND_API;

        const makeRequest = async (token: string) =>
        fetch(`${AUTH_API_URL}chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
          keepalive: true,
          body: JSON.stringify({
            user_id: userId,
            message: lastUserText,
            session_id: sessionId,
            user_intent: agentIntent,
          }),
        });

      // First attempt
      let response = await makeRequest(accessToken);

      // Handle expired access token (401)
      if (response.status === 401) {
        const newToken = await refreshToken();

        if (!newToken) {
          setGlobalError?.("Your session has timed out for security. Please sign in again.");
          throw new Error("Token refresh failed");
        }

        // Retry with the new token
        accessToken = newToken;
        response = await makeRequest(accessToken);
      }
      if (!response.ok || !response.body) throw new Error("Bad response");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let accumulated = "";
      let urls: string[] = [];
      const accumulatedMessages = [...messages];
      let lastYield = 0;
      const MIN_YIELD_INTERVAL = 16; // ~60fps

      while (true) {
        // console.log(reader)
        const { done, value } = await reader.read();
        if (done) break;

        const chunkStr = decoder.decode(value, { stream: true });
        const lines = chunkStr.split("\n");
        let hasNewContent = false;

        for (const line of lines) {
          if (!line.trim()) continue;

          // Only process lines starting with "data:"
          if (line.startsWith("data: ")) {
            const jsonStr = line.slice("data: ".length).trim();

            if (!jsonStr || jsonStr === "[DONE]") continue;

            try {
              const json = JSON.parse(jsonStr);

              if (json.response || json.message) {
                // You might be using `response` or `llm_message` depending on your API
                accumulated += json.response || json.message;
                hasNewContent = true;
              }

              if (json.urls && Array.isArray(json.urls)) {
                urls = json.urls;
              }
            } catch (err) {
              console.error("JSON parse error:", jsonStr, err);
            }
          } else {
            console.warn("Skipping non-data line:", line);
          }
        }


        // Yield immediately for first chunk, then throttle
        const now = Date.now();
        if (hasNewContent && (accumulated.length < 50 || now - lastYield >= MIN_YIELD_INTERVAL)) {
          yield {
            content: [{ type: "text", text: accumulated }],
            metadata: {
              custom: {
                loading: false,
                streaming: true,
                urls: urls.length > 0 ? urls : undefined,
              },
            },
          };
          lastYield = now;
        }
      }

      // Final yield
      setTyping(false);
      yield {
        content: [{ type: "text", text: accumulated }],
        metadata: {
          custom: {
            loading: false,
            streaming: false,
            urls: urls.length > 0 ? urls : undefined,
          },
        },
      };

      // Save to localStorage
      saveMessagesToLocalStorage([
        ...accumulatedMessages,
        { role: "assistant", content: [{ type: "text", text: accumulated }] },
      ]);

    } catch (error) {
      console.error("Adapter error:", error);
      setTyping(false);
      setGlobalError?.("Your session has timed out for security. Please sign in again.")

      // yield {
      //   content: [
      //     { type: "text", text: "Sorry, something went wrong. Please try again." },
      //   ],
      //   metadata: { custom: { loading: false, streaming: false } },
      // };
    }
  },
});
