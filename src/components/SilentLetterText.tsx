import React from "react";

// Common French silent letter patterns
const silentLetterPatterns = [
  // Final silent 'e' (but not after vowels where it changes pronunciation)
  { pattern: /(\w)e(?=\s|$|[.,!?;:])/gi, replace: "$1<mute>e</mute>" },
  
  // Final 's' (plural, verb conjugation)
  { pattern: /(\w)s(?=\s|$|[.,!?;:])/gi, replace: "$1<mute>s</mute>" },
  
  // Final 't' 
  { pattern: /(\w)t(?=\s|$|[.,!?;:])/gi, replace: "$1<mute>t</mute>" },
  
  // Final 'd'
  { pattern: /(\w)d(?=\s|$|[.,!?;:])/gi, replace: "$1<mute>d</mute>" },
  
  // Final 'x'
  { pattern: /(\w)x(?=\s|$|[.,!?;:])/gi, replace: "$1<mute>x</mute>" },
  
  // Final 'p'
  { pattern: /(\w)p(?=\s|$|[.,!?;:])/gi, replace: "$1<mute>p</mute>" },
  
  // 'h' at beginning of words (h muet)
  { pattern: /(?<=\s|^)h/gi, replace: "<mute>h</mute>" },
  
  // Silent 'e' in '-ent' verb endings (3rd person plural)
  { pattern: /ent(?=\s|$|[.,!?;:])/gi, replace: "e<mute>nt</mute>" },
];

