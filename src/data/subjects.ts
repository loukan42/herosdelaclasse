import { BookOpen, Calculator, Globe, Clock, FlaskConical, Languages } from "lucide-react";

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: typeof BookOpen;
  color: string;
  available: boolean;
}

export const subjects: Subject[] = [
  {
    id: "lecture",
    name: "Lecture",
    description: "Histoires interactives pour apprendre à lire",
    icon: BookOpen,
    color: "from-amber-500 to-orange-600",
    available: true
  },
  {
    id: "mathematiques",
    name: "Mathématiques",
    description: "Aventures pour découvrir les nombres",
    icon: Calculator,
    color: "from-blue-500 to-indigo-600",
    available: true
  },
  {
    id: "histoire",
    name: "Histoire",
    description: "Voyages dans le temps et découvertes",
    icon: Clock,
    color: "from-purple-500 to-violet-600",
    available: false
  },
  {
    id: "geographie",
    name: "Géographie",
    description: "Explorations du monde entier",
    icon: Globe,
    color: "from-emerald-500 to-teal-600",
    available: false
  },
  {
    id: "sciences",
    name: "Sciences",
    description: "Expériences et découvertes scientifiques",
    icon: FlaskConical,
    color: "from-green-500 to-lime-600",
    available: true
  },
  {
    id: "langues",
    name: "Langues vivantes",
    description: "Apprendre l'anglais en s'amusant",
    icon: Languages,
    color: "from-red-500 to-orange-600",
    available: false
  }
];

export function getSubject(subjectId: string): Subject | undefined {
  return subjects.find(s => s.id === subjectId);
}
