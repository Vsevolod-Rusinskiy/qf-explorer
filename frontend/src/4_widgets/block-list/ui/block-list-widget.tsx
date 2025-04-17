'use client'

import { axiosClient } from '@/5_shared/api/axios-client'
import { useBlockList } from '../model/use-block-list'

export const BlockListWidget = () => {
  const { data, loading, error, refetch } = useBlockList()

  console.log('data', data)
  console.log('error', error)

  const handleUpdate = async () => {
    try {
      await axiosClient.post('/processor/update')
      alert('Обновление запущено!')
      refetch()
    } catch {
      // Ошибка уже обработана в interceptor
    }
  }

  return (
    <div className="my-8 p-4 border rounded bg-white text-gray-500">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Список блоков</h2>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={handleUpdate}
        >
          Обновить
        </button>
      </div>
      {loading && <div>Загрузка...</div>}
      {error && <div className="text-red-500">Ошибка загрузки блоков</div>}
      {!loading && !error && (
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-1 px-2">ID</th>
              <th className="py-1 px-2">Hash</th>
              <th className="py-1 px-2">Время</th>
              <th className="py-1 px-2">Валидатор</th>
            </tr>
          </thead>
          <tbody>
            {data?.block.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="py-1 px-2 font-mono">{b.id}</td>
                <td className="py-1 px-2 font-mono truncate max-w-xs">{b.hash}</td>
                <td className="py-1 px-2">{new Date(b.timestamp).toLocaleString()}</td>
                <td className="py-1 px-2 font-mono">{b.validator}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
} 