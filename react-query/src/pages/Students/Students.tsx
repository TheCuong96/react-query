import { getStudents } from 'apis/students.api'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Students as StudentsType, Student } from 'types/students.type'

const RenderListStudents = (listStudents: Student[]): JSX.Element => {
  return (
    <>
      {listStudents.map((student: Student) => (
        <tr
          key={student.id}
          className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
        >
          <td className='py-4 px-6'>{student.id}</td>
          <td className='py-4 px-6'>
            <img src={student.avatar} alt='student' className='h-5 w-5' />
          </td>
          <th scope='row' className='whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white'>
            {student.last_name}
          </th>
          <td className='py-4 px-6'>{student.email}</td>
          <td className='py-4 px-6 text-right'>
            <Link
              to={`/students/${student.id}`}
              className='mr-5 font-medium text-blue-600 hover:underline dark:text-blue-500'
            >
              Edit
            </Link>
            <button className='font-medium text-red-600 dark:text-red-500'>Delete</button>
          </td>
        </tr>
      ))}
    </>
  )
}

export default function Students() {
  const [listStudents, setListStudents] = useState<StudentsType>([])
  useEffect(() => {
    getStudents(1, 10).then((res) => {
      console.log(res)
      setListStudents(res.data)
    })
  }, [])
  // console.log('listStudents', listStudents)
  return (
    <div>
      <h1 className='text-lg'>Students</h1>
      {/* <div role='status' className='mt-6 animate-pulse'>
        <div className='mb-4 h-4  rounded bg-gray-200 dark:bg-gray-700' />
        <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
        <div className='mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700' />
        <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
        <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
        <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
        <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
        <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
        <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
        <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
        <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
        <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
        <div className='h-10  rounded bg-gray-200 dark:bg-gray-700' />
        <span className='sr-only'>Loading...</span>
      </div> */}
      <div className='relative mt-6 overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
          <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th scope='col' className='py-3 px-6'>
                #
              </th>
              <th scope='col' className='py-3 px-6'>
                Avatar
              </th>
              <th scope='col' className='py-3 px-6'>
                Name
              </th>
              <th scope='col' className='py-3 px-6'>
                Email
              </th>
              <th scope='col' className='py-3 px-6'>
                <span className='sr-only'>Action</span>
              </th>
            </tr>
          </thead>
          <tbody>{RenderListStudents(listStudents)}</tbody>
        </table>
      </div>

      <div className='mt-6 flex justify-center'>
        <nav aria-label='Page navigation example'>
          <ul className='inline-flex -space-x-px'>
            <li>
              <span className='cursor-not-allowed rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                Previous
              </span>
            </li>
            <li>
              <a
                className='border border-gray-300 bg-white bg-white py-2 px-3 leading-tight text-gray-500 text-gray-500  hover:bg-gray-100 hover:bg-gray-100 hover:text-gray-700 hover:text-gray-700'
                href='/students?page=8'
              >
                1
              </a>
            </li>
            <li>
              <a
                className='rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                href='/students?page=1'
              >
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
