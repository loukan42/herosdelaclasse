import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SubjectsDashboard from "./pages/SubjectsDashboard";
import StoriesDashboard from "./pages/StoriesDashboard";
import StoryStart from "./pages/StoryStart";
import StoryReader from "./pages/StoryReader";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SubjectsDashboard />} />
          <Route path="/stories" element={<Navigate to="/" replace />} />
          <Route path="/subjects/:subjectId" element={<StoriesDashboard />} />
          <Route path="/stories/:storyId/start" element={<StoryStart />} />
          <Route path="/stories/:storyId/page/:pageId" element={<StoryReader />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
