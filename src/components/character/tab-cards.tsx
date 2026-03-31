import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CharData } from '@/types/character'

interface TabCardsProps {
  data: CharData
}

export function TabCards({ data }: TabCardsProps) {
  const { card } = data

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">카드</CardTitle>
      </CardHeader>
      <CardContent>
        {card ? (
          <div className="rounded-md bg-secondary/50 px-4 py-3">
            <p className="text-sm font-medium">{card}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">카드 세트 정보가 없습니다.</p>
        )}
      </CardContent>
    </Card>
  )
}
