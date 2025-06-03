import { Button } from "@/components/ui/button";
import type { ChatSession } from "@/api/schemas";
import { Trash2 } from "lucide-react";

export const ChatSessionDialog = ({
  sessions,
  isCreating,
  handleCreateSession,
  handleSessionClick,
  handleDeleteSession,
}: {
  sessions: ChatSession[];
  isCreating: boolean;
  handleCreateSession: () => void;
  handleSessionClick: (sessionId: string) => void;
  handleDeleteSession: (sessionId: string) => void;
}) => {
  return (
    <>
      <h2 className="text-lg font-semibold">Chat Sessions</h2>
      <div className="flex justify-end mb-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleCreateSession}
          disabled={isCreating}
        >
          + New
        </Button>
      </div>
      <div className="space-y-2">
        {sessions.map((s) => (
          <div
            key={s.session_id}
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded flex justify-between items-center cursor-pointer"
            onClick={() => handleSessionClick(s.session_id)}
          >
            <div>
              <div className="font-medium">
                Session {s.session_id.slice(-2).toUpperCase()}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(s.created_at).toLocaleString()}
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteSession(s.session_id);
              }}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};
