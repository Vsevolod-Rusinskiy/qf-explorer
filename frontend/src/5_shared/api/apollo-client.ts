import { ApolloClient, InMemoryCache } from '@apollo/client'

export const apolloClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || 'http://localhost:8080/v1/graphql',
  cache: new InMemoryCache(),
}) 