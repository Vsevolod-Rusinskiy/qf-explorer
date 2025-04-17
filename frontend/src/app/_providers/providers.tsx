'use client'

import { ReactNode } from 'react'
import { ApolloProviderCustom } from '@/5_shared/api/apollo-provider'

interface ProvidersProps {
  children: ReactNode
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ApolloProviderCustom>
      {/* Здесь будут добавляться провайдеры: Apollo, React Query и др. */}
      {children}
    </ApolloProviderCustom>
  )
} 