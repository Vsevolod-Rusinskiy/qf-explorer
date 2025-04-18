'use client'

import { useState } from 'react'
import { axiosClient } from '@/5_shared/api/axios-client'
import { useBlockList } from '../model/use-block-list'
import { TableList } from './table-list'
import { BlockListHeader } from './block-list-header'

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
      <BlockListHeader isUpdating={isUpdating} onUpdate={handleUpdate} />
      {(loading || isUpdating) && <div>Загрузка...</div>}
      {error && <div className="text-red-500">Ошибка загрузки блоков</div>}
      {updateError && <div className="text-red-500">{updateError}</div>}
      {!loading && !isUpdating && !error && !updateError && (
        <TableList data={data ?? { block: [] }} />
      )}
    </div>
  )
} 