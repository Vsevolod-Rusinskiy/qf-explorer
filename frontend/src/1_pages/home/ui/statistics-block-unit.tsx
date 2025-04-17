export function StatisticsBlokUnit({title, value, loading}: {title: string, value: string, loading: boolean} ) {
    return (
        <div className="border rounded p-3 bg-white">
            <div className="text-sm text-gray-500">{title}</div>
            <div className="font-mono text-lg text-gray-500">{loading ? '...' : value}</div>
        </div>
    )
}