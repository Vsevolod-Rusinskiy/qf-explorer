import React from 'react'

interface BlockListHeaderProps {
  isUpdating: boolean
  onUpdate: () => void
}

export const BlockListHeader = ({ isUpdating, onUpdate }: BlockListHeaderProps) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-bold">Список блоков</h2>
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      onClick={onUpdate}
      disabled={isUpdating}
    >
      {isUpdating ? 'Обновление...' : 'Обновить'}
    </button>
  </div>
) 