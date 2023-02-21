import { useQuery } from '@tanstack/react-query'
import { getStudents } from 'apis/students.api'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Students as StudentsType, Student } from 'types/students.type'
import { useQueryString } from 'utils/utils'
const LIMIT = 10
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
  const queryString: { page?: string } = useQueryString()
  const page = Number(queryString.page) || 1

  const { data, isLoading } = useQuery({
    queryKey: ['students', page], // queryKey này chúng ta có thể hiểu phần tử thứ nhất là 1 key giống như trong localStorage, và nó dùng để định danh cái api mà chúng ta đang tương tác, nhờ vậy nên ReactQueryDevtools mới có thể truy ra và show lên cho ta xem..., còn page ở đây nó giống như param trong useEffect, khi thằng này bị thay đổi thì nó sẽ chạy lại queryFn, và queryFn sẽ là 1 hàm call api thông thường
    queryFn: () => getStudents(page, LIMIT)
  })
  const totalPage = Math.ceil(Number(data?.headers['x-total-count'] || 0) / LIMIT)
  console.log('totalPage', Array(totalPage).fill(0))

  /** 
  const [listStudents, setListStudents] = useState<StudentsType>([])
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    getStudents(1, 10)
      .then((res) => {
        console.log(res)
        setListStudents(res.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])
  // console.log('listStudents', listStudents)
  */
  return (
    <div>
      <h1 className='text-lg'>Students</h1>
      {isLoading && (
        <div role='status' className='mt-6 animate-pulse'>
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
        </div>
      )}
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
          <tbody>{!isLoading && data && RenderListStudents(data.data)}</tbody>
        </table>
      </div>

      {!isLoading && (
        <div className='mt-6 flex justify-center'>
          <nav aria-label='Page navigation example'>
            <ul className='inline-flex -space-x-px'>
              <li>
                {page === 1 ? (
                  <span className='cursor-not-allowed rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 '>
                    Previous
                  </span>
                ) : (
                  <Link
                    className='rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 '
                    to={`/students?page=${page - 1}`}
                  >
                    Previous
                  </Link>
                )}
              </li>
              {Array(totalPage)
                .fill(0)
                .map((_, index) => {
                  const pageNumber = index + 1
                  const isActive = page === pageNumber
                  // mặc định nó sẽ show page 1 ở lần render đầu tiên, sau đó khi ta click thì sẽ làm thay đổi url có page=giá trị ta vừa click -> khi url thay đổi thì useQueryString sẽ tra ra cho ta  1 page mới, và khi page có sự thay đổi thì useQuery sẽ call lại api và show ra cho ta kết quả như ta mong đợi
                  return (
                    <li key={pageNumber}>
                      <Link
                        className={classNames(
                          'border border-gray-300 py-2 px-3 leading-tight hover:bg-gray-100 hover:text-gray-700 ',
                          {
                            'bg-gray-100 text-gray-700': isActive,
                            'bg-white text-gray-500': !isActive
                          }
                        )}
                        to={`/students?page=${pageNumber}`}
                      >
                        {pageNumber}
                      </Link>
                    </li>
                  )
                })}
              <li>
                {page === totalPage ? (
                  <span className='cursor-not-allowed rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 '>
                    Next
                  </span>
                ) : (
                  <Link
                    className='rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 '
                    to={`/students?page=${page + 1}`}
                  >
                    Next
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  )
}
