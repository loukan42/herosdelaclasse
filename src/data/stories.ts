import coverFeu from "@/assets/stories/feu/cover.png";
import page1Feu from "@/assets/stories/feu/page1.png";
import page2Feu from "@/assets/stories/feu/page2.png";
import page3Feu from "@/assets/stories/feu/page3.png";
import page4Feu from "@/assets/stories/feu/page4.png";
import page5Feu from "@/assets/stories/feu/page5.png";
import page6Feu from "@/assets/stories/feu/page6.png";

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
    ageMin: 5,
    ageMax: 7,
    description: "Ce soir, le clan est silencieux. Le feu ne brûle plus. Aide ton clan à rallumer le feu et découvre la vie préhistorique !",
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
