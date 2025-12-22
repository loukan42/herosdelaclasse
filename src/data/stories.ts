import coverFeu from "@/assets/stories/feu/cover.png";
import page1Feu from "@/assets/stories/feu/page1.png";
import page2Feu from "@/assets/stories/feu/page2.png";
import page3Feu from "@/assets/stories/feu/page3.png";
import page4Feu from "@/assets/stories/feu/page4.png";
import page5Feu from "@/assets/stories/feu/page5.png";
import page6Feu from "@/assets/stories/feu/page6.png";

import coverJardin from "@/assets/stories/jardin/cover.png";
import page1Jardin from "@/assets/stories/jardin/page1.png";
import page2Jardin from "@/assets/stories/jardin/page2.png";
import page3Jardin from "@/assets/stories/jardin/page3.png";
import page4Jardin from "@/assets/stories/jardin/page4.png";
import page5Jardin from "@/assets/stories/jardin/page5.png";
import page6Jardin from "@/assets/stories/jardin/page6.png";
import page7Jardin from "@/assets/stories/jardin/page7.png";

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
    id: "le-feu-seteint",
    title: "Le feu s'éteint",
    coverImage: coverFeu,
    ageMin: 6,
    ageMax: 6,
    description: "Ce soir, le clan est silencieux. Le feu ne brûle plus. Aide ton clan à rallumer le feu et découvre la vie préhistorique !",
    startPageId: "page-1"
  },
  {
    id: "le-jardin-secret",
    title: "Le jardin secret du château",
    coverImage: coverJardin,
    ageMin: 6,
    ageMax: 6,
    description: "Le soleil se lève sur le château. Tu remarques un petit chemin qui disparaît derrière un mur couvert de lierre. Découvre le secret du jardin !",
    startPageId: "page-1"
  }
];

