'use client'

import { useState } from 'react'
import { Header } from './header'
import { Nav } from './nav'
import { HomePageLayout } from './home-page-layout'
import { StatisticsBlock } from './statistics-block'
import { BlockListWidget } from '@/4_widgets/block-list/ui/block-list-widget'

export const HomePage = () => {
  const [loading, setLoading] = useState(false)

  return (
    <HomePageLayout header={<Header />}>
        <Nav  />
        <StatisticsBlock loading={loading}/>
        <BlockListWidget />
    </HomePageLayout>
  )
} 

