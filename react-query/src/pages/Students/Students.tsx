import { UseMutationResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteStudent, getStudents } from 'apis/students.api'
import { AxiosResponse } from 'axios'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Students as StudentsType } from 'types/students.type'
import { useQueryString } from 'utils/utils'
const LIMIT = 10
const RenderListStudents = (
  listStudents: StudentsType[],
  deleteStudentMutaion: UseMutationResult<AxiosResponse<{}, any>, unknown, string | number, unknown>
): JSX.Element => {
  return (
    <>
      {listStudents.map((student: StudentsType) => (
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
            <button
              className='font-medium text-red-600 dark:text-red-500'
              onClick={() => deleteStudentMutaion.mutate(student.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </>
  )
}

export default function Students() {
  const queryString: { page?: string } = useQueryString()
  const page = Number(queryString.page) || 1
  const userQuery = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['students', page], // queryKey này chúng ta có thể hiểu phần tử thứ nhất là 1 key giống như trong localStorage, và nó dùng để định danh cái api mà chúng ta đang tương tác, nhờ vậy nên ReactQueryDevtools mới có thể truy ra và show lên cho ta xem..., còn page ở đây nó giống như param trong useEffect, khi thằng này bị thay đổi thì nó sẽ chạy lại queryFn, và queryFn sẽ là 1 hàm call api thông thường
    queryFn: () => getStudents(page, LIMIT),
    // khi ta call những data có cùng 1 key ví dụ như ở đây là key student
    // thì ghi call data ở page 1 nó sẽ có 2 trạng thái là đã stale(cũ) hoặc chưa stale(cũ)
    // stale(cũ) ở đây mặc định là 0 time, thì khi call xong thường sẽ là stale(cũ) ngay lập tức
    // thì sự khác nhau giữa đã stale(cũ) và chưa stale(cũ) là:
    // nếu stale(cũ) thì nó sẽ gọi lại api, nếu chưa stale(cũ) thì nó sẽ không gọi lại api mà nó lấy data trong bộ nhớ cache ngầm để show ra cho ta và nó sẽ call api ngầm,khi call xong thì sẽ update lại data cached và trả về data mới cho mình, và trạng thái fetch sẽ là isLoading: false
    // ta có thể set thời gian stale(cũ) bằng staleTime: 60 * 1000
    // staleTime: 60 * 1000,
    // ở đây useQuery có 1 đặc điểm là nếu những component khác có trùng key với queryKey là students
    // ví dụ ta có 3 Component A, B, C
    // khi ta fetch api có key là students ở Component A thì khi ta fetch xong nó sẽ call api bình thường
    // nhưng khi ta qua Component B và ta fetch api vẫn có key là students thì nó sẽ trả về data cho B ngay lập tức, điều này cũng xảy ra tương tự với Component C bất chấp việc nó đã stale(cũ) hay chưa
    // và trong thời gian này nó sẽ âm thầm fetch data lại 1 lần nữa và cập nhật hết cho cả 3 Component A, B, C
    // nhưng khi cả 3 đều bị unmount( nghĩa là bị tắt hoặc ko còn sử dụng tới 3 Component đó nữa) thì nó sẽ đếm ngược sau 5 phút, và xóa data ở bộ nhớ đệm đi, và sau 5 phút nếu 1 trong 3 Component bị gọi lại thì nó sẽ fetch data lại
    //////////////////////////////
    // ở trên ta có thời gian cũ, nhưng nó còn có 1 loại thời gian nữa là thời gian lưu dữ data đã cũ(lưu ý là nó không lưu trữ data mới, data mới là data vừa gọi hiện tại)
    // cacheTime này có đặc điểm là khi nó hết thời gian thì nó sẽ xóa luôn những data đang cũ ra khỏi bộ nhớ ngầm của nó
    // nếu những data cũ bị xóa khỏi bộ nhớ ngầm, thì khi gọi lại những data đó nó sẽ chạy lại như 1 api mới 1 cách thông thường
    // thường thì người ta sẽ cài cacheTime lớn hơn staleTime
    // cacheTime: 5 * 1000 // mặc định thì sẽ không có thời gian cacheTime, hoặc có thể hiểu là vô thời hạn
    keepPreviousData: true // là giữ lại data trước đó, và vẫn âm thầm call data mới, khi call xong thì cập nhật cho ta data mới, nên isLoading sẽ luôn là flase
  })
  const totalPage = Math.ceil(Number(data?.headers['x-total-count'] || 0) / LIMIT)
  console.log('totalPage', Array(totalPage).fill(0))

  const deleteStudentMutaion = useMutation({
    mutationFn: (id: number | string) => {
      return deleteStudent(id)
    },
    onSuccess(_, id) {
      toast.success(`xóa thành công student có id là ${id}`)
      userQuery.invalidateQueries({ queryKey: ['students', page], exact: true }) // khi delete thành công thì nó sẽ gọi lại những api có queryKey là student để làm mới nó
    }
  })

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
      <div className='mt-6'>
        <Link
          to='/students/add'
          className=' rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 '
        >
          Add Student
        </Link>
      </div>
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
          <tbody>{!isLoading && data && RenderListStudents(data.data, deleteStudentMutaion)}</tbody>
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
