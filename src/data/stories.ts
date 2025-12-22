import coverForetEnchantee from "@/assets/cover-foret-enchantee.jpg";
import coverTresorPirate from "@/assets/cover-tresor-pirate.jpg";
import coverRoyaumeNuages from "@/assets/cover-royaume-nuages.jpg";

export interface Choice {
  label: string;
  targetPageId: string;
}

export interface StoryPage {
  id: string;
  storyId: string;
  image: string;
  title?: string;
  text: string;
  textMasculine?: string;
  textFeminine?: string;
  choices: Choice[];
  isEnding?: boolean;
  endingType?: 'happy' | 'alternative';
}

export interface Story {
  id: string;
  title: string;
  coverImage: string;
  ageMin: number;
  ageMax: number;
  description: string;
  startPageId: string;
}

export const stories: Story[] = [
  {
    id: "foret-enchantee",
    title: "La Forêt Enchantée",
    coverImage: coverForetEnchantee,
    ageMin: 5,
    ageMax: 8,
    description: "Pars à l'aventure dans une forêt magique peuplée de créatures extraordinaires !",
    startPageId: "page-1"
  },
  {
    id: "tresor-pirate",
    title: "Le Trésor du Pirate",
    coverImage: coverTresorPirate,
    ageMin: 6,
    ageMax: 9,
    description: "Embarque sur un navire pirate et pars à la recherche d'un trésor légendaire !",
    startPageId: "page-1"
  },
  {
    id: "royaume-nuages",
    title: "Le Royaume des Nuages",
    coverImage: coverRoyaumeNuages,
    ageMin: 4,
    ageMax: 7,
    description: "Envole-toi vers un monde merveilleux où les nuages sont des îles flottantes !",
    startPageId: "page-1"
  }
];

