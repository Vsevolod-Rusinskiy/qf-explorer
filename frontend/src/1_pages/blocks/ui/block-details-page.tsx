'use client'

import Link from 'next/link'

interface BlockDetailsPageProps {
  blockId: string
}

export const BlockDetailsPage = ({ blockId }: BlockDetailsPageProps) => {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Блок #{blockId}</h1>
        <div className="flex gap-4">
          <Link 
            href="/blocks"
            className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            К списку блоков
          </Link>
          <Link 
            href="/"
            className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            На главную
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Информация о блоке</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <p className="text-sm text-gray-500 mb-1">Номер блока</p>
              <p className="font-semibold">{blockId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Хеш блока</p>
              <p className="font-mono text-sm break-all">0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Временная метка</p>
              <p>2023-04-10 14:25:13</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Статус</p>
              <p className="text-green-600 font-medium">Финализирован</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Валидатор</p>
              <p className="font-mono text-sm break-all">0xabcdef1234567890abcdef1234567890abcdef12</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Размер</p>
              <p>2.5 KB</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Транзакции ({blockId === '1' ? '3' : '1'})</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Хеш
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  От
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Кому
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сумма
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blockId === '1' ? (
                <>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-blue-600 hover:underline truncate max-w-[150px]">
                        <Link href={`/transactions/tx1`}>0xtx111222333...</Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono truncate max-w-[100px]">
                        0xabc123...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono truncate max-w-[100px]">
                        0xdef456...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">10 QF</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-green-600">Успешно</div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-blue-600 hover:underline truncate max-w-[150px]">
                        <Link href={`/transactions/tx2`}>0xtx444555666...</Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono truncate max-w-[100px]">
                        0xdef456...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono truncate max-w-[100px]">
                        0xghi789...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">5 QF</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-green-600">Успешно</div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-blue-600 hover:underline truncate max-w-[150px]">
                        <Link href={`/transactions/tx3`}>0xtx777888999...</Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono truncate max-w-[100px]">
                        0xabc123...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono truncate max-w-[100px]">
                        0xghi789...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">2 QF</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-green-600">Успешно</div>
                    </td>
                  </tr>
                </>
              ) : (
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-blue-600 hover:underline truncate max-w-[150px]">
                      <Link href={`/transactions/tx4`}>0xtx000aaabbb...</Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono truncate max-w-[100px]">
                      0xghi789...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono truncate max-w-[100px]">
                      0xabc123...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">7 QF</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-green-600">Успешно</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
} 