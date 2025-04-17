import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || 'http://localhost:8080/v1/graphql',
})

const roleLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    'x-hasura-role': 'public',
  }
}))

export const apolloClient = new ApolloClient({
  link: roleLink.concat(httpLink),
  cache: new InMemoryCache(),
}) 