// Words with specific silent letters that need special handling
const silentLetterWords: Record<string, string> = {
  // Common words with silent letters marked
  "est": "e<mute>st</mute>",
  "et": "et", // not silent
  "les": "le<mute>s</mute>",
  "des": "de<mute>s</mute>",
  "mes": "me<mute>s</mute>",
  "tes": "te<mute>s</mute>",
  "ses": "se<mute>s</mute>",
  "ces": "ce<mute>s</mute>",
  "aux": "au<mute>x</mute>",
  "dans": "dan<mute>s</mute>",
  "sans": "san<mute>s</mute>",
  "sous": "sou<mute>s</mute>",
  "plus": "plu<mute>s</mute>",
  "temps": "tem<mute>ps</mute>",
  "corps": "cor<mute>ps</mute>",
  "alors": "alor<mute>s</mute>",
  "après": "aprè<mute>s</mute>",
  "très": "trè<mute>s</mute>",
  "mais": "mai<mute>s</mute>",
  "jamais": "jamai<mute>s</mute>",
  "toujours": "toujour<mute>s</mute>",
  "grands": "gran<mute>ds</mute>",
  "grand": "gran<mute>d</mute>",
  "petit": "peti<mute>t</mute>",
  "petits": "peti<mute>ts</mute>",
  "petite": "petit<mute>e</mute>",
  "petites": "petit<mute>es</mute>",
  "trop": "tro<mute>p</mute>",
  "beaucoup": "beaucou<mute>p</mute>",
  "tout": "tou<mute>t</mute>",
  "tous": "tou<mute>s</mute>",
  "peut": "peu<mute>t</mute>",
  "sont": "son<mute>t</mute>",
  "ont": "on<mute>t</mute>",
  "font": "fon<mute>t</mute>",
  "vont": "von<mute>t</mute>",
  "fait": "fai<mute>t</mute>",
  "nuit": "nui<mute>t</mute>",
  "bruit": "brui<mute>t</mute>",
  "fruit": "frui<mute>t</mute>",
  "huit": "hui<mute>t</mute>",
  "doigt": "doig<mute>t</mute>",
  "vingt": "ving<mute>t</mute>",
  "blanc": "blan<mute>c</mute>",
  "francs": "fran<mute>cs</mute>",
  "long": "lon<mute>g</mute>",
  "longs": "lon<mute>gs</mute>",
  "longue": "longu<mute>e</mute>",
  "longues": "longu<mute>es</mute>",
  "regard": "regar<mute>d</mute>",
  "regards": "regar<mute>ds</mute>",
  "quand": "quan<mute>d</mute>",
  "pendant": "pendan<mute>t</mute>",
  "devant": "devan<mute>t</mute>",
  "avant": "avan<mute>t</mute>",
  "maintenant": "maintenan<mute>t</mute>",
  "comment": "commen<mute>t</mute>",
  "vraiment": "vraimen<mute>t</mute>",
  "seulement": "seulemen<mute>t</mute>",
  "moment": "momen<mute>t</mute>",
  "gentiment": "gentimen<mute>t</mute>",
  "lentement": "lentemen<mute>t</mute>",
  "doucement": "doucemen<mute>t</mute>",
  "tranquillement": "tranquillemen<mute>t</mute>",
  "calmement": "calmemen<mute>t</mute>",
  "heureux": "heureu<mute>x</mute>",
  "yeux": "yeu<mute>x</mute>",
  "deux": "deu<mute>x</mute>",
  "mieux": "mieu<mute>x</mute>",
  "vieux": "vieu<mute>x</mute>",
  "jeux": "jeu<mute>x</mute>",
  "feux": "feu<mute>x</mute>",
  "cheveux": "cheveu<mute>x</mute>",
  "animaux": "animau<mute>x</mute>",
  "oiseaux": "oiseau<mute>x</mute>",
  "histoire": "histoir<mute>e</mute>",
  "histoires": "histoir<mute>es</mute>",
  "aventure": "aventur<mute>e</mute>",
  "aventures": "aventur<mute>es</mute>",
  "mystère": "mystèr<mute>e</mute>",
  "mystères": "mystèr<mute>es</mute>",
  "forêt": "forê<mute>t</mute>",
  "forêts": "forê<mute>ts</mute>",
  "arbre": "arbr<mute>e</mute>",
  "arbres": "arbr<mute>es</mute>",
  "feuille": "feuill<mute>e</mute>",
  "feuilles": "feuill<mute>es</mute>",
  "chemin": "chemin",
  "chemins": "chemin<mute>s</mute>",
  "lumière": "lumièr<mute>e</mute>",
  "pierre": "pierr<mute>e</mute>",
  "pierres": "pierr<mute>es</mute>",
  "terre": "terr<mute>e</mute>",
  "herbe": "herb<mute>e</mute>",
  "herbes": "herb<mute>es</mute>",
  "monde": "mond<mute>e</mute>",
  "chose": "chos<mute>e</mute>",
  "choses": "chos<mute>es</mute>",
  "être": "êtr<mute>e</mute>",
  "faire": "fair<mute>e</mute>",
  "dire": "dir<mute>e</mute>",
  "voir": "voir",
  "pouvoir": "pouvoir",
  "vouloir": "vouloir",
  "savoir": "savoir",
  "prendre": "prendr<mute>e</mute>",
  "comprendre": "comprendr<mute>e</mute>",
  "entendre": "entendr<mute>e</mute>",
  "attendre": "attendr<mute>e</mute>",
  "descendre": "descendr<mute>e</mute>",
  "rendre": "rendr<mute>e</mute>",
  "conte": "cont<mute>e</mute>",
  "contes": "cont<mute>es</mute>",
  "plante": "plant<mute>e</mute>",
  "plantes": "plant<mute>es</mute>",
  "goutte": "goutt<mute>e</mute>",
  "gouttes": "goutt<mute>es</mute>",
  "route": "rout<mute>e</mute>",
  "routes": "rout<mute>es</mute>",
  "grotte": "grott<mute>e</mute>",
  "grottes": "grott<mute>es</mute>",
  "porte": "port<mute>e</mute>",
  "portes": "port<mute>es</mute>",
  "carte": "cart<mute>e</mute>",
  "cartes": "cart<mute>es</mute>",
  "tête": "têt<mute>e</mute>",
  "fête": "fêt<mute>e</mute>",
  "bête": "bêt<mute>e</mute>",
  "bêtes": "bêt<mute>es</mute>",
  "tempête": "tempêt<mute>e</mute>",
  "cœur": "cœur",
  "sœur": "sœur",
  "fleur": "fleur",
  "fleurs": "fleur<mute>s</mute>",
  "couleur": "couleur",
  "couleurs": "couleur<mute>s</mute>",
  "heure": "heur<mute>e</mute>",
  "heures": "heur<mute>es</mute>",
  "peur": "peur",
  "bonheur": "bonheur",
  "malheur": "malheur",
  "explorateur": "explorateur",
  "explorateurs": "explorateur<mute>s</mute>",
  "trésor": "trésor",
  "trésors": "trésor<mute>s</mute>",
  "secret": "secre<mute>t</mute>",
  "secrets": "secre<mute>ts</mute>",
  "empreinte": "empreint<mute>e</mute>",
  "empreintes": "empreint<mute>es</mute>",
  "trace": "trac<mute>e</mute>",
  "traces": "trac<mute>es</mute>",
  "plaine": "plain<mute>e</mute>",
  "dinosaure": "dinosaur<mute>e</mute>",
  "dinosaures": "dinosaur<mute>es</mute>",
  "fougère": "fougèr<mute>e</mute>",
  "fougères": "fougèr<mute>es</mute>",
  "rocher": "rocher",
  "rochers": "rocher<mute>s</mute>",
  "bâton": "bâton",
  "bâtons": "bâton<mute>s</mute>",
  "soleil": "soleil",
  "sol": "sol",
  "humide": "humid<mute>e</mute>",
  "géante": "géant<mute>e</mute>",
  "géantes": "géant<mute>es</mute>",
  "immense": "immens<mute>e</mute>",
  "immenses": "immens<mute>es</mute>",
  "calme": "calm<mute>e</mute>",
  "famille": "famill<mute>e</mute>",
  "jardin": "jardin",
  "jardins": "jardin<mute>s</mute>",
  "feu": "feu",
  "royaume": "royaum<mute>e</mute>",
  "nuage": "nuag<mute>e</mute>",
  "nuages": "nuag<mute>es</mute>",
  "pirate": "pirat<mute>e</mute>",
  "pirates": "pirat<mute>es</mute>",
};

