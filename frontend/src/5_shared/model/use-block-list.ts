import { useQuery, gql } from '@apollo/client'

export type Block = {
  id: string
  hash: string
  timestamp: string
  status: string
}

export type BlockListData = {
  block: Block[]
}

const GET_LATEST_BLOCKS = gql`
  query GetLatestBlocks {
    block(order_by: {id: desc}, limit: 20) {
      id
      hash
      timestamp
      status
    }
  }
`

export function useBlockList() {
  return useQuery<BlockListData>(GET_LATEST_BLOCKS)
} 