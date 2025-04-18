import { StatisticsBlokUnit } from "./statistics-block-unit"
import type { StatisticsData } from '@/5_shared/model/use-statistics'

interface StatisticsWidgetProps {
  data?: StatisticsData
  loading: boolean
  error?: any
  isUpdating: boolean
}

export const StatisticsWidget = ({ data, loading, error, isUpdating }: StatisticsWidgetProps) => {
  const isLoading = loading || isUpdating
  const stats = data?.statistics?.[0]
  return (
    <div className="border rounded p-6 bg-gray-50">
      <h2 className="text-2xl font-semibold mb-4 text-gray-500" >Статистика сети</h2>
      {error && <div className="text-red-500 mb-2">Ошибка загрузки статистики</div>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatisticsBlokUnit title="Блоков" value={String(stats?.total_blocks ?? 0)} loading={isLoading} />
        <StatisticsBlokUnit title="Транзакций" value={String(stats?.total_transactions ?? 0)} loading={isLoading} />
        <StatisticsBlokUnit title="Аккаунтов" value={String(stats?.total_accounts ?? 0)} loading={isLoading} />
        <StatisticsBlokUnit title="Время блока" value={stats ? `${stats.average_block_time}s` : '0.1s'} loading={isLoading} />
      </div>
    </div>
  )
} 