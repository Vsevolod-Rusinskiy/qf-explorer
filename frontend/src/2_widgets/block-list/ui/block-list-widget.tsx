'use client'

import { TableList } from './table-list'
import { Spinner } from '@/5_shared/ui'

import type { BlockListData } from '@/5_shared/model/use-block-list'

interface BlockListWidgetProps {
  data?: BlockListData
  loading: boolean
  error?: unknown
  isUpdating: boolean
  updateError: string | null
}

export const BlockListWidget = ({ data, loading, error, isUpdating, updateError }: BlockListWidgetProps) => {
  return (
    <div className="my-8 p-4 border rounded bg-white text-gray-500">
      <h2 className="text-xl font-bold mb-4">Список блоков</h2>
      {(loading || isUpdating) && <Spinner />}
      {error != null && <div className="text-red-500">Ошибка загрузки блоков</div>}
      {updateError && <div className="text-red-500">{updateError}</div>}
      {!loading && !isUpdating && !error && !updateError && (
        <TableList data={data ?? { block: [] }} />
      )}
    </div>
  )
} 