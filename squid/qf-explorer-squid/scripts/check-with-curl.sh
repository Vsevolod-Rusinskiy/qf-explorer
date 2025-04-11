#!/bin/bash

# Настройки
RPC_ENDPOINT="https://dev.qfnetwork.xyz/rpc"
LOG_FILE="./block-check.log"

# Проверяем наличие jq
if ! command -v jq &> /dev/null; then
  echo "Error: jq is not installed. Please install it with 'brew install jq' on macOS."
  exit 1
fi

# Функция для логирования
log() {
  timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  echo "[$timestamp] $1"
  echo "[$timestamp] $1" >> "$LOG_FILE"
}

# Создаем новый лог-файл
echo "--- Начало проверки блоков ---" > "$LOG_FILE"

# Функция для выполнения JSON-RPC запроса
rpc_request() {
  method=$1
  params=$2
  
  response=$(curl -s -X POST "$RPC_ENDPOINT" \
    -H "Content-Type: application/json" \
    -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"$method\",\"params\":$params}")
  
  # Выводим для отладки
  log "DEBUG: response = $response"
  
  echo "$response"
}

# Получаем последний финализированный блок
log "Получаем последний финализированный блок..."
finalized_response=$(rpc_request "chain_getFinalizedHead" "[]")

if ! echo "$finalized_response" | grep -q "result"; then
  log "Ошибка при получении финализированного блока: $finalized_response"
  exit 1
fi

finalized_hash=$(echo "$finalized_response" | sed -n 's/.*"result":"\([^"]*\)".*/\1/p')
log "Последний финализированный блок хеш: $finalized_hash"

# Получаем заголовок финализированного блока
header_response=$(rpc_request "chain_getHeader" "[\""$finalized_hash"\"]")

if ! echo "$header_response" | grep -q "result"; then
  log "Ошибка при получении заголовка блока: $header_response"
  exit 1
fi

# Извлекаем номер блока
finalized_number=$(echo "$header_response" | sed -n 's/.*"number":"\([^"]*\)".*/\1/p')
log "Номер блока в HEX: $finalized_number"

# Преобразуем HEX в DEC
finalized_number_dec=$(printf "%d" $finalized_number)
log "Номер последнего финализированного блока: $finalized_number_dec"

# Создаем массив номеров блоков для проверки
step_size=100000
block_numbers=()

for ((i = finalized_number_dec; i > 0; i -= step_size)); do
  block_numbers+=($i)
  if [ ${#block_numbers[@]} -ge 10 ]; then
    break
  fi
done

log "Проверим доступность состояния для блоков: ${block_numbers[*]}"

# Проверяем каждый блок
for block_number in "${block_numbers[@]}"; do
  log "Проверяем блок #$block_number..."
  
  # Получаем хеш блока
  block_hash_response=$(rpc_request "chain_getBlockHash" "[$block_number]")
  
  if ! echo "$block_hash_response" | grep -q "result"; then
    log "Ошибка при получении хеша блока #$block_number: $block_hash_response"
    continue
  fi
  
  block_hash=$(echo "$block_hash_response" | sed -n 's/.*"result":"\([^"]*\)".*/\1/p')
  log "Блок #$block_number хеш: $block_hash"
  
  # Пробуем получить данные блока
  block_response=$(rpc_request "chain_getBlock" "[\""$block_hash"\"]")
  
  if echo "$block_response" | grep -q "result"; then
    log "Блок #$block_number успешно получен"
  else
    log "Блок #$block_number НЕ НАЙДЕН: $block_response"
    continue
  fi
  
  # Пробуем получить версию рантайма для этого блока
  runtime_response=$(rpc_request "state_getRuntimeVersion" "[\""$block_hash"\"]")
  
  if echo "$runtime_response" | grep -q "result"; then
    spec_version=$(echo "$runtime_response" | sed -n 's/.*"specVersion":\([^,}]*\).*/\1/p')
    log "Блок #$block_number версия рантайма: $spec_version, состояние ДОСТУПНО"
  else
    error=$(echo "$runtime_response" | sed -n 's/.*"message":"\([^"]*\)".*/\1/p')
    log "Блок #$block_number состояние НЕ ДОСТУПНО: $error"
  fi
  
  # Пробуем получить данные из хранилища для этого блока
  key="0x26aa394eea5630e07c48ae0c9558cef780d41e5e16056765bc8461851072c9d7"
  storage_response=$(rpc_request "state_getStorageAt" "[\""$key"\", \""$block_hash"\"]")
  
  if echo "$storage_response" | grep -q "result"; then
    log "Блок #$block_number хранилище доступно, состояние ДОСТУПНО"
  else
    error=$(echo "$storage_response" | sed -n 's/.*"message":"\([^"]*\)".*/\1/p')
    log "Блок #$block_number хранилище НЕ ДОСТУПНО: $error"
  fi
  
  echo ""
done

log "Проверка завершена" 