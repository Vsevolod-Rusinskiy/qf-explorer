/**
 * Форматирует значение баланса в удобочитаемый формат
 * @param balance - баланс в виде BigInt
 * @returns отформатированная строка с балансом
 */
export function formatBalance(balance: bigint): string {
  return balance.toString()
} 