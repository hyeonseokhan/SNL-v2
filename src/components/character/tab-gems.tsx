import type { CharData } from '@/types/character'

interface TabGemsProps {
  data: CharData
}

function gemGradeStyle(grade: string) {
  switch (grade) {
    case '전설': return 'border-amber-500/40 bg-amber-500/10'
    case '유물': return 'border-orange-500/40 bg-orange-500/10'
    case '영웅': return 'border-purple-500/40 bg-purple-500/10'
    default: return 'border-border bg-secondary/30'
  }
}

export function TabGems({ data }: TabGemsProps) {
  const { gem } = data

  if (!gem.length) {
    return (
      <div className="rounded-lg bg-card p-8 text-center text-sm text-muted-foreground">
        장착된 보석이 없습니다.
      </div>
    )
  }

  const damageCount = gem.filter((g) => g.type === 'damage').length
  const cooldownCount = gem.filter((g) => g.type === 'cooldown').length

  return (
    <div className="space-y-4">
      {/* --- 보석 그리드 --- */}
      <div className="rounded-lg bg-card p-4">
        <div className="mb-3 flex items-center gap-3">
          <h3 className="text-sm font-semibold text-primary">보석</h3>
          <div className="flex gap-2 text-xs text-muted-foreground">
            <span>겁화 {damageCount}</span>
            <span>·</span>
            <span>작열 {cooldownCount}</span>
          </div>
        </div>

        {/* KLOA 스타일: 가로 한 줄 그리드 */}
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-11">
          {gem.map((g, i) => (
            <div
              key={i}
              className={`relative flex aspect-square items-center justify-center rounded-lg border ${gemGradeStyle(g.grade)}`}
            >
              <span className="text-base font-bold tabular-nums">{g.level}</span>
              <span className="absolute bottom-0.5 text-[8px] text-muted-foreground">
                {g.type === 'cooldown' ? '작열' : '겁화'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* --- 보석 효과 상세 --- */}
      <div className="rounded-lg bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-primary">보석 효과</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {gem.map((g, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className={`flex size-6 shrink-0 items-center justify-center rounded font-bold ${gemGradeStyle(g.grade)}`}>
                {g.level}
              </span>
              <span className="truncate text-muted-foreground">{g.effect || g.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
