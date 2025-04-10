'use client'

import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <>
      {/* Здесь будут добавляться провайдеры: Apollo, React Query и др. */}
      {children}
    </>
  )
} 