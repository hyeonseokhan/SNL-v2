import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className="grid gap-4 sm:grid-cols-2">
      {/* --- 전투 특성 --- */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">전투 특성</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(STAT_LABELS).map(([key, label]) => {
              const value = stats[key as keyof typeof stats] ?? 0
              return (
                <div key={key} className="flex items-center justify-between rounded-md bg-secondary/50 px-3 py-2">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="text-sm font-semibold">{value.toLocaleString()}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* --- 기본 특성 --- */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">기본 특성</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-md bg-secondary/50 px-3 py-2">
            <span className="text-sm text-muted-foreground">공격력</span>
            <span className="text-sm font-semibold">{stats.attack.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between rounded-md bg-secondary/50 px-3 py-2">
            <span className="text-sm text-muted-foreground">전투력</span>
            <span className="text-sm font-semibold">{stats.combatPower.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
