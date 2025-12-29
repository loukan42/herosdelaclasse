import { Link, useParams, useNavigate } from "react-router-dom";
import { subjects } from "@/data/subjects";
import { getGrade } from "@/data/grades";
import { getSubjectsForGrade } from "@/data/gradeSubjects";
import { SubjectCard } from "@/components/SubjectCard";
import { Sparkles, Save, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.png";
import { Footer } from "@/components/Footer";
import { ProfileSwitcher } from "@/components/ProfileSwitcher";
import { useAdmin } from "@/hooks/useAdmin";
import { Crown } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useCombinedStories } from "@/hooks/useCombinedStories";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SubjectsDashboard() {
  const { gradeId } = useParams<{ gradeId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuthContext();
  const { isAdmin } = useAdmin();
  const { getAllStories } = useCombinedStories();
  const { t } = useLanguage();

  const grade = getGrade(gradeId || "");

  if (!grade) {
    navigate("/");
    return null;
  }

  // Get subjects allowed for this grade from curriculum definition
  const allowedSubjectIds = getSubjectsForGrade(gradeId || "");
  
  // Get stories for this grade to check which subjects have content (static + published)
  const allStories = getAllStories();
  const gradeStories = allStories.filter(story => story.level === gradeId);
  const subjectsWithStories = new Set(gradeStories.map(s => s.subjectId));

  // Filter subjects: only show those in the curriculum for this grade
  // Mark as available only if they have stories
  const filteredSubjects = subjects
    .filter(subject => allowedSubjectIds.includes(subject.id))
    .map(subject => ({
      ...subject,
      available: subjectsWithStories.has(subject.id)
    }));

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header with ProfileSwitcher and Admin button */}
      <div className="container max-w-6xl mx-auto px-4 pt-4 flex justify-end items-center gap-2">
        <LanguageSelector />
        {isAdmin && (
          <Button asChild variant="outline" size="sm" className="gap-2 text-golden border-golden/30 hover:bg-golden/10">
            <Link to="/admin">
              <Crown className="w-4 h-4" />
              <span className="hidden sm:inline">{t('menu.admin')}</span>
            </Link>
          </Button>
        )}
        <ProfileSwitcher />
      </div>

      {/* Hero Section */}
      <header className="relative overflow-hidden py-6 md:py-10 px-4">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 text-golden opacity-30 animate-float">
          <Sparkles className="w-full h-full" />
        </div>
        <div className="absolute bottom-10 right-10 w-16 h-16 text-secondary opacity-40 animate-float" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-full h-full" />
        </div>
        
        <div className="container max-w-6xl mx-auto">
          {/* Back button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4 fade-up"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('nav.backToGrades')}
          </Button>

          <div className="text-center">
            {/* Grade badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-gradient-to-r ${grade.color} text-white shadow-lg fade-up`}>
              <span className="font-display text-lg font-bold">{grade.name}</span>
              <span className="text-white/80">•</span>
              <span className="text-sm">{grade.fullName}</span>
            </div>

            {/* Logo */}
            <img 
              src={logo} 
              alt="Héros de la Classe" 
              className="w-28 md:w-36 lg:w-40 mx-auto mb-4 fade-up drop-shadow-2xl"
            />
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed fade-up stagger-1">
              {t('subjects.subtitle')}
            </p>

            {/* CTA for non-authenticated users */}
            {!loading && !isAuthenticated && (
              <div className="mt-6 fade-up stagger-2">
                <Button asChild size="lg" className="gap-2 font-display">
                  <Link to="/auth">
                    <Save className="w-5 h-5" />
                    {t('stories.saveProgress')}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Subjects Grid */}
      <section className="container max-w-6xl mx-auto px-4 pb-20 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject, index) => (
            <SubjectCard key={subject.id} subject={subject} index={index} gradeId={gradeId} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
