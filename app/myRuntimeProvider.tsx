import { saveMessagesToLocalStorage } from "../components/chatbot/assistant-ui/thread";
import { getTokens, refreshToken } from "../utilities/auth";

type AgentIntent = "tax_education" | "tax_refund_calculation" | "tax_paycheck_calculation" | "life_events_update" | null;

// interface PayrollData {
//   payroll?: any;
// }

export const MyModelAdapter = (
  userId: string,
  setTyping: (typing: boolean) => void,
  sessionId?: string,
  setGlobalError?: (message: string | null) => void,
  agentIntent?: AgentIntent,
): any => ({
  async *run({ messages }: any) {
    setTyping(true);

    try {
      let { accessToken } = getTokens();
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
      const isTaxCalculation=messages[messages.length-1]?.metadata?.custom?.isTaxCalculation||false
      const payrollData=messages[messages.length-1]?.metadata?.custom?.payrollData||{}
      const AUTH_API_URL = process.env.NEXT_PUBLIC_BACKEND_API;

      // Check if message contains scenario calculation keyword
      // const isTaxCalculation = lastUserText.toLowerCase().includes("calculate taxes with:");

      // Determine which API to call
      console.log(isTaxCalculation,"][][[[[[[[[[[[[[[[[[[")
      console.log(isTaxCalculation ? "tax-calculate" : "chat","][][[[[[[[[[[[[[[[[[[")
      const apiEndpoint = isTaxCalculation ? "tax-calculate" : "chat";

      console.log(`🔄 MyModelAdapter calling: /${apiEndpoint} for message: "${lastUserText.substring(0, 50)}..."`);

      const makeRequest = async (token: string) => {
        let payload: any;

        if (isTaxCalculation && payrollData?.payroll) {
          // Build payload for tax-calculate API
          const modifiedPayroll = payrollData.payroll;

          payload = {
            message: "calculate my paycheck with updated values",
            session_id: sessionId,
            user_id: userId,
            user_intent: agentIntent,
          };

          // Add paycheck data
          if (modifiedPayroll) {
            payload.paycheck = {
              income_type: modifiedPayroll.income_type || "salary",
              salary: modifiedPayroll.salary || modifiedPayroll.annual_salary || 0,
              hourly_rate: modifiedPayroll.hourly_rate || 0,
              hours_per_week: modifiedPayroll.hours_per_week || 0,
              pay_frequency: modifiedPayroll.pay_frequency || "weekly",
              filing_status: modifiedPayroll.filing_status || "single",
              home_address: modifiedPayroll.home_address || "10001",
              work_address: modifiedPayroll.work_address || "10001",
              spouse_income: modifiedPayroll.spouse_income || 0,
              pre_tax_deductions: modifiedPayroll.pre_tax_deductions || 0,
              post_tax_deductions: modifiedPayroll.post_tax_deductions || 0,
              dependents: modifiedPayroll.dependents || 0,
              age: modifiedPayroll.age || 22,
            };
          }

          // Add refund data if needed
          if (agentIntent === "tax_refund_calculation" && modifiedPayroll) {
            payload.refund = {
              app_enum: "amus",
              first_name: modifiedPayroll.first_name || "",
              middle_name: modifiedPayroll.middle_name || "",
              last_name: modifiedPayroll.last_name || "",
              income_type: modifiedPayroll.income_type || "salary",
              annual_salary: modifiedPayroll.annual_salary || modifiedPayroll.salary || 0,
              hourly_rate: modifiedPayroll.hourly_rate || 0,
              average_hours_per_week: modifiedPayroll.hours_per_week || 0,
              seasonal_variation: "none",
              estimated_annual_income: modifiedPayroll.estimated_annual_income || modifiedPayroll.annual_salary || 0,
              filing_status: modifiedPayroll.filing_status || "single",
              pay_frequency: modifiedPayroll.pay_frequency || "weekly",
              current_withholding_per_paycheck: modifiedPayroll.current_withholding_per_paycheck || 0,
              desired_boost_per_paycheck: 0,
              additional_income: modifiedPayroll.additional_income || 0,
              deductions: modifiedPayroll.deductions || modifiedPayroll.pre_tax_deductions || 0,
              dependents: modifiedPayroll.dependents || 0,
              spouse_income: modifiedPayroll.spouse_income || 0,
              current_date: new Date().toISOString(),
              paychecks_already_received: modifiedPayroll.paychecks_already_received || 0,
            };
          }
        } else {
          // Build payload for regular chat API
          payload = {
            user_id: userId,
            message: lastUserText,
            session_id: sessionId,
            user_intent: agentIntent,
          };
        }

        return fetch(`${AUTH_API_URL}${apiEndpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
          keepalive: true,
          body: JSON.stringify(payload),
        });
      };

      // First attempt
      let response = await makeRequest(accessToken);

      // Handle expired access token (401)
      if (response.status === 401) {
        const newToken = await refreshToken();
        if (!newToken) {
          setGlobalError?.("Your session has timed out for security. Please sign in again.");
          throw new Error("Token refresh failed");
        }
        accessToken = newToken;
        response = await makeRequest(accessToken);
      }

      if (!response.ok || !response.body) throw new Error("Bad response");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let accumulated = "";
      let urls: string[] = [];
      let suggestions: string[] = [];
      let refundCalculated = false;
      let paycheckCalculated = false;
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
          const trimmedLine = line.trim();
          if (!trimmedLine) continue;

          if (trimmedLine.startsWith("data:")) {
            const jsonStr = trimmedLine.slice("data:".length).trim();
            if (!jsonStr || jsonStr === "[DONE]") continue;

            try {
              const json = JSON.parse(jsonStr);

              if (["True", "true", true].includes(json.refund_calculated)) {
                refundCalculated = true;
              }

              if (["True", "true", true].includes(json.paycheck_calculated)) {
                paycheckCalculated = true;
              }

              if (json.response || json.message) {
                accumulated += json.response || json.message;
                hasNewContent = true;
              }

              if (json.urls && Array.isArray(json.urls)) urls = json.urls;
              if (json.followups && Array.isArray(json.followups)) suggestions = json.followups.slice(0, 2);

            } catch (err) {
              console.error("JSON parse error:", jsonStr, err);
            }

          } else {
            console.warn("Skipping non-data line:", line);
          }
        }

        const isRefund =
          apiEndpoint === "tax-calculate" && agentIntent === "tax_refund_calculation";
        const isPaycheck =
          apiEndpoint === "tax-calculate" && agentIntent === "tax_paycheck_calculation";
          console.log(isRefund,"=====",isPaycheck ? true : !!paycheckCalculated,"]]]]",isPaycheck,isRefund ? true : !!refundCalculated,)
           const now = Date.now();
        if (hasNewContent && (accumulated.length < 50 || now - lastYield >= MIN_YIELD_INTERVAL)) {
          yield {
            content: [{ type: "text", text: accumulated }],
            metadata: {
              custom: {
                loading: false,
                streaming: true,
                urls: urls.length > 0 ? urls : undefined,
                suggestions: suggestions,
                refundCalculated: isRefund ? true : !!refundCalculated,
                paycheckCalculated: isPaycheck ? true : !!paycheckCalculated,
              },
            },
          };
          lastYield = now;
        }
      }

      // Final yield
      setTyping(false);
      const isRefund = apiEndpoint === "tax-calculate" && agentIntent === "tax_refund_calculation";
      const isPaycheck = apiEndpoint === "tax-calculate" && agentIntent === "tax_paycheck_calculation";
          console.log(isRefund,"=====",isPaycheck ? true : !!paycheckCalculated,"]]]]",isPaycheck,isRefund ? true : !!refundCalculated,)
      
      yield {
        content: [{ type: "text", text: accumulated }],
        metadata: {
          custom: {
            loading: false,
            streaming: false,
            urls: urls.length > 0 ? urls : undefined,
            suggestions: suggestions,
            refundCalculated: isRefund ? true : !!refundCalculated,
            paycheckCalculated: isPaycheck ? true : !!paycheckCalculated,
          },
        },
      };

      // Save messages
      saveMessagesToLocalStorage([
        ...accumulatedMessages,
        { role: "assistant", content: [{ type: "text", text: accumulated }] },
      ]);

    } catch (error) {
      console.error("Adapter error:", error);
      setTyping(false);
      setGlobalError?.("Your session has timed out for security. Please sign in again.");
    }
  },
});
