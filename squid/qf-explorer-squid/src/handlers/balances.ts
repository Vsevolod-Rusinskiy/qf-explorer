import { Block, Transaction, Account } from '../model'
import { ProcessorContext } from '../processor'
import { BalancesTransferEvent } from '../types/events'

export async function handleBalancesTransfer(ctx: ProcessorContext, block: Block, event: BalancesTransferEvent) {
  // Создаем или находим аккаунт отправителя
  let fromAccount = await ctx.store.get(Account, event.from)
  if (!fromAccount) {
    fromAccount = new Account({
      id: event.from,
      balance: 0n,
      updatedAt: block.timestamp
    })
    await ctx.store.save(fromAccount)
  }

  // Создаем или находим аккаунт получателя
  let toAccount = await ctx.store.get(Account, event.to)
  if (!toAccount) {
    toAccount = new Account({
      id: event.to,
      balance: 0n,
      updatedAt: block.timestamp
    })
    await ctx.store.save(toAccount)
  }

  const transaction = new Transaction({
    id: event.id,
    block,
    blockNumber: Number(block.id),
    timestamp: block.timestamp,
    from: fromAccount,
    to: toAccount,
    amount: event.amount,
    fee: event.fee || 0n,
    status: 'SUCCESS',
    type: 'TRANSFER',
    data: JSON.stringify({})
  })

  await ctx.store.save(transaction)
} 