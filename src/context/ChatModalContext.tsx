import { createContext, useContext, useState } from "react";

type ChatModalContextType = {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
};

const ChatModalContext = createContext<ChatModalContextType | undefined>(
  undefined
);

export const ChatModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ChatModalContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </ChatModalContext.Provider>
  );
};

export const useChatModal = () => {
  const ctx = useContext(ChatModalContext);
  if (!ctx)
    throw new Error("useChatModal must be used within ChatModalProvider");
  return ctx;
};
