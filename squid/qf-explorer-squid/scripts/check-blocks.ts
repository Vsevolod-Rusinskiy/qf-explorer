import { WsProvider, ApiPromise } from '@polkadot/api';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

// Настройки
const RPC_ENDPOINT = process.env.RPC_QF_WS || 'wss://dev.qfnetwork.xyz/wss';
const LOG_FILE = './block-check.log';

// Функция для логирования
const log = (message: string) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  fs.appendFileSync(LOG_FILE, logMessage + '\n');
};

// Главная функция
async function main() {
  log(`Connecting to ${RPC_ENDPOINT}...`);
  
  // Создаем соединение с нодой
  const provider = new WsProvider(RPC_ENDPOINT);
  const api = await ApiPromise.create({ provider });
  
  // Получаем информацию о сети
  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version()
  ]);
  
  log(`Connected to chain ${chain} using ${nodeName} v${nodeVersion}`);
  
  // Получаем последний блок
  const lastHeader = await api.rpc.chain.getHeader();
  const lastBlockNumber = lastHeader.number.toNumber();
  log(`Last block number: ${lastBlockNumber}`);
  
  // Получаем финализированный блок
  const finalizedHash = await api.rpc.chain.getFinalizedHead();
  const finalizedHeader = await api.rpc.chain.getHeader(finalizedHash);
  const finalizedBlockNumber = finalizedHeader.number.toNumber();
  log(`Finalized block number: ${finalizedBlockNumber}`);
  
  // Проверяем доступность состояния для разных блоков
  // Начинаем с финализированного блока и идем назад
  const stepSize = 10000; // Шаг для проверки блоков
  let blockNumbers = [];
  
  // Создаем массив номеров блоков для проверки
  for (let i = finalizedBlockNumber; i > 0; i -= stepSize) {
    blockNumbers.push(i);
    if (blockNumbers.length >= 20) break; // Ограничиваем количество проверок
  }
  
  log(`Will check state availability for blocks: ${blockNumbers.join(', ')}`);
  
  // Проверяем каждый блок
  for (const blockNumber of blockNumbers) {
    try {
      const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
      log(`Block #${blockNumber} hash: ${blockHash.toString()}`);
      
      // Пробуем получить данные блока
      const block = await api.rpc.chain.getBlock(blockHash);
      log(`Block #${blockNumber} retrieved successfully`);
      
      // Пробуем получить состояние RuntimeVersion для этого блока
      try {
        const runtime = await api.rpc.state.getRuntimeVersion(blockHash);
        log(`Block #${blockNumber} runtime version: ${runtime.specVersion}, state is AVAILABLE`);
      } catch (error) {
        log(`Block #${blockNumber} state NOT AVAILABLE: ${error.message}`);
      }
      
      // Пробуем получить какое-то значение из хранилища для этого блока
      try {
        // Ключ для информации о системе (timestamp)
        const timestampKey = api.query.timestamp.now.key();
        const timestamp = await api.rpc.state.getStorage(timestampKey, blockHash);
        log(`Block #${blockNumber} timestamp storage: ${timestamp.toString()}, state is AVAILABLE`);
      } catch (error) {
        log(`Block #${blockNumber} storage NOT AVAILABLE: ${error.message}`);
      }
    } catch (error) {
      log(`Error checking block #${blockNumber}: ${error.message}`);
    }
  }
  
  log('Check completed');
  await api.disconnect();
  process.exit(0);
}

// Запуск скрипта
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 