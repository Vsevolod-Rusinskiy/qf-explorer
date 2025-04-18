'use client'

import { Header } from './header'
import { Nav } from './nav'
import { HomePageLayout } from './home-page-layout'
import { StatisticsBlock } from './statistics-block'
import { BlockListWidget } from '@/2_widgets'

export const HomePage = () => {
  return (
    <HomePageLayout header={<Header marginBottom={4} />}>
        <Nav  />
        <StatisticsBlock loading={false}/>
        <BlockListWidget />
    </HomePageLayout>
  )
} 

