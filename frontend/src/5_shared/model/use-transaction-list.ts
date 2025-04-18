import { useQuery, gql } from '@apollo/client'

export type Transaction = {
  id: string
  status: string
  timestamp: string
}

export type TransactionListData = {
  transaction: Transaction[]
}

const GET_LATEST_TRANSACTIONS = gql`
  query GetLatestTransactions {
    transaction(order_by: {timestamp: desc}, limit: 20) {
      id
      status
      timestamp
    }
  }
`

export function useTransactionList() {
  return useQuery<TransactionListData>(GET_LATEST_TRANSACTIONS)
} 