import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const languageNames: Record<string, string> = {
  'fr': 'French',
  'en': 'English',
  'de': 'German',
  'ru': 'Russian',
  'es': 'Spanish',
  'zh': 'Chinese (Simplified)',
  'pt-br': 'Brazilian Portuguese',
};

// Maximum text length to prevent abuse (10,000 characters)
const MAX_TEXT_LENGTH = 10000;

// Allowed target languages
const allowedLanguages = Object.keys(languageNames);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, targetLanguage } = await req.json();
    
    // Validate required fields
    if (!text || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: "Missing text or targetLanguage" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate text type and length
    if (typeof text !== 'string' || text.length === 0) {
      return new Response(
        JSON.stringify({ error: "Text must be a non-empty string" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Text must not exceed ${MAX_TEXT_LENGTH} characters` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate target language against allowed list
    if (typeof targetLanguage !== 'string' || !allowedLanguages.includes(targetLanguage)) {
      return new Response(
        JSON.stringify({ error: `Invalid target language. Allowed: ${allowedLanguages.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If already in French and target is French, return as-is
    if (targetLanguage === 'fr') {
      return new Response(
        JSON.stringify({ translatedText: text }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const targetLangName = languageNames[targetLanguage] || 'English';

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a professional translator for children's educational stories. Translate the following text from French to ${targetLangName}. 

IMPORTANT RULES:
1. Keep the same tone, style, and emotion appropriate for children (ages 6-11)
2. Preserve any placeholders like {prenom}, {Prénom}, or similar variables exactly as they are
3. Keep the narrative engaging and magical
4. Maintain paragraph breaks (\\n) exactly as in the original
5. Only output the translated text, nothing else
6. If there are gender-specific variations, adapt them appropriately for the target language`,
          },
          { role: "user", content: text },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const translatedText = data.choices?.[0]?.message?.content || text;

    return new Response(
      JSON.stringify({ translatedText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Translation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
