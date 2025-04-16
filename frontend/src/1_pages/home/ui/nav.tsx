'use client'

import Link from 'next/link'

export const Nav = () => {
  return (
    <div className="flex justify-center gap-4 mt-6 mb-8">
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
  )
} 