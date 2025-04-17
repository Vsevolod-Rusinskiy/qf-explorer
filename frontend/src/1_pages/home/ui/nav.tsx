'use client'

import Link from 'next/link'
import clsx from 'clsx'

interface NavProps {
  marginBottom?: number;
}

export const Nav = ({ marginBottom = 4 }: NavProps) => {
  const containerClasses = clsx(
    `mb-${marginBottom}`
  )
  
  return (
    <div className={containerClasses}>
      <div className="flex justify-center gap-4">
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
  )
} 