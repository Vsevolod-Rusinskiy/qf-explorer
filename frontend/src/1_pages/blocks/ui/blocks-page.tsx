'use client'

import Link from 'next/link'

export const BlocksPage = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Блоки</h1>
        <Link 
          href="/"
          className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
        >
          На главную
        </Link>
      </div>
      
      <div className="border rounded overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Номер блока
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Хеш
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Время
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Транзакций
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Валидатор
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-blue-600 hover:underline">
                  <Link href={`/blocks/1`}>1</Link>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-mono truncate max-w-[150px]">
                  0x123456789abcdef...
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm">2023-04-10 14:25:13</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm">3</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-mono truncate max-w-[150px]">
                  0xabcdef1234567890...
                </div>
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-blue-600 hover:underline">
                  <Link href={`/blocks/2`}>2</Link>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-mono truncate max-w-[150px]">
                  0xabcdef123456789...
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm">2023-04-10 14:25:23</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm">1</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-mono truncate max-w-[150px]">
                  0xabcdef1234567890...
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex justify-between">
        <div className="text-sm text-gray-500">Показано 2 блока</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded disabled:opacity-50" disabled>
            Предыдущие
          </button>
          <button className="px-3 py-1 border rounded bg-blue-500 text-white hover:bg-blue-600">
            Следующие
          </button>
        </div>
      </div>
    </main>
  )
} 