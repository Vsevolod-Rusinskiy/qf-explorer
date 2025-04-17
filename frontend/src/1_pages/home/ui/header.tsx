'use client'

import clsx from 'clsx'

interface HeaderProps {
  marginBottom?: number;
}

export const Header = ({ marginBottom }: HeaderProps) => {
  const containerClasses = clsx(
    "border-b border-gray-500 pb-2",
    `mb-${marginBottom}`,
  )
  
  return (
    <div className={containerClasses}>
      <h1 className="text-4xl font-bold text-center mb-1">
        QF Network Explorer
      </h1>
      
      <div className="text-center">
        <p className="">
          Добро пожаловать в блок-эксплорер для QuantumFusion Network
        </p>
      </div>
    </div>
  )
} 