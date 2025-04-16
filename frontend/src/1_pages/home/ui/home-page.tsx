'use client'

import { useState } from 'react'
import Link from 'next/link'

export const HomePage = () => {
  const [loading, setLoading] = useState(false)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          QF Network Explorer
        </h1>
        
        <div className="mb-8 text-center">
          <p className="mb-4">
            Добро пожаловать в блок-эксплорер для QuantumFusion Network
          </p>
          
          <div className="flex justify-center gap-4 mt-6">
            <Link 
              href="/blocks" 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Блоки
            </Link>
            <Link 
              href="/transactions" 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Транзакции
            </Link>
            <Link 
              href="/accounts" 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Аккаунты
            </Link>
          </div>
        </div>
        
        <div className="border rounded p-6 bg-gray-50">
          <h2 className="text-2xl font-semibold mb-4 text-gray-500" >Статистика сети</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border rounded p-3 bg-white">
              <div className="text-sm text-gray-500">Последний блок</div>
              <div className="font-mono text-lg text-gray-500">{loading ? '...' : '0'}</div>
            </div>
            <div className="border rounded p-3 bg-white">
              <div className="text-sm text-gray-500">Транзакций</div>
              <div className="font-mono text-lg text-gray-500">{loading ? '...' : '0'}</div>
            </div>
            <div className="border rounded p-3 bg-white">
              <div className="text-sm text-gray-500">Аккаунтов</div>
              <div className="font-mono text-lg text-gray-500">{loading ? '...' : '0'}</div>
            </div>
            <div className="border rounded p-3 bg-white">
              <div className="text-sm text-gray-500">Время блока</div>
              <div className="font-mono text-lg text-gray-500">{loading ? '...' : '0.1s'}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 