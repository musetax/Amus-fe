// utils/chatSession.ts
let email: string | null = null;
let sessionId: string | null = null;

import { getRandomEmail, getSessionId } from "@/services/chatbot";

export function getCachedEmail() {
  let email = localStorage.getItem("chat_email");
 
  if (!email) {
    email = getRandomEmail();
    localStorage.setItem("chat_email", email);
  }
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
