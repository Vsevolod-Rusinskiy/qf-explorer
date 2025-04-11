import { Block } from '../model'

export interface BaseEvent {
  id: string
  block: Block
}

export interface BalancesTransferEvent extends BaseEvent {
  from: string
  to: string
  amount: bigint
  fee?: bigint
}

export interface SystemExtrinsicSuccessEvent extends BaseEvent {
  extrinsicId: string
}

export interface SystemExtrinsicFailedEvent extends BaseEvent {
  extrinsicId: string
  error: string
}