export const storyPages: Record<string, StoryPage[]> = {
  "foret-enchantee": [
    {
      id: "page-1",
      storyId: "foret-enchantee",
      image: "/placeholder.svg",
      title: "L'entrée de la forêt",
      text: "Bonjour {prenom} ! Tu te trouves devant une immense forêt aux arbres brillants. Un chemin scintillant s'enfonce dans les bois. Que veux-tu faire ?",
      textMasculine: "Tu es prêt pour l'aventure !",
      textFeminine: "Tu es prête pour l'aventure !",
      choices: [
        { label: "Suivre le chemin scintillant", targetPageId: "page-2" },
        { label: "Contourner la forêt", targetPageId: "page-3" }
      ]
    },
    {
      id: "page-2",
      storyId: "foret-enchantee",
      image: "/placeholder.svg",
      title: "La clairière magique",
      text: "{prenom}, tu arrives dans une clairière baignée de lumière dorée. Un petit lutin t'observe depuis un champignon géant. Il te fait signe d'approcher.",
      choices: [
        { label: "S'approcher du lutin", targetPageId: "page-4" },
        { label: "Explorer les champignons", targetPageId: "page-5" }
      ]
    },
    {
      id: "page-3",
      storyId: "foret-enchantee",
      image: "/placeholder.svg",
      title: "Le ruisseau chantant",
      text: "En contournant la forêt, {prenom} découvre un ruisseau qui semble chanter une douce mélodie. Des poissons arc-en-ciel nagent dans l'eau cristalline.",
      choices: [
        { label: "Suivre le ruisseau", targetPageId: "page-6" },
        { label: "Traverser et entrer dans la forêt", targetPageId: "page-2" }
      ]
    },
    {
      id: "page-4",
      storyId: "foret-enchantee",
      image: "/placeholder.svg",
      title: "Le lutin Flambeau",
      text: "\"Bienvenue, {prenom} !\" s'exclame le lutin. \"Je m'appelle Flambeau. Je cherche quelqu'un de courageux pour m'aider à retrouver ma lanterne magique. Veux-tu m'aider ?\"",
      textMasculine: "Il te regarde avec espoir.",
      textFeminine: "Il te regarde avec espoir.",
      choices: [
        { label: "Accepter d'aider Flambeau", targetPageId: "page-7" },
        { label: "Demander plus d'informations", targetPageId: "page-8" }
      ]
    },
    {
      id: "page-5",
      storyId: "foret-enchantee",
      image: "/placeholder.svg",
      title: "Les champignons dansants",
      text: "{prenom}, tu t'approches des champignons et... ils se mettent à danser ! L'un d'eux te tend un petit chapeau.",
      choices: [
        { label: "Mettre le chapeau", targetPageId: "page-9" },
        { label: "Refuser poliment et partir", targetPageId: "page-4" }
      ]
    },
    {
      id: "page-6",
      storyId: "foret-enchantee",
      image: "/placeholder.svg",
      title: "La cascade enchantée",
      text: "Le ruisseau te mène à une magnifique cascade arc-en-ciel, {prenom}. Derrière le rideau d'eau, tu aperçois une grotte brillante.",
      choices: [
        { label: "Entrer dans la grotte", targetPageId: "page-10" },
        { label: "Rester admirer la cascade", targetPageId: "fin-cascade" }
      ]
    },
    {
      id: "page-7",
      storyId: "foret-enchantee",
      image: "/placeholder.svg",
      title: "La quête commence",
      text: "Flambeau saute de joie ! \"Merci, {prenom} ! Ma lanterne a été emportée par le vent jusqu'au sommet de l'Arbre Géant. Allons-y ensemble !\"",
      choices: [
        { label: "Grimper à l'arbre", targetPageId: "fin-happy" },
        { label: "Chercher un autre chemin", targetPageId: "page-10" }
      ]
    },
    {
      id: "page-8",
      storyId: "foret-enchantee",
      image: "/placeholder.svg",
      title: "L'histoire de Flambeau",
      text: "Flambeau t'explique : \"Ma lanterne éclaire le cœur de la forêt. Sans elle, les créatures magiques perdent leur éclat. S'il te plaît, {prenom}, aide-moi !\"",
      choices: [
        { label: "Accepter la quête", targetPageId: "page-7" },
        { label: "Explorer seul la forêt", targetPageId: "page-5" }
      ]
    },
    {
      id: "page-9",
      storyId: "foret-enchantee",
      image: "/placeholder.svg",
      title: "Le chapeau magique",
      text: "{prenom}, dès que tu mets le chapeau, tu rapetisses à la taille des champignons ! Tu peux maintenant voir le monde magique des petites créatures.",
      textMasculine: "Tu es devenu tout petit !",
      textFeminine: "Tu es devenue toute petite !",
      choices: [
        { label: "Explorer le monde miniature", targetPageId: "fin-mini" },
        { label: "Retirer le chapeau", targetPageId: "page-4" }
      ]
    },
    {
      id: "page-10",
      storyId: "foret-enchantee",
      image: "/placeholder.svg",
      title: "La grotte aux cristaux",
      text: "La grotte est remplie de cristaux lumineux, {prenom} ! Au centre, une fée endormie tient une lanterne dorée dans ses mains.",
      choices: [
        { label: "Réveiller doucement la fée", targetPageId: "fin-happy" },
        { label: "Prendre la lanterne sans bruit", targetPageId: "fin-alt" }
      ]
    },
    {
      id: "fin-happy",
      storyId: "foret-enchantee",
      image: "/placeholder.svg",
      title: "Une fin magique !",
      text: "Bravo {prenom} ! Grâce à ton courage et ta gentillesse, tu as aidé les créatures de la forêt enchantée. La lanterne brille de mille feux et illumine tout le royaume magique. Tu es maintenant un ami de la forêt pour toujours !",
      textMasculine: "Tu es un vrai héros !",
      textFeminine: "Tu es une vraie héroïne !",
      choices: [],
      isEnding: true,
      endingType: "happy"
    },
    {
      id: "fin-cascade",
      storyId: "foret-enchantee",
      image: "/placeholder.svg",
      title: "La paix de la cascade",
      text: "{prenom}, tu décides de rester près de la cascade enchantée. Sa musique apaisante te remplit de bonheur. Les poissons arc-en-ciel deviennent tes amis et tu passes une journée merveilleuse.",
      choices: [],
      isEnding: true,
      endingType: "alternative"
    },
    {
      id: "fin-mini",
      storyId: "foret-enchantee",
      image: "/placeholder.svg",
      title: "Le monde miniature",
      text: "Quelle aventure, {prenom} ! Dans le monde des champignons, tu découvres une civilisation entière de petites créatures. Elles t'accueillent comme leur invité d'honneur et te montrent leurs merveilles cachées.",
      textMasculine: "Tu es devenu l'explorateur du monde minuscule !",
      textFeminine: "Tu es devenue l'exploratrice du monde minuscule !",
      choices: [],
      isEnding: true,
      endingType: "happy"
    },
    {
      id: "fin-alt",
      storyId: "foret-enchantee",
      image: "/placeholder.svg",
      title: "Une leçon apprise",
      text: "Oh non, {prenom} ! La fée se réveille en sursaut et la lanterne s'éteint. Mais elle comprend que tu voulais aider. Elle rallume la lanterne et te montre le chemin du retour. Parfois, il vaut mieux demander que de prendre.",
      choices: [],
      isEnding: true,
      endingType: "alternative"
    }
  ]
};

export function getStory(storyId: string): Story | undefined {
  return stories.find(s => s.id === storyId);
}

export function getStoryPages(storyId: string): StoryPage[] {
  return storyPages[storyId] || [];
}

export function getPage(storyId: string, pageId: string): StoryPage | undefined {
  const pages = getStoryPages(storyId);
  return pages.find(p => p.id === pageId);
}

export function processText(
  text: string,
  prenom: string,
  genre: 'masculin' | 'feminin' | 'neutre',
  textMasculine?: string,
  textFeminine?: string
): string {
  let processedText = text.replace(/{prenom}/g, prenom || "Aventurier");
  
  if (genre === 'masculin' && textMasculine) {
    processedText += " " + textMasculine;
  } else if (genre === 'feminin' && textFeminine) {
    processedText += " " + textFeminine;
  }
  
  return processedText;
}
