import { Spinner } from '@/5_shared/ui/spinner'

export function StatisticsBlokUnit({title, value, loading}: {title: string, value: string, loading: boolean} ) {
  return (
    <div className="border rounded p-3 bg-white flex flex-col items-center justify-center min-h-[70px]">
      <div className="text-sm text-gray-500 mb-1">{title}</div>
      <div className="font-mono text-lg text-gray-500 min-h-[28px] flex items-center justify-center">
        {loading ? <Spinner /> : value}
      </div>
    </div>
  )
} 