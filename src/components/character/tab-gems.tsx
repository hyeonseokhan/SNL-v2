import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { CharData } from '@/types/character'

interface TabGemsProps {
  data: CharData
}

const GRADE_BG: Record<string, string> = {
  '전설': 'bg-amber-500/10 border-amber-500/30',
  '유물': 'bg-orange-500/10 border-orange-500/30',
  '영웅': 'bg-purple-500/10 border-purple-500/30',
}

export function TabGems({ data }: TabGemsProps) {
  const { gem } = data

  if (!gem.length) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          장착된 보석이 없습니다.
        </CardContent>
      </Card>
    )
  }

  // 보석 요약 (딜증/쿨감 개수)
  const damageCount = gem.filter((g) => g.type === 'damage').length
  const cooldownCount = gem.filter((g) => g.type === 'cooldown').length

  return (
    <div className="space-y-4">
      {/* --- 보석 요약 --- */}
      <div className="flex gap-3">
        <Badge variant="secondary">겁화 {damageCount}</Badge>
        <Badge variant="secondary">작열 {cooldownCount}</Badge>
        <Badge variant="outline">총 {gem.length}개</Badge>
      </div>

      {/* --- 보석 그리드 --- */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">보석 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {gem.map((g, i) => (
              <div
                key={i}
                className={`rounded-lg border p-3 ${GRADE_BG[g.grade] ?? 'bg-secondary/30 border-border'}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">{g.level}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{g.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {g.type === 'cooldown' ? '작열' : '겁화'}
                    </p>
                  </div>
                </div>
                {g.effect && (
                  <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                    {g.effect}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
