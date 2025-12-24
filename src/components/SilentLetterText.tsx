import React from "react";

/**
 * Moteur linguistique pour le français - Lettres muettes
 * 
 * Règles :
 * - Détecter les consonnes finales muettes : e, s, t, d, p, x, g, z (si non prononcées)
 * - Détecter le "e" muet lorsqu'il n'est pas prononcé
 * - Ne jamais griser une lettre prononcée (ex : avec, fils, bus, etc.)
 */

// Mots où la consonne finale EST prononcée (exceptions - ne pas griser)
const pronouncedFinalConsonants = new Set([
  // -c prononcé
  "avec", "bec", "sec", "lac", "sac", "chic", "pic", "truc", "duc", "arc", "parc", "donc", "bloc", "choc", "frac", "trac", "échec", "grec",
  // -f prononcé
  "chef", "bref", "neuf", "oeuf", "boeuf", "veuf", "if", "vif", "naïf", "actif", "sportif", "positif", "négatif", "massif", "passif", "objectif", "motif", "tarif", "récif",
  // -l prononcé
  "fil", "cil", "mil", "avril", "civil", "subtil", "profil", "péril", "sourcil", "persil", "fusil", "gentil", "outil", "il", "sol", "vol", "col", "bol", "mol", "fol", "alcool",
  // -r prononcé (la plupart des -r finaux sont prononcés)
  "car", "bar", "par", "pour", "jour", "tour", "four", "cour", "amour", "toujours", "bonjour", "sur", "dur", "mur", "pur", "fleur", "coeur", "soeur", "peur", "heure", "couleur", "odeur", "chaleur", "valeur", "honneur", "bonheur", "mer", "fer", "ver", "hiver", "enfer", "hier", "fier", "air", "pair", "clair", "noir", "soir", "voir", "pouvoir", "savoir", "devoir", "avoir", "miroir", "or", "cor", "décor", "trésor", "castor",
  // -s prononcé
  "fils", "bus", "plus", "tous", "mars", "ours", "os", "as", "atlas", "ananas", "cosmos", "rhinocéros", "albatros", "tennis", "bis", "oasis", "cactus", "virus", "bonus", "campus", "terminus", "sens", "express", "stress",
  // -t prononcé
  "net", "brut", "kit", "scout", "foot", "yaourt", "est", "ouest", "sept", "huit", "mat", "gadget", "set", "budget", "ticket", "cricket", "contact", "direct", "correct", "exact", "intact", "strict", "abrupt",
  // Mots courts grammaticaux où tout est prononcé
  "un", "une", "le", "la", "les", "de", "du", "des", "au", "aux", "ce", "ces", "je", "tu", "il", "on", "nous", "vous", "ils", "me", "te", "se", "ne", "que", "qui", "ou", "où", "et", "en", "y", "à", "a"
]);

// Mots avec terminaisons spéciales à ne PAS traiter
const noProcessWords = new Set([
  // Mots où le -er final se prononce
  "mer", "fer", "ver", "hiver", "enfer", "hier", "fier", "cher", "amer", "cancer", "super", "master", "poster", "gangster", "hamburger", "danger",
  // Mots en -il où le l est prononcé
  "fil", "cil", "mil", "avril", "civil", "subtil", "profil", "péril",
]);

// Terminaisons verbales où le -ent est muet (3e personne pluriel)
function isVerbEndingEnt(word: string): boolean {
  const lowerWord = word.toLowerCase();
  // Exclure les noms/adjectifs en -ent (parent, moment, content, etc.)
  const nonVerbEndings = ["parent", "moment", "content", "argent", "accident", "présent", "absent", "innocent", "vement", "tement", "ement"];
  for (const ending of nonVerbEndings) {
    if (lowerWord.endsWith(ending)) return false;
  }
  // Si ça finit par -ent et a plus de 4 lettres, probablement un verbe
  return lowerWord.endsWith("ent") && word.length > 4;
}

