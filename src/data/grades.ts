import cpImage from "@/assets/grades/cp.png";
import ce1Image from "@/assets/grades/ce1.png";
import ce2Image from "@/assets/grades/ce2.png";
import cm1Image from "@/assets/grades/cm1.png";
import cm2Image from "@/assets/grades/cm2.png";

export interface Grade {
  id: string;
  name: string;
  fullNameKey: string;
  descriptionKey: string;
  color: string;
  image: string;
}

export const grades: Grade[] = [
  {
    id: "CP",
    name: "CP",
    fullNameKey: "grades.cp.fullName",
    descriptionKey: "grades.cp.description",
    color: "from-sky-400 to-blue-500",
    image: cpImage
  },
  {
    id: "CE1",
    name: "CE1",
    fullNameKey: "grades.ce1.fullName",
    descriptionKey: "grades.ce1.description",
    color: "from-emerald-400 to-teal-500",
    image: ce1Image
  },
  {
    id: "CE2",
    name: "CE2",
    fullNameKey: "grades.ce2.fullName",
    descriptionKey: "grades.ce2.description",
    color: "from-amber-400 to-orange-500",
    image: ce2Image
  },
  {
    id: "CM1",
    name: "CM1",
    fullNameKey: "grades.cm1.fullName",
    descriptionKey: "grades.cm1.description",
    color: "from-violet-400 to-purple-500",
    image: cm1Image
  },
  {
    id: "CM2",
    name: "CM2",
    fullNameKey: "grades.cm2.fullName",
    descriptionKey: "grades.cm2.description",
    color: "from-rose-400 to-pink-500",
    image: cm2Image
  }
];

export function getGrade(gradeId: string): Grade | undefined {
  return grades.find(g => g.id === gradeId);
}

export function getAvailableGrades(stories: { level: string }[]): string[] {
  const usedLevels = new Set(stories.map(s => s.level));
  return grades.filter(g => usedLevels.has(g.id)).map(g => g.id);
}
