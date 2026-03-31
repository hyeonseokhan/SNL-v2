/**
 * @file 능력치 탭 — KLOA 스타일 통합 레이아웃
 * 장비 + 보석 + 기본특성 + 각인 + 전투특성 + 아크패시브 + 카드를 한 화면에 표시
 */

import type { CharData, ArkPassiveSection } from '@/types/character'

interface TabStatsProps {
  data: CharData
}

// ===================================================================
// 등급 색상
// ===================================================================

function gradeColor(grade: string) {
  switch (grade) {
    case '고대': return 'text-[#dcc999]'
    case '유물': return 'text-[#fa5d00]'
    case '전설': return 'text-[#f9ae00]'
    case '영웅': return 'text-[#a855f7]'
    case '희귀': return 'text-[#3b82f6]'
    default: return ''
  }
}

function gradeBorder(grade: string) {
  switch (grade) {
    case '고대': return 'border-[#dcc999]/30'
    case '유물': return 'border-[#fa5d00]/30'
    case '전설': return 'border-[#f9ae00]/30'
    case '영웅': return 'border-[#a855f7]/30'
    default: return 'border-border'
  }
}

// ===================================================================
// 섹션 라벨
// ===================================================================

function SectionLabel({ children, color = 'text-primary' }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="mb-3 flex items-center">
      <span className={`rounded-md border border-current/20 px-2.5 py-1 text-xs font-semibold ${color}`}>
        {children}
      </span>
    </div>
  )
}

// ===================================================================
// 장비 섹션
// ===================================================================

