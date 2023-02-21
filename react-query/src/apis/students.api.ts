import { Student, Students } from 'types/students.type'
import http from 'utils/http'

export const getStudents = (page: number | string, limit: number | string, signal?: AbortSignal) =>
  http.get<Students>('students', {
    params: {
      _page: page,
      _limit: limit
    },
    signal
  })

export const addStudent = (student: Omit<Student, 'id'>) => http.post<Student>('/students', student)