function processWord(word: string): string {
  if (word.length <= 2) return word;
  
  const lowerWord = word.toLowerCase();
  
  // Ne pas traiter les exceptions
  if (pronouncedFinalConsonants.has(lowerWord) || noProcessWords.has(lowerWord)) {
    return word;
  }
  
  let result = "";
  const lastChar = lowerWord[lowerWord.length - 1];
  const secondLastChar = lowerWord.length > 1 ? lowerWord[lowerWord.length - 2] : "";
  const thirdLastChar = lowerWord.length > 2 ? lowerWord[lowerWord.length - 3] : "";
  
  // Règle 1: -ent verbal (3e personne pluriel) - les 3 lettres sont muettes
  if (isVerbEndingEnt(word)) {
    return word.slice(0, -3) + `<span class="silent-letter">${word.slice(-3)}</span>`;
  }
  
  // Règle 2: -es final (pluriel féminin ou 2e pers. sing.) - muet
  if (lowerWord.endsWith("es") && word.length > 3) {
    return word.slice(0, -2) + `<span class="silent-letter">${word.slice(-2)}</span>`;
  }
  
  // Règle 3: -e final muet (sauf après voyelle comme dans "idée")
  if (lastChar === "e" && word.length > 2) {
    // Exceptions: é, ée ne sont pas muets
    if (secondLastChar === "é" || secondLastChar === "è" || secondLastChar === "ê") {
      return word;
    }
    // Le e après consonne est généralement muet
    if (!/[aeiouyàâäéèêëïîôùûüœæ]/i.test(secondLastChar)) {
      return word.slice(0, -1) + `<span class="silent-letter">${word.slice(-1)}</span>`;
    }
    return word;
  }
  
  // Règle 4: Consonnes finales muettes
  
  // -t muet
  if (lastChar === "t") {
    // Exceptions où -t est prononcé
    if (["net", "brut", "but", "kit", "set", "direct", "strict"].includes(lowerWord)) {
      return word;
    }
    return word.slice(0, -1) + `<span class="silent-letter">${word.slice(-1)}</span>`;
  }
  
  // -d muet
  if (lastChar === "d") {
    return word.slice(0, -1) + `<span class="silent-letter">${word.slice(-1)}</span>`;
  }
  
  // -s muet (pluriel, fin de mot)
  if (lastChar === "s") {
    // Exceptions déjà gérées dans pronouncedFinalConsonants
    return word.slice(0, -1) + `<span class="silent-letter">${word.slice(-1)}</span>`;
  }
  
  // -x muet
  if (lastChar === "x") {
    // Exceptions: index, sphinx, etc.
    if (["index", "sphinx", "latex", "silex", "apex", "box", "fox"].includes(lowerWord)) {
      return word;
    }
    return word.slice(0, -1) + `<span class="silent-letter">${word.slice(-1)}</span>`;
  }
  
  // -p muet
  if (lastChar === "p") {
    return word.slice(0, -1) + `<span class="silent-letter">${word.slice(-1)}</span>`;
  }
  
  // -g muet après n (long, sang, rang)
  if (lastChar === "g" && secondLastChar === "n") {
    return word.slice(0, -1) + `<span class="silent-letter">${word.slice(-1)}</span>`;
  }
  
  // -z muet
  if (lastChar === "z") {
    return word.slice(0, -1) + `<span class="silent-letter">${word.slice(-1)}</span>`;
  }
  
  // -c muet après n (blanc, franc, banc)
  if (lastChar === "c" && secondLastChar === "n") {
    return word.slice(0, -1) + `<span class="silent-letter">${word.slice(-1)}</span>`;
  }
  
  // -ps muet (temps, corps)
  if (lowerWord.endsWith("ps")) {
    return word.slice(0, -2) + `<span class="silent-letter">${word.slice(-2)}</span>`;
  }
  
  // -ds muet (pluriels en -d)
  if (lowerWord.endsWith("ds")) {
    return word.slice(0, -2) + `<span class="silent-letter">${word.slice(-2)}</span>`;
  }
  
  // -ts muet (pluriels en -t)
  if (lowerWord.endsWith("ts")) {
    return word.slice(0, -2) + `<span class="silent-letter">${word.slice(-2)}</span>`;
  }
  
  return word;
}

function processText(text: string): string {
  // Séparer en tokens (mots et ponctuation/espaces)
  const tokens = text.split(/(\s+|[.,!?;:'"«»\-—()\[\]{}])/);
  
  return tokens.map(token => {
    // Traiter seulement les mots (contenant des lettres)
    if (/^[a-zA-ZàâäéèêëïîôùûüçœæÀÂÄÉÈÊËÏÎÔÙÛÜÇŒÆ]+$/.test(token)) {
      return processWord(token);
    }
    return token;
  }).join("");
}

interface SilentLetterTextProps {
  text: string;
  className?: string;
}

export const SilentLetterText: React.FC<SilentLetterTextProps> = ({ text, className = "" }) => {
  const processedText = processText(text);
  
  // Parser le HTML pour créer les éléments React
  const parts = processedText.split(/(<span class="silent-letter">.*?<\/span>)/g);
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        const match = part.match(/<span class="silent-letter">(.*?)<\/span>/);
        if (match) {
          return (
            <span key={index} className="text-muted-foreground/40">
              {match[1]}
            </span>
          );
        }
        return part;
      })}
    </span>
  );
};
