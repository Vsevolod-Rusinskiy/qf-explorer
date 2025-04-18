'use client'

import { useState } from 'react'
import { Header } from './header'
import { Nav } from './nav'
import { HomePageLayout } from './home-page-layout'
import { StatisticsBlock } from './statistics-block'
import { BlockListWidget } from '@/2_widgets'
import { TransactionListWidget } from '@/2_widgets/transaction-list/ui/transaction-list-widget'
import { useBlockList } from '@/2_widgets/block-list/model/use-block-list'
import { useTransactionList } from '@/2_widgets/transaction-list/model/use-transaction-list'
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
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)

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
          refetchTx()
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
      <Nav />
      <div className="flex justify-end mb-4">
        <UpdateButton isUpdating={isUpdating} onUpdate={handleUpdate}>
          Обновить
        </UpdateButton>
      </div>
      <StatisticsBlock loading={false}/>
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

