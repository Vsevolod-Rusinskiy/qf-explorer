'use client'

export const BlockListWidget = () => {
  const handleUpdate = async () => {
    try {
      const res = await fetch('/api/processor/update', {
        method: 'POST',
      })
      if (res.ok) {
        alert('Обновление запущено!')
      } else {
        alert('Ошибка при запуске обновления')
      }
    } catch (e) {
      alert('Ошибка сети!')
    }
  }

  return (
    <div className="my-8 p-4 border rounded bg-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Список блоков</h2>
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