'use client'

export const BlockListWidget = () => {
  const handleUpdate = () => {
    alert('Обновление данных! (заглушка)')
  }

  return (
    <div className="my-8 p-4 border rounded bg-white text-gray-500">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold " >Список блоков</h2>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={handleUpdate}
        >
          Обновить
        </button>
      </div>
      <div>Тут будет список блоков...</div>
    </div>
  )
} 