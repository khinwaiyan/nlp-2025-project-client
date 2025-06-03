import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatService } from "@/api/apis";
import { useChatModal } from "@/context/ChatModalContext";
import { useState } from "react";
import { ChatDialog } from "./ChatDialog";
import { ChatSessionDialog } from "./ChatSessionDialog";

export const FloatingChatButton = () => {
  const { isOpen, setIsOpen } = useChatModal();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );

  const { data: sessions, isLoading } = useGetSessions();
  const handleSessionClick = (sessionId: string) => {
    setSelectedSessionId(sessionId);
  };
  const { createSession, isPending: isCreating } = useCreateSession({
    onSuccess: ({ session_id }) => {
      setSelectedSessionId(session_id);
      setIsOpen(true);
    },
  });
  const handleCreateSession = () => {
    if (isCreating) return;
    createSession();
  };
  const { deleteSession } = useDeleteSession();
  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId);
    if (selectedSessionId === sessionId) {
      setSelectedSessionId(null);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="fixed bottom-6 right-6 p-4 rounded-full shadow-lg">
            💬
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[320px] max-h-[70vh] overflow-y-auto">
          <div className="text-center">Loading...</div>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 p-4 rounded-full shadow-lg">
          💬
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[600px] max-h-[70vh] overflow-y-auto">
        {selectedSessionId ? (
          <ChatDialog
            sessionId={selectedSessionId}
            onBack={() => setSelectedSessionId(null)}
          />
        ) : (
          <ChatSessionDialog
            sessions={sessions}
            isCreating={isCreating}
            handleCreateSession={handleCreateSession}
            handleSessionClick={handleSessionClick}
            handleDeleteSession={handleDeleteSession}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
const useGetSessions = () => {
  const { data: chatSessions } = useQuery({
    queryKey: ["getChatSessionsList"],
    queryFn: chatService.getChatSessionsList,
  });
  return { data: chatSessions || [], isLoading: !chatSessions };
};

const useCreateSession = ({
  onSuccess,
}: {
  onSuccess({ session_id }: { session_id: string }): void;
}) => {
  const queryClient = useQueryClient();
  const { mutate: createSession, isPending } = useMutation({
    mutationFn: chatService.createChatSession,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: ["getChatSessionsList"],
        exact: true,
      });
      onSuccess(response);
    },
    onError: (error) => {
      console.error("Error creating chat session:", error);
    },
  });
  return { createSession, isPending };
};

const useDeleteSession = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteSession } = useMutation({
    mutationFn: (sessionId: string) => chatService.deleteChatSession(sessionId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["getChatSessionsList"],
        exact: true,
      });
    },
    onError: (error) => {
      console.error("Error deleting chat session:", error);
    },
  });

  return { deleteSession };
};
