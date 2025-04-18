'use client'

import { useState } from 'react'
import { Header } from './header'
import { HomePageLayout } from './home-page-layout'
import { BlockListWidget, StatisticsWidget } from '@/2_widgets'
import { TransactionListWidget } from '@/2_widgets/transaction-list/ui/transaction-list-widget'
import { useBlockList } from '@/5_shared/model/use-block-list'
import { useTransactionList } from '@/5_shared/model/use-transaction-list'
import { useStatistics } from '@/5_shared/model/use-statistics'
import { UpdateButton } from '@/5_shared/ui/buttons/update-button'
import { axiosClient } from '@/5_shared/api/axios-client'

async function checkProcessorStatus() {
  try {
    const res = await axiosClient.get('/processor/status')
    return res.data?.isRunning
  } catch {
    return false
  }
}

export const HomePage = () => {
  const { data: blockData, loading: blockLoading, error: blockError, refetch: refetchBlocks } = useBlockList()
  const { data: txData, loading: txLoading, error: txError, refetch: refetchTx } = useTransactionList()
  const { data: statsData, loading: statsLoading, error: statsError, refetch: refetchStats } = useStatistics()
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)

  // Логи для диагностики
  console.log('statsData:', statsData)
  console.log('statsError:', statsError)
  console.log('blockData:', blockData)
  console.log('blockError:', blockError)

  const handleUpdate = async () => {
    setIsUpdating(true)
    setUpdateError(null)
    try {
      await axiosClient.post('/processor/update')
      let attempts = 0
      const maxAttempts = 30
      let isRunning = true
      while (attempts < maxAttempts && isRunning) {
        await new Promise((res) => setTimeout(res, 2000))
        isRunning = await checkProcessorStatus()
        attempts++
      }
      if (!isRunning) {
        await Promise.all([
          refetchBlocks(),
          refetchTx(),
          refetchStats()
        ])
      } else {
        setUpdateError('Процессор не завершил работу за 60 секунд')
      }
    } catch {
      setUpdateError('Ошибка при запуске обновления')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <HomePageLayout header={<Header marginBottom={4} />}>
      <div className="flex justify-end mb-4">
        <UpdateButton isUpdating={isUpdating} onUpdate={handleUpdate}>
          Обновить
        </UpdateButton>
      </div>
      <StatisticsWidget
        data={statsData}
        loading={statsLoading}
        error={statsError}
        isUpdating={isUpdating}
      />
      <BlockListWidget
        data={blockData}
        loading={blockLoading}
        error={blockError}
        isUpdating={isUpdating}
        updateError={updateError}
      />
      <TransactionListWidget
        data={txData}
        loading={txLoading}
        error={txError}
        isUpdating={isUpdating}
      />
    </HomePageLayout>
  )
} 

