import React from 'react'
import { UpdateButton } from '@/5_features/block-list-update/ui/update-button'

interface BlockListHeaderProps {
  isUpdating: boolean
  onUpdate: () => void
}

export const BlockListHeader = ({ isUpdating, onUpdate }: BlockListHeaderProps) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-bold">Список блоков</h2>
    <UpdateButton isUpdating={isUpdating} onUpdate={onUpdate}>
      Обновить
    </UpdateButton>
  </div>
) 