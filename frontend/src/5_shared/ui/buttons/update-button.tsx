import React from 'react'

interface UpdateButtonProps {
  isUpdating: boolean
  onUpdate: () => void
  children?: React.ReactNode
}

export const UpdateButton = ({ isUpdating, onUpdate, children }: UpdateButtonProps) => (
  <button
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    onClick={onUpdate}
    disabled={isUpdating}
  >
    {isUpdating ? 'Обновление...' : children || 'Обновить'}
  </button>
) 