import type { BlockListData, Block } from '@/5_shared/model/use-block-list'

export function TableList({ data }: { data: BlockListData }) {
    return (
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-1 px-2">ID</th>
              <th className="py-1 px-2">Hash</th>
              <th className="py-1 px-2">Время</th>
              <th className="py-1 px-2">Статус</th>
            </tr>
          </thead>
          <tbody>
            {data?.block.map((b: Block) => (
              <tr key={b.id} className="border-t">
                <td className="py-1 px-2 font-mono">{b.id}</td>
                <td className="py-1 px-2 font-mono truncate max-w-xs">{b.hash}</td>
                <td className="py-1 px-2">{new Date(b.timestamp).toLocaleString()}</td>
                <td className="py-1 px-2">{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
    )
}