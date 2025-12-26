import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import SubjectsDashboard from "./pages/SubjectsDashboard";
import StoriesDashboard from "./pages/StoriesDashboard";
import StoryStart from "./pages/StoryStart";
import StoryReader from "./pages/StoryReader";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SubjectsDashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/stories" element={<Navigate to="/" replace />} />
            <Route path="/subjects/:subjectId" element={<StoriesDashboard />} />
            <Route path="/stories/:storyId/start" element={<StoryStart />} />
            <Route path="/stories/:storyId/page/:pageId" element={<StoryReader />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
