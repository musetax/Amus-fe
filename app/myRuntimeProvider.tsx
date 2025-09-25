import { saveMessagesToLocalStorage } from "../components/chatbot/assistant-ui/thread";
import { getAccessToken, refreshAccessToken } from "../utilities/auth";

export const MyModelAdapter = (
  email: string,
  setTyping: (typing: boolean) => void,
  sessionId?: string,
  url_type?: any
): any => ({
  async *run({ messages }: any) {
    setTyping(true);
    
    // Start immediately - no loading placeholder!
    
    try {
      const token = getAccessToken();
      const lastUserText = messages[messages.length - 1].content[0]?.text || "";

      const makeRequest = async () =>
        fetch("https://amus-devapi.musetax.com/api/tax_education/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
          },
          keepalive: true,
          body: JSON.stringify({
            email,
            query: lastUserText,
            chat_type: url_type,
            session_id: sessionId,
          }),
        });

      let response = await makeRequest();

      if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (!newToken) throw new Error("Token refresh failed");
        response = await makeRequest();
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
        const { done, value } = await reader.read();
        if (done) break;

        const chunkStr = decoder.decode(value, { stream: true });
        const lines = chunkStr.split("\n");
        let hasNewContent = false;

        for (const line of lines) {
          if (!line.trim()) continue;
          
          try {
            const json = JSON.parse(line);

            if (json.response) {
              accumulated += json.response;
              hasNewContent = true;
            }

            if (json.urls && Array.isArray(json.urls)) {
              urls = json.urls;
            }
          } catch (err) {
            console.error("JSON parse error:", line, err);
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
      yield {
        content: [
          { type: "text", text: "Sorry, something went wrong. Please try again." },
        ],
        metadata: { custom: { loading: false, streaming: false } },
      };
    }
  },
});
