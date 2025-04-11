import { ApiPromise, WsProvider } from '@polkadot/api'
import { processor } from './processor'

/**
 * Инициализирует процессор с динамическим определением начального блока
 * Эта функция должна быть вызвана перед запуском процессора
 */
export async function initProcessor(): Promise<void> {
  try {
    console.log('Инициализация процессора и определение начального блока...')
    
    // Подключаемся к RPC эндпоинту
    const provider = new WsProvider(process.env.RPC_QF_WS || 'wss://dev.qfnetwork.xyz/wss')
    const api = await ApiPromise.create({ provider })
    
    // Получаем финализированный хэш
    const finalizedHash = await api.rpc.chain.getFinalizedHead()
    console.log(`Финализированный хэш: ${finalizedHash.toString()}`)
    
    // Получаем заголовок блока
    const finalizedHeader = await api.rpc.chain.getHeader(finalizedHash)
    const finalizedBlockNumber = finalizedHeader.number.toNumber()
    console.log(`Номер финализированного блока: ${finalizedBlockNumber}`)
    
    // Определяем отступ от текущего блока (чтобы не обрабатывать слишком много блоков сразу)
    // Для первого запуска используем небольшой отступ, например 1000 блоков
    const blockOffset = 1000
    
    // Устанавливаем стартовый блок с отступом от текущего
    const startingBlock = Math.max(1, finalizedBlockNumber - blockOffset)
    console.log(`Установлен стартовый блок: ${startingBlock}`)
    
    // Настраиваем процессор на использование этого блока как начального
    processor.setBlockRange({ from: startingBlock })
    
    // Закрываем соединение
    await api.disconnect()
    
    console.log('Инициализация процессора завершена успешно')
  } catch (error) {
    console.error('Ошибка при инициализации процессора:', error)
    throw error
  }
} 