export const storyPages: Record<string, StoryPage[]> = {
  "le-feu-seteint": [
    // Page 1 - Le feu éteint
    {
      id: "page-1",
      storyId: "le-feu-seteint",
      image: page1Feu,
      title: "Le feu éteint",
      text: `Ce soir, le clan est silencieux.
Le feu ne brûle plus.
Sans feu, il fait froid.
Sans feu, on ne peut pas manger chaud.
Tu es là, près du cercle de pierres.
Tu sens que le clan compte sur toi.
Tu prends une grande respiration.`,
      choices: [
        { label: "Chercher des pierres autour du camp", targetPageId: "page-2" },
        { label: "Explorer la grotte voisine", targetPageId: "page-3" },
        { label: "Appeler les amis du clan", targetPageId: "page-4" }
      ]
    },
    // Page 2 - Les pierres qui brillent
    {
      id: "page-2",
      storyId: "le-feu-seteint",
      image: page2Feu,
      title: "Les pierres qui brillent",
      text: `Tu regardes le sol attentivement.
Entre les cailloux, quelque chose brille.
Ce n'est pas une pierre comme les autres.
Elle est lisse et lumineuse.
Tu la prends doucement.
Elle pourrait aider à faire du feu.`,
      choices: [
        { label: "Retourner au feu", targetPageId: "page-5" },
        { label: "Explorer la grotte", targetPageId: "page-3" },
        { label: "Appeler les amis", targetPageId: "page-4" }
      ]
    },
    // Page 3 - La grotte calme
    {
      id: "page-3",
      storyId: "le-feu-seteint",
      image: page3Feu,
      title: "La grotte calme",
      text: `La grotte est sombre mais tranquille.
Tu entres doucement.
Sur le sol, il y a du bois très sec.
Parfait pour faire du feu.
Tu en prends un morceau.
Tu ressors fier de ta trouvaille.`,
      textMasculine: "Tu ressors fier de ta trouvaille.",
      textFeminine: "Tu ressors fière de ta trouvaille.",
      choices: [
        { label: "Retourner au feu", targetPageId: "page-5" },
        { label: "Chercher des pierres", targetPageId: "page-2" },
        { label: "Appeler les amis", targetPageId: "page-4" }
      ]
    },
    // Page 4 - Les amis du clan
    {
      id: "page-4",
      storyId: "le-feu-seteint",
      image: page4Feu,
      title: "Les amis du clan",
      text: `Tu appelles les amis du clan.
Ils arrivent en souriant.
L'un d'eux apporte une torche.
Ensemble, vous réfléchissez.
À plusieurs, tout semble plus simple.
Le feu peut revenir.`,
      choices: [
        { label: "Retourner tous ensemble au feu", targetPageId: "page-5" },
        { label: "Chercher encore des objets", targetPageId: "page-1" }
      ]
    },
    // Page 5 - Rallumer le feu
    {
      id: "page-5",
      storyId: "le-feu-seteint",
      image: page5Feu,
      title: "Rallumer le feu",
      text: `Tu es devant le foyer.
Tu poses le bois sec.
Tu frottes la pierre brillante.
La torche éclaire tout.
Une petite flamme apparaît.
Puis le feu revient.
Le clan est heureux grâce à toi.`,
      choices: [
        { label: "Regarder le feu danser", targetPageId: "page-6" },
        { label: "Partager la chaleur avec le clan", targetPageId: "page-6" }
      ]
    },
    // Page 6 - La nuit peut commencer (FIN)
    {
      id: "page-6",
      storyId: "le-feu-seteint",
      image: page6Feu,
      title: "La nuit peut commencer",
      text: `La nuit arrive doucement.
Le feu crépite.
Le clan se rassemble.
Tu te sens fier.
Grâce à toi, tout le monde est au chaud.
Demain sera une belle journée.`,
      textMasculine: "Tu te sens fier.",
      textFeminine: "Tu te sens fière.",
      choices: [
        { label: "Recommencer l'aventure", targetPageId: "page-1" },
        { label: "Choisir une nouvelle aventure", targetPageId: "menu" }
      ],
      isEnding: true,
      endingType: "happy"
    }
  ],
  "le-jardin-secret": [
    // Page 1 - Le château au matin
    {
      id: "page-1",
      storyId: "le-jardin-secret",
      image: page1Jardin,
      title: "Le château au matin",
      text: `Le soleil se lève sur le château.
Les tours brillent doucement.
Tu te promènes dans la cour.
Tout est calme.
Soudain, tu remarques un petit chemin.
Il disparaît derrière un mur couvert de lierre.
Ton cœur bat un peu plus fort.`,
      choices: [
        { label: "Suivre le petit chemin", targetPageId: "page-3" },
        { label: "Observer le mur de lierre", targetPageId: "page-2" },
        { label: "Retourner vers le château", targetPageId: "page-1" }
      ]
    },
    // Page 2 - Le mur couvert de lierre
    {
      id: "page-2",
      storyId: "le-jardin-secret",
      image: page2Jardin,
      title: "Le mur couvert de lierre",
      text: `Tu t'approches du mur.
Le lierre bouge doucement.
Derrière les feuilles, quelque chose brille.
C'est une vieille clé.
Elle est froide dans ta main.
Elle semble très ancienne.`,
      choices: [
        { label: "Prendre la clé", targetPageId: "page-3" },
        { label: "Suivre le chemin", targetPageId: "page-3" },
        { label: "Regarder autour de toi", targetPageId: "page-1" }
      ]
    },
    // Page 3 - La petite porte secrète
    {
      id: "page-3",
      storyId: "le-jardin-secret",
      image: page3Jardin,
      title: "La petite porte secrète",
      text: `Le chemin mène à une petite porte.
Elle est presque cachée.
La porte est fermée.
Mais tu te souviens de la clé.
Peut-être qu'elle peut servir.
Le silence est doux.`,
      choices: [
        { label: "Utiliser la clé ancienne", targetPageId: "page-4" },
        { label: "Revenir en arrière", targetPageId: "page-1" },
        { label: "Écouter derrière la porte", targetPageId: "page-4" }
      ]
    },
    // Page 4 - Le jardin oublié
    {
      id: "page-4",
      storyId: "le-jardin-secret",
      image: page4Jardin,
      title: "Le jardin oublié",
      text: `La porte s'ouvre doucement.
Derrière, un jardin apparaît.
Il est un peu sauvage.
Des fleurs attendent de l'eau.
Des oiseaux chantent doucement.
Le jardin semble heureux de te voir.`,
      choices: [
        { label: "Explorer le jardin", targetPageId: "page-5" },
        { label: "Arroser les plantes", targetPageId: "page-6" },
        { label: "Observer les fleurs", targetPageId: "page-5" }
      ]
    },
    // Page 5 - La graine dorée
    {
      id: "page-5",
      storyId: "le-jardin-secret",
      image: page5Jardin,
      title: "La graine dorée",
      text: `Près d'un vieux banc, tu vois quelque chose.
C'est une petite graine dorée.
Elle brille au soleil.
Elle semble très spéciale.
Tu la prends avec soin.`,
      choices: [
        { label: "Planter la graine", targetPageId: "page-6" },
        { label: "Arroser le jardin", targetPageId: "page-6" },
        { label: "Continuer à observer", targetPageId: "page-4" }
      ]
    },
    // Page 6 - Le jardin qui revit
    {
      id: "page-6",
      storyId: "le-jardin-secret",
      image: page6Jardin,
      title: "Le jardin qui revit",
      text: `Tu arroses les plantes doucement.
Tu plantes la graine dorée.
Le jardin semble sourire.
Les fleurs s'ouvrent.
Les couleurs deviennent plus vives.
Le jardin reprend vie grâce à toi.`,
      choices: [
        { label: "Regarder le jardin fleurir", targetPageId: "page-7" },
        { label: "Partager le secret", targetPageId: "page-7" },
        { label: "S'asseoir calmement", targetPageId: "page-7" }
      ]
    },
    // Page 7 - Le secret bien gardé (FIN)
    {
      id: "page-7",
      storyId: "le-jardin-secret",
      image: page7Jardin,
      title: "Le secret bien gardé",
      text: `Le jardin est magnifique.
Il est calme et vivant.
Tu souris.
Ce secret est précieux.
Tu sais que tu pourras revenir.
Le jardin t'attendra.`,
      choices: [
        { label: "Recommencer l'aventure", targetPageId: "page-1" },
        { label: "Choisir une autre aventure", targetPageId: "menu" }
      ],
      isEnding: true,
      endingType: "happy"
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
  
  // Handle gendered text replacements in main text
  if (genre === 'feminin') {
    processedText = processedText.replace(/Tu ressors fier/g, "Tu ressors fière");
    processedText = processedText.replace(/Tu te sens fier/g, "Tu te sens fière");
  }
  
  return processedText;
}
