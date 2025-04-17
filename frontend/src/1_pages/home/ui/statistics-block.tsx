import { StatisticsBlokUnit } from "./statistics-block-unit"


export const StatisticsBlock = ({loading}: {loading: boolean}) => {
    return (
        <div className="border rounded p-6 bg-gray-50">
        <h2 className="text-2xl font-semibold mb-4 text-gray-500" >Статистика сети</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatisticsBlokUnit title="Блоков" value="0" loading={loading} />
          <StatisticsBlokUnit title="Транзакций" value="0" loading={loading} />
          <StatisticsBlokUnit title="Аккаунтов" value="0" loading={loading} />
          <StatisticsBlokUnit title="Время блока" value="0.1s" loading={loading} />
        </div>
      </div>
    )
}

