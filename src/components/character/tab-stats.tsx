import type { CharData } from '@/types/character'

interface TabStatsProps {
  data: CharData
}

const STAT_LABELS: Record<string, string> = {
  critical: '치명',
  haste: '신속',
  special: '특화',
  suppress: '제압',
  patience: '인내',
  expert: '숙련',
}

export function TabStats({ data }: TabStatsProps) {
  const { stats } = data

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* --- 기본 특성 --- */}
      <div className="rounded-lg bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-primary">기본 특성</h3>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">공격력</span>
            <div className="text-right">
              <span className="text-base font-bold tabular-nums">{stats.attack.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">최대 생명력</span>
            <span className="text-base font-bold tabular-nums">-</span>
          </div>
        </div>
      </div>

      {/* --- 각인 미리보기 --- */}
      <div className="rounded-lg bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-primary">각인</h3>
        {data.engraving.length > 0 ? (
          <div className="space-y-2">
            {data.engraving.slice(0, 5).map((eng, i) => (
              <div key={i} className="flex items-center gap-2.5">
                {eng.icon && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={eng.icon} alt="" className="size-7 rounded-md" />
                )}
                <span className="text-sm">
                  x {eng.level} {eng.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">적용된 각인 없음</p>
        )}
      </div>

      {/* --- 전투 특성 --- */}
      <div className="rounded-lg bg-card p-4 lg:col-span-2">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-primary">전투 특성</h3>
          <span className="text-xs text-muted-foreground">
            합계 {Object.entries(STAT_LABELS).reduce((sum, [key]) => sum + (stats[key as keyof typeof stats] ?? 0), 0).toLocaleString()}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {Object.entries(STAT_LABELS).map(([key, label]) => {
            const value = stats[key as keyof typeof stats] ?? 0
            const isMain = value > 100
            return (
              <div key={key} className="text-center">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={`mt-0.5 text-lg font-bold tabular-nums ${isMain ? 'text-foreground' : 'text-muted-foreground/40'}`}>
                  {value.toLocaleString()}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
