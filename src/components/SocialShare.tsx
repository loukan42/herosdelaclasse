import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const SHARE_URL = "https://herosdelaclasse.com";
const SHARE_MESSAGE = "On a découvert ce site d'histoires interactives pour enfants. Après chaque page, l'enfant fait un choix qui change la suite de l'aventure. Un vrai moment de lecture ludique et participatif, idéal pour stimuler l'imagination des enfants de 4 à 10 ans. À partager sans hésiter.";

interface SocialShareProps {
  compact?: boolean;
}

export function SocialShare({ compact = false }: SocialShareProps) {
  const { t } = useLanguage();
  const encodedMessage = encodeURIComponent(`${SHARE_MESSAGE}\n\n${SHARE_URL}`);

  // Instagram DM - opens Instagram direct messages
  const handleInstagramDM = () => {
    window.open(`https://www.instagram.com/direct/new/`, "_blank");
  };

  // WhatsApp - uses the WhatsApp share URL
  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground mr-1">{t('card.share')}</span>
        <button
          onClick={handleInstagramDM}
          className="p-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white hover:opacity-90 transition-opacity"
          title="Partager en DM Instagram"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </button>
        <button
          onClick={handleWhatsApp}
          className="p-2 rounded-full bg-[#25D366] text-white hover:opacity-90 transition-opacity"
          title="Partager sur WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-center text-muted-foreground font-medium">{t('card.shareThis')}</p>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={handleInstagramDM}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-medium hover:opacity-90 transition-opacity shadow-md"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          DM Instagram
        </button>
        <button
          onClick={handleWhatsApp}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] text-white font-medium hover:opacity-90 transition-opacity shadow-md"
        >
          <MessageCircle className="w-5 h-5" />
          WhatsApp
        </button>
      </div>
    </div>
  );
}
