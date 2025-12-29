import { BookOpen, Calculator, Globe, Clock, FlaskConical, Languages } from "lucide-react";
import lectureImage from "@/assets/subjects/lecture.png";
import mathematiquesImage from "@/assets/subjects/mathematiques.png";
import histoireImage from "@/assets/subjects/histoire.png";
import geographieImage from "@/assets/subjects/geographie.png";
import sciencesImage from "@/assets/subjects/sciences.png";
import languesImage from "@/assets/subjects/langues.png";

export interface Subject {
  id: string;
  name: string;
  descriptionKey: string; // i18n key for description
  icon: typeof BookOpen;
  color: string;
  available: boolean;
  backgroundImage?: string;
}

export const subjects: Subject[] = [
  {
    id: "lecture",
    name: "Lecture",
    descriptionKey: "subjects.lecture",
    icon: BookOpen,
    color: "from-amber-500 to-orange-600",
    available: true,
    backgroundImage: lectureImage
  },
  {
    id: "mathematiques",
    name: "Mathématiques",
    descriptionKey: "subjects.mathematiques",
    icon: Calculator,
    color: "from-blue-500 to-indigo-600",
    available: true,
    backgroundImage: mathematiquesImage
  },
  {
    id: "histoire",
    name: "Histoire",
    descriptionKey: "subjects.histoire",
    icon: Clock,
    color: "from-purple-500 to-violet-600",
    available: true,
    backgroundImage: histoireImage
  },
  {
    id: "geographie",
    name: "Géographie",
    descriptionKey: "subjects.geographie",
    icon: Globe,
    color: "from-emerald-500 to-teal-600",
    available: false,
    backgroundImage: geographieImage
  },
  {
    id: "sciences",
    name: "Sciences",
    descriptionKey: "subjects.sciences",
    icon: FlaskConical,
    color: "from-green-500 to-lime-600",
    available: true,
    backgroundImage: sciencesImage
  },
  {
    id: "langues",
    name: "Langues vivantes",
    descriptionKey: "subjects.langues",
    icon: Languages,
    color: "from-red-500 to-orange-600",
    available: false,
    backgroundImage: languesImage
  }
];

export function getSubject(subjectId: string): Subject | undefined {
  return subjects.find(s => s.id === subjectId);
}
