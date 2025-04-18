import { useQuery, gql } from '@apollo/client'

export type Block = {
  id: string
  hash: string
  timestamp: string
  validator: string | null
}

export type BlockListData = {
  block: Block[]
}

const GET_LATEST_BLOCKS = gql`
  query GetLatestBlocks {
    block(order_by: {id: desc}, limit: 10) {
      id
      hash
      timestamp
      validator
    }
  }
`

export function useBlockList() {
  return useQuery<BlockListData>(GET_LATEST_BLOCKS)
} 