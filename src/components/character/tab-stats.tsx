/**
 * @file 능력치 탭 — KLOA 컴포넌트 단위 복제
 */

import type { CharData, ArkPassiveSection } from '@/types/character'

interface TabStatsProps {
  data: CharData
}

// ===================================================================
// 섹션 라벨 (KLOA: 보라색 텍스트, 밑줄, font-semibold 14px)
// ===================================================================

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 inline-flex items-center border-b-2 border-primary pb-1">
      <span className="text-sm font-semibold text-primary">{children}</span>
    </div>
  )
}

// ===================================================================
// 장비 섹션 (KLOA: 2열 그리드, 좌=방어구 우=악세서리+옵션)
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
    <div className="rounded-lg bg-card px-[17px] py-4 shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">
      <div className="grid grid-cols-2 gap-x-2">
        {/* 좌측: 무기 */}
        <div className="space-y-3">
          {weapon.name && (
            <div className="flex items-center gap-x-2">
              <div className="relative size-11 shrink-0 overflow-hidden rounded-md bg-grade-ancient">
                <span className="flex size-full items-center justify-center text-xs font-bold text-[#dcc999]">+{weapon.refine}</span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{weapon.name}</p>
                <div className="flex items-center gap-1">
                  <div className="h-1 w-12 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${weapon.quality}%` }} />
                  </div>
                  <span className="text-[11px] tabular-nums text-muted-foreground">{weapon.quality}</span>
                </div>
              </div>
            </div>
          )}

          {/* 팔찌 */}
          {acc.bangle.option.length > 0 && (
            <div className="border-t border-border/30 pt-3">
              <p className="mb-1 text-xs font-medium text-muted-foreground">팔찌</p>
              <p className="text-[11px] leading-relaxed text-muted-foreground">{acc.bangle.option.join(' ')}</p>
            </div>
          )}

          {/* 특수 장비 */}
          <div className="space-y-1 text-[11px]">
            {[
              { label: '나침반', value: acc.compass.name },
              { label: '부적', value: acc.charm.name },
              { label: '보주', value: acc.orb.name },
            ].filter(x => x.value).map(({ label, value }) => (
              <div key={label} className="flex gap-2">
                <span className="text-muted-foreground">{label}</span>
                <span className="truncate">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 우측: 악세서리 (KLOA: 아이콘 + 이름 + 깨달음+N | 옵션 색상) */}
        <div className="space-y-2.5">
          {accessories.map(({ label, item }, i) => (
            <div key={i} className="flex gap-x-2">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-secondary text-[10px] text-muted-foreground">
                {label}
              </div>
              <div className="min-w-0 flex-1 text-[11px] leading-relaxed">
                {item.option.length > 0 ? (
                  item.option.map((opt, j) => {
                    // KLOA 스타일: 증가 옵션은 초록, 감소 옵션은 빨강
                    const isPositive = opt.includes('+')
                    return (
                      <p key={j} className={isPositive ? 'text-emerald-400' : ''}>
                        {opt}
                      </p>
                    )
                  })
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
// 보석 섹션 (KLOA: 가로 한 줄, 아이콘 44px, 라운드 6px, 하단 겁화N 작열N)
// ===================================================================

function GemsSection({ data }: { data: CharData }) {
  const { gem } = data
  if (!gem.length) return null

  const damageCount = gem.filter(g => g.type === 'damage').length
  const cooldownCount = gem.filter(g => g.type === 'cooldown').length

  return (
    <div className="rounded-lg bg-card px-[17px] pt-4 pb-2 shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">
      <div className="flex items-center justify-center gap-x-2">
        {gem.map((g, i) => {
          const bgClass = g.grade === '전설' ? 'bg-grade-legendary' : g.grade === '유물' ? 'bg-grade-relic' : 'bg-secondary'
          return (
            <div key={i} className={`relative flex size-11 items-center justify-center rounded-md ${bgClass}`}>
              <span className="text-sm font-bold tabular-nums">{g.level}</span>
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex items-center justify-center gap-x-6 pb-2 text-xs text-muted-foreground">
        <span>겁화 {damageCount}</span>
        <span>작열 {cooldownCount}</span>
      </div>
    </div>
  )
}

// ===================================================================
// 기본 특성 + 각인 (KLOA: 2열, flex gap-x-6)
// ===================================================================

function StatsAndEngravingSection({ data }: { data: CharData }) {
  const { stats, engraving } = data

  return (
    <div className="flex gap-x-4">
      {/* 기본 특성 (KLOA: 공격력 → 기본/효과 하위, 최대 생명력) */}
      <div className="flex-1 rounded-lg bg-card px-[17px] py-4 shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">
        <SectionLabel>기본 특성</SectionLabel>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">공격력</span>
            <span className="text-base font-medium tabular-nums">{stats.attack.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">최대 생명력</span>
            <span className="text-base font-medium tabular-nums">-</span>
          </div>
        </div>
      </div>

      {/* 각인 (KLOA: 아이콘 31px 원형 + 각인 레벨 표시) */}
      <div className="flex-1 rounded-lg bg-card px-[17px] py-4 shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">
        <SectionLabel>각인</SectionLabel>
        <div className="space-y-3">
          {engraving.length > 0 ? engraving.map((eng, i) => (
            <div key={i} className="flex items-center gap-x-2.5">
              {eng.icon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={eng.icon} alt="" className="size-8 rounded-full" />
              )}
              <span className="text-sm">
                <span className="text-primary">✦</span>{' '}
                x {eng.level} {eng.name}
              </span>
              {eng.level > 0 && (
                <span className="ml-auto flex items-center gap-1 text-xs text-blue-400">
                  <span>💧</span> Lv.{eng.level}
                </span>
              )}
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
// 전투 특성 (KLOA: 라벨 + 합계 + 6열 가로 숫자, 메인스탯은 밝은 보라)
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
    <div className="rounded-lg bg-card px-[17px] py-4 shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">
      <div className="mb-3 flex items-center justify-between">
        <SectionLabel>전투 특성</SectionLabel>
        <span className="text-xs text-muted-foreground">합계 {total.toLocaleString()}</span>
      </div>
      <div className="grid grid-cols-6 text-center">
        {statEntries.map(({ label, value }) => {
          const isMain = value > 100
          return (
            <div key={label}>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className={`mt-1 text-base font-medium tabular-nums ${isMain ? 'text-stat-value' : 'text-stat-muted'}`}>
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
// 아크패시브 (KLOA: 3열, 뱃지 색상, 아이콘+티어+이름+Lv)
// ===================================================================

const ARK_COLORS = {
  evolution: { label: '진화', bg: 'bg-[#c4a33a]', text: 'text-white' },
  enlightenment: { label: '깨달음', bg: 'bg-[#3a7ac4]', text: 'text-white' },
  leap: { label: '도약', bg: 'bg-[#3ac46a]', text: 'text-white' },
} as const

function ArkPassiveColumn({
  sectionKey,
  section,
}: {
  sectionKey: keyof typeof ARK_COLORS
  section: ArkPassiveSection
}) {
  const { label, bg, text } = ARK_COLORS[sectionKey]

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className={`rounded px-3 py-0.5 text-sm font-semibold ${bg} ${text}`}>
          {label}
        </span>
        <span className="text-sm font-bold tabular-nums">{section.points} 포인트</span>
      </div>
      <div className="text-xs text-muted-foreground mb-2">
        | 6랭크
      </div>
      <div className="space-y-1.5">
        {section.nodes.map((node, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {node.icon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={node.icon} alt="" className="size-5 rounded" />
            )}
            <span className="text-xs text-muted-foreground">{node.tier}티어</span>
            <span className="text-xs font-medium">{node.name}</span>
            <span className="text-xs text-muted-foreground">Lv.{node.level}</span>
          </div>
        ))}
        {section.nodes.length === 0 && (
          <p className="text-xs text-muted-foreground/40">데이터 없음</p>
        )}
      </div>
    </div>
  )
}

function ArkPassiveBlock({ data }: { data: CharData }) {
  const { arkPassive } = data

  return (
    <div className="rounded-lg bg-card px-[17px] py-4 shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">
      <div className="grid grid-cols-3 gap-x-4">
        <ArkPassiveColumn sectionKey="evolution" section={arkPassive.evolution} />
        <ArkPassiveColumn sectionKey="enlightenment" section={arkPassive.enlightenment} />
        <ArkPassiveColumn sectionKey="leap" section={arkPassive.leap} />
      </div>
    </div>
  )
}

// ===================================================================
// 카드 (KLOA: 하단, 라벨 + 카드 세트명)
// ===================================================================

function CardSection({ data }: { data: CharData }) {
  if (!data.card) return null

  return (
    <div className="rounded-lg bg-card px-[17px] py-4 shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">
      <SectionLabel>카드</SectionLabel>
      <p className="text-sm font-medium">{data.card}</p>
    </div>
  )
}

// ===================================================================
// 메인 (KLOA: 섹션 간격 space-y-5)
// ===================================================================

export function TabStats({ data }: TabStatsProps) {
  return (
    <div className="space-y-4">
      <EquipmentSection data={data} />
      <GemsSection data={data} />
      <StatsAndEngravingSection data={data} />
      <CombatStatsSection data={data} />
      <ArkPassiveBlock data={data} />
      <CardSection data={data} />
    </div>
  )
}
