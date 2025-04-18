import { useQuery, gql } from '@apollo/client'

export type Statistics = {
  id: string
  total_blocks: number
  total_transactions: number
  total_accounts: number
  average_block_time: number
}

export type StatisticsData = {
  statistics: Statistics[]
}

const GET_STATISTICS = gql`
  query GetStatistics {
    statistics(where: {id: {_eq: "current"}}) {
      id
      total_blocks
      total_transactions
      total_accounts
      average_block_time
    }
  }
`

export function useStatistics() {
  return useQuery<StatisticsData>(GET_STATISTICS)
} 