                                                                                                                          
import { getSessionId } from "@/services/chatbot";

export function getCachedEmail() {
  let email = localStorage.getItem("chat_email");
  return email;
}

export function getCachedSessionId() {
  let sessionId = localStorage.getItem("chat_session_id");
  if (!sessionId) {
    sessionId = getSessionId();
    localStorage.setItem("chat_session_id", sessionId);
  }
  return sessionId;
}
