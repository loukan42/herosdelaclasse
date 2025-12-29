import React from 'react';
import { useLanguage, languages, Language } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Map language codes to country codes for flags
const flagCodes: Record<Language, string> = {
  'fr': 'fr',
  'en': 'gb',
  'de': 'de',
  'ru': 'ru',
  'es': 'es',
  'zh': 'cn',
  'pt-br': 'br',
};

function FlagIcon({ code, className = "" }: { code: Language; className?: string }) {
  const countryCode = flagCodes[code];
  return (
    <img 
      src={`https://flagcdn.com/w40/${countryCode}.png`}
      srcSet={`https://flagcdn.com/w80/${countryCode}.png 2x`}
      alt={code}
      className={`w-5 h-auto rounded-sm ${className}`}
    />
  );
}

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  
  const currentLanguage = languages.find(l => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors text-sm font-medium">
          <FlagIcon code={language} />
          <span className="hidden md:inline text-foreground">{currentLanguage?.name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-background border border-border shadow-lg z-50">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as Language)}
            className={`flex items-center gap-3 cursor-pointer ${
              language === lang.code ? 'bg-primary/10 text-primary' : ''
            }`}
          >
            <FlagIcon code={lang.code} />
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
