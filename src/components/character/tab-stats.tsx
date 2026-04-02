/**
 * @file 능력치 탭 — KLOA 컴포넌트 단위 복제
 */

import type { CharData, ArkPassiveSection, GemData } from '@/types/character'

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
                  <span className="text-[11px] tabular-nums text-tx-caption">{weapon.quality}</span>
                </div>
              </div>
            </div>
          )}

          {/* 팔찌 */}
          {acc.bangle.option.length > 0 && (
            <div className="border-t border-border/30 pt-3">
              <p className="mb-1 text-xs font-medium text-tx-caption">팔찌</p>
              <p className="text-[11px] leading-relaxed text-tx-caption">{acc.bangle.option.join(' ')}</p>
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
                <span className="text-tx-caption">{label}</span>
                <span className="truncate">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 우측: 악세서리 (KLOA: 아이콘 + 이름 + 깨달음+N | 옵션 색상) */}
        <div className="space-y-2.5">
          {accessories.map(({ label, item }, i) => (
            <div key={i} className="flex gap-x-2">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-secondary text-[10px] text-tx-caption">
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
                  <p className="text-tx-muted">-</p>
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

/**
 * 보석 등급별 배경 그라디언트
 *
 * @param grade - 보석 등급 (유물, 전설 등)
 * @returns CSS background 스타일 문자열
 */
function gemBackground(grade: string): string {
  switch (grade) {
    case '유물': return 'linear-gradient(135deg, rgb(52,26,9), rgb(162,64,6))'
    case '전설': return 'linear-gradient(135deg, rgb(40,32,0), rgb(168,138,0))'
    case '영웅': return 'linear-gradient(135deg, rgb(26,8,36), rgb(118,44,188))'
    default:     return 'linear-gradient(135deg, rgb(18,20,26), rgb(45,48,58))'
  }
}

/**
 * 개별 보석 아이콘 + 레벨 배지
 *
 * 마우스 호버 시 보석 이름을 툴팁으로 표시합니다.
 *
 * @param gem - 보석 데이터
 */
function GemIcon({ gem }: { gem: GemData }) {
  return (
    <div className="group/gem relative">
      <div
        className="relative size-10 shrink-0 overflow-hidden rounded-md"
        style={{ background: gemBackground(gem.grade) }}
      >
        <img src={gem.icon} alt={gem.name} className="size-full object-contain" />
        <span className="absolute bottom-0 left-0 rounded-tr bg-black/70 px-1 py-[1px] text-[9px] font-bold leading-none text-white">
          {gem.level}
        </span>
      </div>
      {/* 호버 툴팁 */}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded bg-black/90 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover/gem:opacity-100">
        {gem.name}
      </div>
    </div>
  )
}

/**
 * 보석 섹션
 *
 * KLOA 스타일: 아이콘 일렬 나열 + 하단에 딜증/쿨감 분류 표시.
 * 딜증(겁화) 보석을 먼저, 쿨감(작열) 보석을 나중에 정렬합니다.
 *
 * @param data - 캐릭터 전체 데이터
 */
function GemsSection({ data }: { data: CharData }) {
  const { gem } = data
  if (!gem.length) return null

  const damageGems = gem.filter(g => g.type === 'damage')
  const cooldownGems = gem.filter(g => g.type === 'cooldown')
  const sorted = [...damageGems, ...cooldownGems]

  return (
    <div className="rounded-lg border border-black/[0.06] bg-white px-4 py-3 dark:border-white/[0.06] dark:bg-[#181b23]">
      {/* 보석 아이콘 나열 */}
      <div className="flex items-center justify-center gap-1.5">
        {sorted.map((g, i) => (
          <GemIcon key={i} gem={g} />
        ))}
      </div>

      {/* 딜증 / 쿨감 분류 */}
      <div className="mt-2 flex items-center justify-center">
        <div className="flex items-center gap-6 text-[11px]">
          {damageGems.length > 0 && (
            <span className="text-black/50 dark:text-white/50">
              딜증 <span className="font-medium text-black/80 dark:text-white/80">{damageGems.length}</span>
            </span>
          )}
          {cooldownGems.length > 0 && (
            <span className="text-black/50 dark:text-white/50">
              쿨감 <span className="font-medium text-black/80 dark:text-white/80">{cooldownGems.length}</span>
            </span>
          )}
        </div>
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
            <p className="text-xs text-tx-caption">각인 없음</p>
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
        <span className="text-xs text-tx-caption">합계 {total.toLocaleString()}</span>
      </div>
      <div className="grid grid-cols-6 text-center">
        {statEntries.map(({ label, value }) => {
          const isMain = value > 100
          return (
            <div key={label}>
              <p className="text-xs text-tx-caption">{label}</p>
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
      <div className="text-xs text-tx-caption mb-2">
        | 6랭크
      </div>
      <div className="space-y-1.5">
        {section.nodes.map((node, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {node.icon && (
              <img src={node.icon} alt="" className="size-5 rounded" />
            )}
            <span className="text-xs text-tx-caption">{node.tier}티어</span>
            <span className="text-xs font-medium">{node.name}</span>
            <span className="text-xs text-tx-caption">Lv.{node.level}</span>
          </div>
        ))}
        {section.nodes.length === 0 && (
          <p className="text-xs text-tx-muted">데이터 없음</p>
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
