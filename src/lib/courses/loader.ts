import coursesJson from "../../../courses.json"

interface CoursesJson {
  courses: Record<string, number[]>
}

const data = coursesJson as CoursesJson

export const COURSES_DICT: Record<string, number[]> = data.courses || {}

export const SUBJECTS: string[] = Object.keys(COURSES_DICT).sort()

export const CLASSES: string[] = SUBJECTS.flatMap((subj) =>
  (COURSES_DICT[subj] || []).sort((a, b) => a - b).map((num) => `${subj}${num}`)
)
