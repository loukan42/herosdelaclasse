import { BookOpen, Calculator, Globe, Clock, FlaskConical, Languages } from "lucide-react";
import lectureImage from "@/assets/subjects/lecture.png";
import mathematiquesImage from "@/assets/subjects/mathematiques.png";
import histoireImage from "@/assets/subjects/histoire.png";
import geographieImage from "@/assets/subjects/geographie.png";
import sciencesImage from "@/assets/subjects/sciences.png";
import languesImage from "@/assets/subjects/langues.png";

export interface Subject {
  id: string;
  nameKey: string;
  descriptionKey: string; // i18n key for description
  icon: typeof BookOpen;
  color: string;
  available: boolean;
  backgroundImage?: string;
}

export const subjects: Subject[] = [
  {
    id: "lecture",
    nameKey: "subjects.lecture.name",
    descriptionKey: "subjects.lecture",
    icon: BookOpen,
    color: "from-amber-500 to-orange-600",
    available: true,
    backgroundImage: lectureImage
  },
  {
    id: "mathematiques",
    nameKey: "subjects.mathematiques.name",
    descriptionKey: "subjects.mathematiques",
    icon: Calculator,
    color: "from-blue-500 to-indigo-600",
    available: true,
    backgroundImage: mathematiquesImage
  },
  {
    id: "histoire",
    nameKey: "subjects.histoire.name",
    descriptionKey: "subjects.histoire",
    icon: Clock,
    color: "from-purple-500 to-violet-600",
    available: true,
    backgroundImage: histoireImage
  },
  {
    id: "geographie",
    nameKey: "subjects.geographie.name",
    descriptionKey: "subjects.geographie",
    icon: Globe,
    color: "from-emerald-500 to-teal-600",
    available: false,
    backgroundImage: geographieImage
  },
  {
    id: "sciences",
    nameKey: "subjects.sciences.name",
    descriptionKey: "subjects.sciences",
    icon: FlaskConical,
    color: "from-green-500 to-lime-600",
    available: true,
    backgroundImage: sciencesImage
  },
  {
    id: "langues",
    nameKey: "subjects.langues.name",
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
