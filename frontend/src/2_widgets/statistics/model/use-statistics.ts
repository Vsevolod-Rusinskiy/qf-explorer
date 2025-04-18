import { useQuery, gql } from '@apollo/client'

export type Statistics = {
  total_blocks: number
  total_transactions: number
  total_accounts: number
  average_block_time: number
}

export type StatisticsData = {
  statistics_by_pk: Statistics
}

const GET_STATISTICS = gql`
  query GetStatistics {
    statistics_by_pk(id: "current") {
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