import type { ChatMessage, ChatSession } from "./schemas";
const DOMAIN = import.meta.env.VITE_DOMAIN;
export const chatService = {
  async getChatSessionsList(): Promise<ChatSession[]> {
    const res = await fetch(`${DOMAIN}/chat/sessions`);
    if (!res.ok) {
      throw new Error("Failed to fetch chat sessions");
    }
    const data = await res.json();
    return data.sessions;
  },
  async createChatSession(): Promise<{ session_id: string }> {
    const res = await fetch(`${DOMAIN}/chat/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Failed to create chat session");
    }
    const data = await res.json();
    return { session_id: data.session_id };
  },
  async deleteChatSession(sessionId: string): Promise<void> {
    const res = await fetch(`${DOMAIN}/chat/session/${sessionId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("Failed to delete chat session");
    }
  },
  async getMessagesBySessionId(sessionId: string): Promise<ChatMessage[]> {
    const res = await fetch(`${DOMAIN}/chat/message/${sessionId}`);
    if (!res.ok) {
      throw new Error("Failed to fetch messages for session");
    }
    const data = await res.json();
    return data;
  },
};
