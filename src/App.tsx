import "@/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HomePage } from "./pages/HomePage";
import { ChatPage } from "./pages/ChatPage";
import { FloatingChatButton } from "./components/FloatingChatButton";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Layout } from "./components/Layout";
import { ChatModalProvider } from "./context/ChatModalContext";
const RouterProvider = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat/:sessionId" element={<ChatPage />} />
        </Routes>
        <FloatingChatButton />
      </Layout>
    </BrowserRouter>
  );
};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});
export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatModalProvider>
        <RouterProvider />
      </ChatModalProvider>
    </QueryClientProvider>
  );
};
