'use client'

import { useState } from 'react'
import { axiosClient } from '@/5_shared/api/axios-client'
import { useBlockList } from '../model/use-block-list'

async function checkProcessorStatus() {
  try {
    const res = await axiosClient.get('/processor/status')
    return res.data?.isRunning
  } catch {
    return false
  }
}

export const BlockListWidget = () => {
  const { data, loading, error, refetch } = useBlockList()
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)

  const handleUpdate = async () => {
    setIsUpdating(true)
    setUpdateError(null)
    try {
      await axiosClient.post('/processor/update')
      let attempts = 0
      const maxAttempts = 30 // 30 * 2сек = 60 секунд
      let isRunning = true
      while (attempts < maxAttempts && isRunning) {
        await new Promise((res) => setTimeout(res, 2000))
        isRunning = await checkProcessorStatus()
        attempts++
      }
      if (!isRunning) {
        await refetch()
      } else {
        setUpdateError('Процессор не завершил работу за 60 секунд')
      }
    } catch {
      setUpdateError('Ошибка при запуске обновления')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="my-8 p-4 border rounded bg-white text-gray-500">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Список блоков</h2>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={handleUpdate}
          disabled={isUpdating}
        >
          {isUpdating ? 'Обновление...' : 'Обновить'}
        </button>
      </div>
      {(loading || isUpdating) && <div>Загрузка...</div>}
      {error && <div className="text-red-500">Ошибка загрузки блоков</div>}
      {updateError && <div className="text-red-500">{updateError}</div>}
      {!loading && !isUpdating && !error && !updateError && (
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