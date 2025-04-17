import { ApolloProvider } from '@apollo/client'
import { apolloClient } from './apollo-client'
import { ReactNode } from 'react'

interface ApolloProviderProps {
  children: ReactNode
}

export const ApolloProviderCustom = ({ children }: ApolloProviderProps) => (
  <ApolloProvider client={apolloClient}>
    {children}
  </ApolloProvider>
) 