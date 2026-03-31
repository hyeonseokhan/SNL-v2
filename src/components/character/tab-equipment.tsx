import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { CharData } from '@/types/character'

interface TabEquipmentProps {
  data: CharData
}

const GRADE_COLORS: Record<string, string> = {
  '고대': 'text-amber-400',
  '유물': 'text-orange-400',
  '전설': 'text-yellow-400',
  '영웅': 'text-purple-400',
  '희귀': 'text-blue-400',
}

export function TabEquipment({ data }: TabEquipmentProps) {
  const { armory } = data
  const { weapon } = armory.equipment
  const acc = armory.accessory

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* --- 무기 --- */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">무기</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${GRADE_COLORS[weapon.grade] ?? ''}`}>
                {weapon.name || '미장착'}
              </span>
            </div>
            {weapon.name && (
              <div className="flex gap-3 text-sm text-muted-foreground">
                <span>품질 {weapon.quality}</span>
                <span>강화 +{weapon.refine}</span>
                <Badge variant="outline" className="text-xs">{weapon.grade}</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* --- 악세서리 --- */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">악세서리</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: '목걸이', data: acc.necklace },
              { label: '귀걸이 1', data: acc.earing1 },
              { label: '귀걸이 2', data: acc.earing2 },
              { label: '반지 1', data: acc.ring1 },
              { label: '반지 2', data: acc.ring2 },
            ].map(({ label, data: item }) => (
              <div key={label}>
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
                {item.option.length > 0 ? (
                  <div className="mt-0.5 flex flex-wrap gap-1.5">
                    {item.option.map((opt, i) => (
                      <Badge key={i} variant="secondary" className="text-xs font-normal">
                        {opt}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="mt-0.5 text-xs text-muted-foreground/60">미장착</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* --- 팔찌 --- */}
      {acc.bangle.option.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">팔찌</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {acc.bangle.option.map((opt, i) => (
                <Badge key={i} variant="secondary" className="text-xs font-normal">
                  {opt}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- 특수 장비 --- */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">특수 장비</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {[
              { label: '나침반', value: acc.compass.name },
              { label: '부적', value: acc.charm.name },
              { label: '보주', value: acc.orb.name },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-muted-foreground">{label}</span>
                <span className={value ? '' : 'text-muted-foreground/60'}>
                  {value || '미장착'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
