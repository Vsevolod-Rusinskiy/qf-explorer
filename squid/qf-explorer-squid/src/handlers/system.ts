import { Block, Transaction } from '../model'
import { ProcessorContext } from '../processor'
import { SystemExtrinsicSuccessEvent, SystemExtrinsicFailedEvent } from '../types/events'

export async function handleSystemExtrinsicSuccess(ctx: ProcessorContext, block: Block, event: SystemExtrinsicSuccessEvent) {
  // В будущем здесь можно добавить логику для успешных экстринзиков
  // Например, обновление статистики, специальную обработку и т.д.
  console.log(`Успешный экстринзик: ${event.extrinsicId} в блоке ${block.id}`)
}

export async function handleSystemExtrinsicFailed(ctx: ProcessorContext, block: Block, event: SystemExtrinsicFailedEvent) {
  // Создаем запись о неудачной транзакции
  const transaction = new Transaction({
    id: event.extrinsicId,
    block,
    blockNumber: Number(block.id),
    timestamp: block.timestamp,
    status: 'FAILED',
    type: 'SYSTEM',
    data: JSON.stringify({ error: event.error })
  })

  await ctx.store.save(transaction)
} 