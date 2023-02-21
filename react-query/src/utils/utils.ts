import { useSearchParams } from 'react-router-dom'

export const useQueryString = () => {
  const [searchParams] = useSearchParams()
  const searchParamsObject = Object.fromEntries([...searchParams])
  console.log('searchParams', searchParamsObject) // nó lấy url đằng sau dấu chấm hỏi [http://localhost:3000/students?page=3] --> {page: '3'} và show ra cho ta data mà ta có thể sử dụng được

  return searchParamsObject
}
