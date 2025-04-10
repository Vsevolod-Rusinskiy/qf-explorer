import { BlockDetailsPage } from "@/1_pages"

interface BlockPageProps {
  params: {
    id: string
  }
}

export default function Page({ params }: BlockPageProps) {
  return (
    <BlockDetailsPage blockId={params.id} />
  )
} 