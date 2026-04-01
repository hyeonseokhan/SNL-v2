import { Badge } from '@/components/ui/badge'
import type { CharData } from '@/types/character'

interface TabEquipmentProps {
  data: CharData
}

function gradeClass(grade: string) {
  switch (grade) {
    case '고대': return 'grade-ancient'
    case '유물': return 'grade-relic'
    case '전설': return 'grade-legendary'
    case '영웅': return 'grade-epic'
    case '희귀': return 'grade-rare'
    default: return ''
  }
}

export function TabEquipment({ data }: TabEquipmentProps) {
  const { armory } = data
  const { weapon } = armory.equipment
  const acc = armory.accessory

  const accessories = [
    { label: '목걸이', data: acc.necklace },
    { label: '귀걸이', data: acc.earing1 },
    { label: '귀걸이', data: acc.earing2 },
    { label: '반지', data: acc.ring1 },
    { label: '반지', data: acc.ring2 },
  ]

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* --- 좌측: 무기 + 팔찌 + 특수장비 --- */}
      <div className="space-y-3">
        {/* 무기 */}
        <div className="rounded-lg bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold text-primary">무기</h3>
          {weapon.name ? (
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-secondary text-xs font-bold">
                +{weapon.refine}
              </div>
              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm font-semibold ${gradeClass(weapon.grade)}`}>
                  {weapon.name}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                      style={{ width: `${weapon.quality}px`, maxWidth: '100px' }}
                    />
                    <span className="text-xs tabular-nums text-tx-caption">{weapon.quality}</span>
                  </div>
                  <Badge variant="outline" className={`text-[10px] ${gradeClass(weapon.grade)}`}>
                    {weapon.grade}
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-tx-caption">미장착</p>
          )}
        </div>

        {/* 팔찌 */}
        <div className="rounded-lg bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold text-primary">팔찌</h3>
          {acc.bangle.option.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {acc.bangle.option.map((opt, i) => (
                <span key={i} className="rounded bg-secondary px-2 py-1 text-xs">
                  {opt}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-tx-caption">미장착</p>
          )}
        </div>

        {/* 특수 장비 */}
        <div className="rounded-lg bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold text-primary">특수 장비</h3>
          <div className="space-y-2">
            {[
              { label: '나침반', value: acc.compass.name },
              { label: '부적', value: acc.charm.name },
              { label: '보주', value: acc.orb.name },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-tx-caption">{label}</span>
                <span className={value ? '' : 'text-tx-muted'}>{value || '-'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- 우측: 악세서리 --- */}
      <div className="rounded-lg bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-primary">악세서리</h3>
        <div className="space-y-3">
          {accessories.map(({ label, data: item }, i) => (
            <div key={i} className="flex items-start gap-3 rounded-md bg-secondary/50 p-2.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded bg-secondary text-[10px] font-medium text-tx-caption">
                {label}
              </div>
              <div className="min-w-0 flex-1">
                {item.option.length > 0 ? (
                  <div className="space-y-0.5">
                    {item.option.map((opt, j) => (
                      <p key={j} className="text-xs">{opt}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-tx-muted">미장착</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