function EquipmentSection({ data }: { data: CharData }) {
  const { weapon } = data.armory.equipment
  const acc = data.armory.accessory

  const accessories = [
    { label: '목걸이', item: acc.necklace },
    { label: '귀걸이', item: acc.earing1 },
    { label: '귀걸이', item: acc.earing2 },
    { label: '반지', item: acc.ring1 },
    { label: '반지', item: acc.ring2 },
  ]

  return (
    <div className="rounded-lg bg-card p-4">
      <div className="grid grid-cols-2 gap-x-4">
        {/* 좌측: 무기 (간략) */}
        <div className="space-y-2">
          {weapon.name && (
            <div className="flex items-center gap-2 text-sm">
              <span className="flex size-8 items-center justify-center rounded bg-secondary text-xs font-bold">
                +{weapon.refine}
              </span>
              <div className="min-w-0">
                <p className={`truncate text-xs font-medium ${gradeColor(weapon.grade)}`}>{weapon.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="h-1 w-16 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                      style={{ width: `${weapon.quality}%` }}
                    />
                  </div>
                  <span className="text-[10px] tabular-nums text-muted-foreground">{weapon.quality}</span>
                </div>
              </div>
            </div>
          )}

          {/* 팔찌 */}
          {acc.bangle.option.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/30">
              <p className="text-[10px] font-medium text-muted-foreground mb-1">팔찌</p>
              <div className="flex flex-wrap gap-1">
                {acc.bangle.option.map((opt, i) => (
                  <span key={i} className="text-[11px] text-muted-foreground">{opt}</span>
                ))}
              </div>
            </div>
          )}

          {/* 특수 장비 */}
          <div className="mt-2 space-y-0.5 text-[11px]">
            {[
              { label: '나침반', value: acc.compass.name },
              { label: '부적', value: acc.charm.name },
              { label: '보주', value: acc.orb.name },
            ].filter(x => x.value).map(({ label, value }) => (
              <div key={label} className="flex gap-2">
                <span className="text-muted-foreground/60">{label}</span>
                <span className="truncate">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 우측: 악세서리 */}
        <div className="space-y-2">
          {accessories.map(({ label, item }, i) => (
            <div key={i} className="flex gap-2 text-[11px]">
              <span className="w-7 shrink-0 text-muted-foreground/60">{label}</span>
              <div className="min-w-0 flex-1">
                {item.option.length > 0 ? (
                  item.option.map((opt, j) => (
                    <p key={j} className="truncate">{opt}</p>
                  ))
                ) : (
                  <p className="text-muted-foreground/30">-</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ===================================================================
// 보석 섹션
// ===================================================================

function GemsSection({ data }: { data: CharData }) {
  const { gem } = data
  if (!gem.length) return null

  const damageCount = gem.filter(g => g.type === 'damage').length
  const cooldownCount = gem.filter(g => g.type === 'cooldown').length

  return (
    <div className="rounded-lg bg-card p-4">
      <div className="flex items-center justify-center gap-2">
        {gem.map((g, i) => (
          <div
            key={i}
            className={`relative flex size-10 items-center justify-center rounded-md border ${gradeBorder(g.grade)} bg-secondary/50`}
          >
            <span className="text-sm font-bold tabular-nums">{g.level}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span>겁화 {damageCount}</span>
        <span>작열 {cooldownCount}</span>
      </div>
    </div>
  )
}

// ===================================================================
// 기본 특성 + 각인 섹션
// ===================================================================

function StatsAndEngravingSection({ data }: { data: CharData }) {
  const { stats, engraving } = data

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* 기본 특성 */}
      <div className="rounded-lg bg-card p-4">
        <SectionLabel>기본 특성</SectionLabel>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">공격력</span>
            <span className="font-bold tabular-nums">{stats.attack.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">최대 생명력</span>
            <span className="font-bold tabular-nums">-</span>
          </div>
        </div>
      </div>

      {/* 각인 */}
      <div className="rounded-lg bg-card p-4">
        <SectionLabel>각인</SectionLabel>
        <div className="space-y-2">
          {engraving.length > 0 ? engraving.map((eng, i) => (
            <div key={i} className="flex items-center gap-2">
              {eng.icon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={eng.icon} alt="" className="size-6 rounded" />
              )}
              <span className="text-sm">
                <span className="font-medium">x {eng.level}</span>{' '}
                <span>{eng.name}</span>
              </span>
            </div>
          )) : (
            <p className="text-xs text-muted-foreground">각인 없음</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ===================================================================
// 전투 특성 섹션
// ===================================================================

function CombatStatsSection({ data }: { data: CharData }) {
  const { stats } = data
  const statEntries = [
    { label: '치명', value: stats.critical },
    { label: '특화', value: stats.special },
    { label: '신속', value: stats.haste },
    { label: '제압', value: stats.suppress },
    { label: '인내', value: stats.patience },
    { label: '숙련', value: stats.expert },
  ]
  const total = statEntries.reduce((s, e) => s + e.value, 0)

  return (
    <div className="rounded-lg bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <SectionLabel>전투 특성</SectionLabel>
        <span className="text-xs text-muted-foreground">합계 {total.toLocaleString()}</span>
      </div>
      <div className="grid grid-cols-6 text-center">
        {statEntries.map(({ label, value }) => {
          const isMain = value > 100
          return (
            <div key={label}>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className={`mt-0.5 text-base font-bold tabular-nums ${isMain ? 'text-foreground' : 'text-muted-foreground/30'}`}>
                {value.toLocaleString()}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ===================================================================
// 아크패시브 섹션
// ===================================================================

const ARK_PASSIVE_COLORS = {
  evolution: { label: '진화', badge: 'bg-red-500/20 text-red-400 border-red-500/30' },
  enlightenment: { label: '깨달음', badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  leap: { label: '도약', badge: 'bg-green-500/20 text-green-400 border-green-500/30' },
} as const

function ArkPassiveColumn({
  sectionKey,
  section,
}: {
  sectionKey: keyof typeof ARK_PASSIVE_COLORS
  section: ArkPassiveSection
}) {
  const { label, badge } = ARK_PASSIVE_COLORS[sectionKey]

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${badge}`}>
          {label}
        </span>
        <span className="text-xs font-bold tabular-nums">{section.points} 포인트</span>
      </div>
      <div className="space-y-1">
        {section.nodes.map((node, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[11px]">
            {node.icon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={node.icon} alt="" className="size-5 rounded" />
            )}
            <span className="text-muted-foreground">{node.tier}티어</span>
            <span className="font-medium">{node.name}</span>
            <span className="text-muted-foreground">Lv.{node.level}</span>
          </div>
        ))}
        {section.nodes.length === 0 && (
          <p className="text-[11px] text-muted-foreground/40">데이터 없음</p>
        )}
      </div>
    </div>
  )
}

function ArkPassiveSection2({ data }: { data: CharData }) {
  const { arkPassive } = data

  return (
    <div className="rounded-lg bg-card p-4">
      <div className="grid grid-cols-3 gap-4">
        <ArkPassiveColumn sectionKey="evolution" section={arkPassive.evolution} />
        <ArkPassiveColumn sectionKey="enlightenment" section={arkPassive.enlightenment} />
        <ArkPassiveColumn sectionKey="leap" section={arkPassive.leap} />
      </div>
    </div>
  )
}

// ===================================================================
// 카드 섹션
// ===================================================================

function CardSection({ data }: { data: CharData }) {
  if (!data.card) return null

  return (
    <div className="rounded-lg bg-card p-4">
      <SectionLabel>카드</SectionLabel>
      <p className="text-sm font-medium">{data.card}</p>
    </div>
  )
}

// ===================================================================
// 메인 컴포넌트
// ===================================================================

export function TabStats({ data }: TabStatsProps) {
  return (
    <div className="space-y-3">
      <EquipmentSection data={data} />
      <GemsSection data={data} />
      <StatsAndEngravingSection data={data} />
      <CombatStatsSection data={data} />
      <ArkPassiveSection2 data={data} />
      <CardSection data={data} />
    </div>
  )
}
