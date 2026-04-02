/**
 * @file 아크패시브 섹션 컴포넌트
 *
 * 진화·깨달음·도약 3열 레이아웃으로 아크패시브 노드를 표시합니다.
 * 각 열: 카테고리 배지 + 포인트 + 랭크/레벨 + 노드 목록 (아이콘 + 티어 + 이름 + Lv)
 */

import Image from 'next/image'
import type { ArkPassiveSection } from '@/types/character'
import { parseColoredText } from '@/lib/parse-colored-text'

// ===================================================================
// 상수
// ===================================================================

/** 아크패시브 카테고리별 스타일 */
const ARK_STYLE = {
  evolution: { label: '진화', bg: 'bg-[#c4a33a]', text: 'text-white', color: '#c4a33a' },
  enlightenment: { label: '깨달음', bg: 'bg-[#3a7ac4]', text: 'text-white', color: '#3a7ac4' },
  leap: { label: '도약', bg: 'bg-[#3ac46a]', text: 'text-white', color: '#3ac46a' },
} as const

// ===================================================================
// 서브 컴포넌트
// ===================================================================

/**
 * 아크패시브 단일 열 (진화 / 깨달음 / 도약)
 *
 * @param sectionKey - 카테고리 키
 * @param section - 해당 카테고리의 아크패시브 데이터
 */
function ArkColumn({
  sectionKey,
  section,
}: {
  sectionKey: keyof typeof ARK_STYLE
  section: ArkPassiveSection
}) {
  const style = ARK_STYLE[sectionKey]

  return (
    <div className="min-w-0 flex-1">
      {/* 헤더: 배지 + 랭크/레벨 + 포인트 pill */}
      <div className="mb-3 flex items-center gap-2">
        <span className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-bold ${style.bg} ${style.text}`}>
          {style.label}
        </span>
        {section.karmaRank > 0 && (
          <span className="text-[15px] font-bold tabular-nums text-tx-title">
            {section.karmaRank}랭크 {section.karmaLevel}레벨
          </span>
        )}
        <span className="rounded-full bg-black/[0.06] px-2 py-0.5 text-[10px] tabular-nums text-tx-caption dark:bg-white/[0.08]">
          {section.points}P
        </span>
      </div>

      {/* 노드 목록 */}
      <div className="space-y-2 border-l-2 border-black/5 pl-2 dark:border-white/10">
        {section.nodes.length > 0 ? section.nodes.map((node, i) => (
          <div key={i} className="group/node relative flex items-center gap-1.5">
            {/* 노드 아이콘 */}
            {node.icon ? (
              <div className="relative size-6 shrink-0 overflow-hidden rounded-md">
                <Image src={node.icon} alt={node.name} fill className="object-contain" sizes="24px" unoptimized />
              </div>
            ) : (
              <div className="size-6 shrink-0 rounded bg-black/10 dark:bg-white/10" />
            )}
            {/* 티어 + 이름 + Lv */}
            <span className="text-[11px] text-tx-caption">{node.tier}티어</span>
            <span className="text-[12px] font-medium text-tx-title">{node.name}</span>
            <span className="text-[11px] tabular-nums text-tx-label">Lv.{node.level}</span>

            {/* 호버 툴팁 */}
            {node.tooltip && (
              <div className="pointer-events-none absolute bottom-full left-0 z-50 mb-2 overflow-hidden rounded-lg border border-black/[0.08] bg-white opacity-0 shadow-2xl transition-opacity group-hover/node:opacity-100 dark:border-white/10 dark:bg-[#181b23]"
                style={{ minWidth: 180, maxWidth: 300 }}
              >
                {/* 상단: 카테고리 + 스킬명 + Lv */}
                <div className="px-3 py-2">
                  <p className="text-[12px] font-bold text-tx-title">
                    {node.name} Lv.{node.level}
                  </p>
                </div>
                {/* 구분선 */}
                <div className="border-t border-black/[0.08] dark:border-white/[0.12]" />
                {/* 하단: 효과 설명 */}
                <div className="px-3 py-2">
                  <p className="text-[11px] leading-relaxed text-tx-body">
                    {parseColoredText(node.tooltip)}
                  </p>
                </div>
              </div>
            )}
          </div>
        )) : (
          <p className="text-[11px] text-tx-muted">데이터 없음</p>
        )}
      </div>
    </div>
  )
}

// ===================================================================
// 메인 컴포넌트
// ===================================================================

/**
 * 아크패시브 섹션
 *
 * 진화·깨달음·도약 3열 그리드로 아크패시브 노드를 표시합니다.
 *
 * @param arkPassive - 아크패시브 전체 데이터 (evolution, enlightenment, leap)
 *
 * @example
 * <ArkPassiveSection arkPassive={data.arkPassive} />
 */
export function ArkPassiveSection({ arkPassive }: {
  arkPassive: { evolution: ArkPassiveSection; enlightenment: ArkPassiveSection; leap: ArkPassiveSection }
}) {
  return (
    <div className="rounded-lg bg-card px-5 py-4 shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">
      <div className="flex gap-4">
        <ArkColumn sectionKey="evolution" section={arkPassive.evolution} />
        <ArkColumn sectionKey="enlightenment" section={arkPassive.enlightenment} />
        <ArkColumn sectionKey="leap" section={arkPassive.leap} />
      </div>
    </div>
  )
}
