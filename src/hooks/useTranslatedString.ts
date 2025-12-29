import { useEffect, useState, useRef } from "react";
import { useLanguage, getFromTranslationCache } from "@/contexts/LanguageContext";

export function useTranslatedString(text: string | null | undefined) {
  const { language, translateText } = useLanguage();
  const [translated, setTranslated] = useState<string | null>(() => {
    // Try to get from cache synchronously on initial render
    if (!text || language === "fr") return null;
    const cacheKey = `${language}:${text}`;
    return getFromTranslationCache(cacheKey) ?? null;
  });
  const [isTranslating, setIsTranslating] = useState(() => {
    // Only show translating state if not in cache
    if (!text || language === "fr") return false;
    const cacheKey = `${language}:${text}`;
    return !getFromTranslationCache(cacheKey);
  });
  const lastTextRef = useRef(text);
  const lastLangRef = useRef(language);

  useEffect(() => {
    let cancelled = false;

    // Reset if text or language changed
    if (text !== lastTextRef.current || language !== lastLangRef.current) {
      lastTextRef.current = text;
      lastLangRef.current = language;
    }

    if (!text || language === "fr") {
      setTranslated(null);
      setIsTranslating(false);
      return;
    }

    // Check cache synchronously first
    const cacheKey = `${language}:${text}`;
    const cached = getFromTranslationCache(cacheKey);
    if (cached) {
      setTranslated(cached);
      setIsTranslating(false);
      return;
    }

    // Not in cache, start translation
    setIsTranslating(true);
    translateText(text)
      .then((res) => {
        if (!cancelled) {
          setTranslated(res);
        }
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

  // If translating and no cache, show empty string to avoid flash
  // Once translated, show the translated text
  // If French or no text, show original
  const displayText = (() => {
    if (!text) return "";
    if (language === "fr") return text;
    if (translated) return translated;
    // While translating, show empty or skeleton-like state
    if (isTranslating) return ""; // Return empty to avoid flash
    return text; // Fallback to French if translation failed
  })();

  return {
    text: displayText,
    isTranslating: Boolean(text) && language !== "fr" && isTranslating,
    // Provide original for fallback scenarios
    originalText: text ?? "",
  };
}
