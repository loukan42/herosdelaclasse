import { Link } from "react-router-dom";
import { Users, BookOpen, CheckCircle, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function AccountPromotion() {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: Users,
      title: "Profils personnalisés",
      description: "Créez un profil pour chaque enfant avec son avatar et son prénom pour des histoires plus immersives."
    },
    {
      icon: BookOpen,
      title: "Reprendre là où vous étiez",
      description: "Retrouvez facilement les lectures en cours et reprenez exactement là où vous vous êtes arrêtés."
    },
    {
      icon: CheckCircle,
      title: "Suivi des lectures",
      description: "Visualisez les histoires déjà lues et celles qui restent à découvrir pour chaque enfant."
    }
  ];

  return (
    <div className="mt-8 pt-6 border-t border-border/50">
      <div className="bg-gradient-to-br from-primary/10 via-secondary/20 to-primary/5 rounded-3xl p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            100% Gratuit
          </div>
          <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            Envie de continuer l'aventure ?
          </h3>
          <p className="text-muted-foreground text-lg">
            Créez un compte gratuit et profitez de toutes ces fonctionnalités
          </p>
        </div>

        {/* Benefits */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-background/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-sm"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
                <benefit.icon className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-foreground mb-2">
                {benefit.title}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-display font-bold text-lg hover:-translate-y-1 transition-all shadow-lg hover:shadow-xl"
          >
            <Sparkles className="w-5 h-5" />
            Créer mon compte gratuit
          </Link>
        </div>
      </div>
    </div>
  );
}
