import { useState } from "react";
import { ChevronDown, ChevronUp, Heart, Instagram } from "lucide-react";
import { SocialShare } from "./SocialShare";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-muted/30">
      {/* Pourquoi ce site section */}
      <div className="container max-w-4xl mx-auto px-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-4 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <Heart className="w-4 h-4 text-primary" />
          <span className="font-medium">{t('footer.why')}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 transition-transform" />
          ) : (
            <ChevronDown className="w-4 h-4 transition-transform" />
          )}
        </button>

        {isExpanded && (
          <div className="pb-6 text-muted-foreground text-sm leading-relaxed space-y-4 animate-fade-in text-left">
            <p>{t('footer.whyText1')}</p>
            <p>{t('footer.whyText2')}</p>
            <p>{t('footer.whyText3')}</p>
            <p>{t('footer.whyText4')}</p>
            <p>{t('footer.whyText5')}</p>
          </div>
        )}
      </div>

      {/* Contact */}
      <div className="py-4 border-t border-border/50">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-sm font-semibold text-foreground mb-2">{t('footer.contact')}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t('footer.contactText')}{" "}
            <a
              href="https://www.instagram.com/herosdelaclasse/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Instagram
            </a>.
          </p>
        </div>
      </div>

      {/* Social Share */}
      <div className="py-4 border-t border-border/50">
        <div className="container max-w-4xl mx-auto px-4">
          <SocialShare />
        </div>
      </div>

      {/* Copyright & Social */}
      <div className="py-4 border-t border-border/50">
        <div className="container max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <p className="text-muted-foreground text-sm">
            © Lou Husson 2025
          </p>
          <a
            href="https://www.instagram.com/herosdelaclasse/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Instagram className="w-4 h-4" />
            @herosdelaclasse
          </a>
        </div>
      </div>
    </footer>
  );
}
