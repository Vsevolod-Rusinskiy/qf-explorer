'use client'

import { Header } from './header'
import { Nav } from './nav'
import { HomePageLayout } from './home-page-layout'
import { StatisticsBlock } from './statistics-block'
import { BlockListWidget } from '@/4_widgets/block-list/ui/block-list-widget'

export const HomePage = () => {
  return (
    <HomePageLayout header={<Header />}>
        <Nav  />
        <StatisticsBlock loading={false}/>
        <BlockListWidget />
    </HomePageLayout>
  )
} 

