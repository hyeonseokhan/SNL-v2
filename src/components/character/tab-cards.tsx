import type { CharData } from '@/types/character'

interface TabCardsProps {
  data: CharData
}

export function TabCards({ data }: TabCardsProps) {
  const { card } = data

  return (
    <div className="rounded-lg bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold text-primary">카드</h3>
      {card ? (
        <div className="rounded-lg bg-secondary/50 px-4 py-3">
          <p className="font-medium">{card}</p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">카드 세트 정보가 없습니다.</p>
      )}
    </div>
  )
}
