import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Send } from "lucide-react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { ChatMessage } from "@/api/schemas";
import { chatService } from "@/api/apis";

export const ChatDialog = ({
  sessionId,
  onBack,
}: {
  sessionId: string;
  onBack: () => void;
}) => {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const { data: initialMessages = [], isLoading } = useGetMessages(sessionId);

  useEffect(() => {
    if (initialMessages.length > 0) {
      const parsed = initialMessages.map((m) => ({
        id: m.id,
        session_id: m.session_id,
        role: m.role,
        content: m.content,
        created_at: m.created_at,
      }));
      setMessages(parsed);
    }
  }, [initialMessages]);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${sessionId}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ]);
      setLoading(false);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      setLoading(false);
    };

    return () => {
      ws.close();
    };
  }, [sessionId]);

  const handleSend = () => {
    if (!input.trim() || !wsRef.current) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    wsRef.current.send(input);
    setInput("");
    setLoading(true);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="mr-1" />
            <h2 className="text-lg font-semibold">Chat</h2>
          </button>
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-2 mt-2 max-h-[50vh] overflow-y-auto px-2">
        {isLoading ? (
          <div className="text-sm text-gray-500">Loading messages...</div>
        ) : (
          messages.map((msg, idx) => {
            const isAssistant = msg.role === "assistant";
            let content = msg.content;

            if (isAssistant) {
              try {
                const parsed = JSON.parse(content);
                content = parsed.answer;
              } catch (e) {
                console.warn("Failed to parse assistant message content:", e);
              }
            }

            return (
              <div
                key={idx}
                className={`p-2 rounded-md ${
                  isAssistant
                    ? "bg-gray-100 self-start"
                    : "bg-blue-100 self-end text-right"
                }`}
              >
                {content}
              </div>
            );
          })
        )}
        {loading && (
          <div className="text-sm text-gray-400 self-start animate-pulse">
            Typing...
          </div>
        )}
      </div>

      <div className="flex gap-2 p-2">
        <Input
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={loading}
        />
        <Button onClick={handleSend} disabled={!input.trim() || loading}>
          <Send size={16} />
        </Button>
      </div>
    </>
  );
};

const useGetMessages = (sessionId: string) => {
  return useQuery<ChatMessage[]>({
    queryKey: ["messages", sessionId],
    queryFn: () => chatService.getMessagesBySessionId(sessionId),
    enabled: !!sessionId,
  });
};
