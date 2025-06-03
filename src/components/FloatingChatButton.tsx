import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatService } from "@/api/apis";
import type { ChatSession } from "@/api/schemas";
import { useChatModal } from "@/context/ChatModalContext";

export const FloatingChatButton = () => {
  const { isOpen, setIsOpen } = useChatModal();
  const navigate = useNavigate();

  const { data: sessions, isLoading } = useGetSessions();
  const handleSessionClick = (sessionId: string) => {
    navigate(`/chat/${sessionId}`);
  };
  const { createSession, isPending: isCreating } = useCreateSession({
    onSuccess: ({ session_id }) => {
      navigate(`/chat/${session_id}`);
    },
  });
  const handleCreateSession = () => {
    if (isCreating) return;
    createSession();
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

      <DialogContent className="w-[320px] max-h-[70vh] overflow-y-auto">
        <h2 className="text-lg font-semibold">Chat Sessions</h2>

        <div className="flex justify-end ">
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
          {sessions.map((s: ChatSession) => (
            <div
              key={s.session_id}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer"
              onClick={() => handleSessionClick(s.session_id)}
            >
              <div className="font-medium">
                Session {s.session_id.slice(-2).toUpperCase()}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(s.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
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
