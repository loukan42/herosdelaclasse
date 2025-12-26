// Define which subjects are available for each grade level
// This is independent of whether stories exist - it defines the curriculum structure

export const gradeSubjectsMap: Record<string, string[]> = {
  "CP": ["lecture", "mathematiques"],
  "CE1": ["lecture", "mathematiques", "sciences"],
  "CE2": ["lecture", "mathematiques", "sciences"],
  "CM1": ["mathematiques", "sciences", "histoire", "geographie", "langues"],
  "CM2": ["mathematiques", "sciences", "histoire", "geographie", "langues"]
};

export function getSubjectsForGrade(gradeId: string): string[] {
  return gradeSubjectsMap[gradeId] || [];
}

export function isSubjectAvailableForGrade(gradeId: string, subjectId: string): boolean {
  const subjects = gradeSubjectsMap[gradeId];
  return subjects ? subjects.includes(subjectId) : false;
}
