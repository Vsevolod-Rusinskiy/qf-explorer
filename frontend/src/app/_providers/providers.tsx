'use client'

import { ReactNode } from 'react'
import { ApolloProviderCustom } from '@/5_shared/api/apollo-provider'

interface ProvidersProps {
  children: ReactNode
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ApolloProviderCustom>
      {children}
    </ApolloProviderCustom>
  )
} 