function processWordWithSilentLetters(word: string): string {
  // Check if word is in our dictionary (case-insensitive)
  const lowerWord = word.toLowerCase();
  if (silentLetterWords[lowerWord]) {
    // Preserve original case for first letter
    const processed = silentLetterWords[lowerWord];
    if (word[0] === word[0].toUpperCase()) {
      return processed.charAt(0).toUpperCase() + processed.slice(1);
    }
    return processed;
  }
  return word;
}

function processSilentLetters(text: string): string {
  // Split text into words while preserving spaces and punctuation
  const tokens = text.split(/(\s+|[.,!?;:'"-])/);
  
  return tokens.map(token => {
    // Skip whitespace and punctuation
    if (/^\s+$/.test(token) || /^[.,!?;:'"-]$/.test(token)) {
      return token;
    }
    return processWordWithSilentLetters(token);
  }).join('');
}

interface SilentLetterTextProps {
  text: string;
  className?: string;
}

export function SilentLetterText({ text, className = "" }: SilentLetterTextProps) {
  const processedText = processSilentLetters(text);
  
  // Parse the processed text and convert <mute> tags to styled spans
  const parts = processedText.split(/(<mute>.*?<\/mute>)/g);
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        const muteMatch = part.match(/<mute>(.*?)<\/mute>/);
        if (muteMatch) {
          return (
            <span 
              key={index} 
              className="text-muted-foreground/50 font-normal"
              aria-hidden="true"
            >
              {muteMatch[1]}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}
