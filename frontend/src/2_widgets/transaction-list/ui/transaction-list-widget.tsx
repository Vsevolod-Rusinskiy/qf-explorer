import { Spinner } from '@/5_shared/ui'
import type { TransactionListData } from '@/5_shared/model/use-transaction-list'

interface TransactionListWidgetProps {
  data?: TransactionListData
  loading: boolean
  error?: any
  isUpdating: boolean
}

export const TransactionListWidget = ({ data, loading, error, isUpdating }: TransactionListWidgetProps) => {
  return (
    <div className="my-8 p-4 border rounded bg-white text-gray-500">
      <h2 className="text-xl font-bold mb-4">Список транзакций</h2>
      {(loading || isUpdating) && <Spinner />}
      {error && <div className="text-red-500">Ошибка загрузки транзакций</div>}
      {!loading && !isUpdating && !error && (
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-1 px-2">ID</th>
              <th className="py-1 px-2">Время</th>
              <th className="py-1 px-2">Статус</th>
            </tr>
          </thead>
          <tbody>
            {data?.transaction.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="py-1 px-2 font-mono">{t.id}</td>
                <td className="py-1 px-2">{new Date(t.timestamp).toLocaleString()}</td>
                <td className="py-1 px-2">{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
} 