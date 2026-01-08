import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChildProfileProvider } from "@/contexts/ChildProfileContext";
import { PublishedStoriesProvider } from "@/contexts/PublishedStoriesContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import GradesDashboard from "./pages/GradesDashboard";
import SubjectsDashboard from "./pages/SubjectsDashboard";
import StoriesDashboard from "./pages/StoriesDashboard";
import StoryStart from "./pages/StoryStart";
import StoryReader from "./pages/StoryReader";
import Auth from "./pages/Auth";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import AdminStories from "./pages/AdminStories";
import AdminStoryEditor from "./pages/AdminStoryEditor";
import MyStories from "./pages/MyStories";
import Collection from "./pages/Collection";
import AdminCollection from "./pages/AdminCollection";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <ChildProfileProvider>
          <PublishedStoriesProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<GradesDashboard />} />
                  <Route path="/grade/:gradeId" element={<SubjectsDashboard />} />
                  <Route path="/grade/:gradeId/subjects/:subjectId" element={<StoriesDashboard />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/stories" element={<AdminStories />} />
                  <Route path="/admin/stories/:storyId" element={<AdminStoryEditor />} />
                  <Route path="/admin/collection" element={<AdminCollection />} />
                  <Route path="/my-stories" element={<MyStories />} />
                  <Route path="/collection" element={<Collection />} />
                  <Route path="/stories" element={<Navigate to="/" replace />} />
                  <Route path="/subjects/:subjectId" element={<Navigate to="/" replace />} />
                  <Route path="/stories/:storyId/start" element={<StoryStart />} />
                  <Route path="/stories/:storyId/page/:pageId" element={<StoryReader />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </PublishedStoriesProvider>
        </ChildProfileProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
