import { useState } from "react";
import { ChevronDown, ChevronUp, Heart } from "lucide-react";

export function Footer() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <footer className="border-t border-border bg-muted/30">
      {/* Pourquoi ce site section */}
      <div className="container max-w-4xl mx-auto px-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-4 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <Heart className="w-4 h-4 text-primary" />
          <span className="font-medium">Pourquoi ce site ?</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 transition-transform" />
          ) : (
            <ChevronDown className="w-4 h-4 transition-transform" />
          )}
        </button>

        {isExpanded && (
          <div className="pb-6 text-muted-foreground text-sm leading-relaxed space-y-4 animate-fade-in">
            <p>
              Je suis fan de jeux de rôle, d'informatique et bientôt papa.
            </p>
            <p>
              Je suis parti d'un constat simple : le programme scolaire existe, mais la façon de l'apprendre ne convient pas à tous les enfants.
            </p>
            <p>
              J'ai donc créé un site éducatif sous forme de livre dont vous êtes le héros.
              L'enfant devient le personnage principal, fait des choix, avance dans une histoire… et apprend le programme scolaire sans s'en rendre compte.
            </p>
            <p>
              Ça commence au CP, avec une ambition claire : construire chaque niveau, classe après classe.
              Aujourd'hui, il y a déjà plusieurs histoires, encore un peu exploratoires, mais les retours sont très positifs.
            </p>
            <p>
              L'objectif maintenant : enrichir l'univers, ajouter de plus en plus d'aventures, et proposer une alternative plus engageante, plus ludique, et peut-être plus adaptée à la diversité des enfants.
            </p>
          </div>
        )}
      </div>

      {/* Copyright */}
      <div className="py-4 text-center border-t border-border/50">
        <p className="text-muted-foreground text-sm">
          © Lou Husson 2025
        </p>
      </div>
    </footer>
  );
}
