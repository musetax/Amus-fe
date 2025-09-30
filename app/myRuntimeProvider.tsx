import { saveMessagesToLocalStorage } from "../components/chatbot/assistant-ui/thread";
import { getAccessToken, refreshAccessToken } from "../utilities/auth";

export const MyModelAdapter = (
  userId: string,
  setTyping: (typing: boolean) => void,
  sessionId?: string,
  setGlobalError?:(message:string|null)=>void
): any => ({
  async *run({ messages }: any) {
    setTyping(true);

    // Start immediately - no loading placeholder!

    try {
      const token: string | null = getAccessToken();

      const lastUserText = messages[messages.length - 1].content[0]?.text || "";

      const makeRequest = async () =>
        fetch(`https://amus-devapi.musetax.com/v1/api/amus/chat/${userId}/${sessionId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
          },
          keepalive: true,
          body: JSON.stringify({
            user_id: userId,
            message: lastUserText,
            session_id: sessionId,
          }),
        });

      let response = await makeRequest();

      if (response.status !== 200) {
        setGlobalError?.("Your session has timed out for security. Please sign in again.")
        // const newToken = await refreshAccessToken();
        // if (!newToken) throw new Error("Token refresh failed");
        // response = await makeRequest();
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

              if (json.response || json.llm_message) {
                // You might be using `response` or `llm_message` depending on your API
                accumulated += json.response || json.llm_message;
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
