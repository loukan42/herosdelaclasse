import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export function useTranslatedString(text: string | null | undefined) {
  const { language, translateText } = useLanguage();
  const [translated, setTranslated] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!text || language === "fr") {
      setTranslated(null);
      setIsTranslating(false);
      return;
    }

    setIsTranslating(true);
    translateText(text)
      .then((res) => {
        if (!cancelled) setTranslated(res);
      })
      .catch(() => {
        if (!cancelled) setTranslated(null);
      })
      .finally(() => {
        if (!cancelled) setIsTranslating(false);
      });

    return () => {
      cancelled = true;
    };
  }, [text, language, translateText]);

  return {
    text: (translated ?? text ?? "") as string,
    isTranslating: Boolean(text) && language !== "fr" && isTranslating,
  };
}
