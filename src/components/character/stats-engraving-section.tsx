/**
 * @file 기본 특성 + 전투 특성 + 각인 섹션
 *
 * 좌측: 기본 특성 (공격력, 최대 생명력) + 전투 특성 (6대 스탯)
 * 우측: 각인 목록 (등급 색상 + 레벨 + 이름 + 스톤 레벨)
 */

import Image from 'next/image'
import type { CharStats, EngravingData } from '@/types/character'
import { getEngravingIconUrl } from '@/config/engraving-icons'
import { gradeTextClass, gradeHex } from '@/config/grade-colors'
import { parseColoredText } from '@/lib/parse-colored-text'
import { SectionLabel } from './section-label'

/** 각인 등급별 아이콘 경로 */
const ENGRAVING_GRADE_ICON: Record<string, string> = {
  '유물': '/icons/engraving/grade-relic.png',
  '전설': '/icons/engraving/grade-legendary.png',
  '영웅': '/icons/engraving/grade-epic.png',
}


// ===================================================================
// 메인 컴포넌트
// ===================================================================

/**
 * 특성 + 각인 섹션 Props
 *
 * @property stats - 전투 특성 스탯
 * @property engraving - 각인 목록
 */
interface StatsEngravingSectionProps {
  stats: CharStats
  engraving: EngravingData[]
}

/**
 * 특성 + 각인 섹션 (2열 레이아웃)
 *
 * 좌측: 기본 특성 (공격력, 최대 생명력) + 전투 특성 (6대 스탯 + 합계)
 * 우측: 각인 목록 (등급 색상 × 레벨 + 이름 + 스톤 Lv.)
 *
 * @param stats - 전투 특성 스탯
 * @param engraving - 각인 목록
 *
 * @example
 * <StatsEngravingSection stats={data.stats} engraving={data.engraving} />
 */
export function StatsEngravingSection({ stats, engraving }: StatsEngravingSectionProps) {

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
    <div className="flex gap-x-2">
      {/* ── 좌측: 기본 특성 + 전투 특성 ── */}
      <div className="flex-1 rounded-lg bg-card px-5 py-4 shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">
        <SectionLabel>기본 특성</SectionLabel>
        <div className="space-y-2 pl-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[13px] font-medium text-tx-body">공격력</span>
            <span className="text-[16px] font-bold tabular-nums text-tx-body">{stats.attack.toLocaleString()}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-[13px] font-medium text-tx-body">최대 생명력</span>
            <span className="text-[16px] font-bold tabular-nums text-tx-body">
              {stats.maxHp > 0 ? stats.maxHp.toLocaleString() : '-'}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <SectionLabel right={<span className="text-[11px] tabular-nums text-tx-caption">합계 {total.toLocaleString()}</span>}>전투 특성</SectionLabel>
          <div className="grid grid-cols-3 gap-x-6 gap-y-2.5 pl-3">
            {statEntries.map(({ label, value }) => {
              const isMain = value > 100
              return (
                <div key={label} className="flex items-baseline justify-between gap-2">
                  <span className={`text-[12px] ${isMain ? 'font-medium text-tx-label' : 'text-tx-muted'}`}>
                    {label}
                  </span>
                  <span className={`text-[15px] font-bold tabular-nums ${isMain ? 'text-tx-body' : 'text-tx-muted'}`}>
                    {value.toLocaleString()}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── 우측: 각인 ── */}
      <div className="flex-1 rounded-lg bg-card px-5 py-4 shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">
        <SectionLabel>각인</SectionLabel>
        <div className="space-y-2.5 pl-3">
          {engraving.length > 0 ? engraving.map((eng, i) => {
            const iconUrl = getEngravingIconUrl(eng.name)
            const gradeIcon = ENGRAVING_GRADE_ICON[eng.grade]
            const gradeColor = gradeTextClass(eng.grade)
            const gradeHexColor = gradeHex(eng.grade)
            return (
              <div key={i} className="group/eng relative flex items-center gap-x-2">
                {iconUrl ? (
                  <div className="relative size-7 shrink-0 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                    <Image src={iconUrl} alt={eng.name} fill className="object-cover" sizes="28px" unoptimized />
                  </div>
                ) : (
                  <div className="size-7 shrink-0 rounded-full bg-black/10 dark:bg-white/10" />
                )}
                {gradeIcon && (
                  <img src={gradeIcon} alt={eng.grade} width={13} height={13} className="shrink-0" />
                )}
                <span className={`text-[15px] font-bold tabular-nums ${gradeColor}`}>
                  x {eng.level}
                </span>
                <span className="text-[15px] font-bold text-tx-body">
                  {eng.name}
                </span>
                {eng.stoneLevel > 0 && (
                  <div className="flex items-center gap-0.5">
                    <img src="/icons/engraving/stone-blue.png" alt="stone" width={10} height={14} className="shrink-0" />
                    <span className="text-[13px] font-medium text-[#007AB8] dark:text-[#00B5FF]">
                      Lv.{eng.stoneLevel}
                    </span>
                  </div>
                )}

                {/* 호버 툴팁 */}
                <div className="pointer-events-none absolute bottom-full left-0 z-50 mb-2 overflow-hidden rounded-lg border border-black/[0.08] bg-white opacity-0 shadow-2xl transition-opacity group-hover/eng:opacity-100 dark:border-white/10 dark:bg-[#181b23]"
                  style={{ minWidth: 200, maxWidth: 320 }}
                >
                  <div className="px-3 py-2">
                    <p className="text-[12px] font-bold text-tx-body">
                      {eng.name}{' '}
                      {gradeHexColor && <span style={{ color: gradeHexColor }}>{eng.grade}</span>}
                      {' '}Lv.{eng.level}
                      {eng.stoneLevel > 0 && (
                        <span className="text-[11px] font-medium text-tx-caption"> (+{eng.stoneLevel})</span>
                      )}
                    </p>
                  </div>
                  <div className="border-t border-black/[0.08] dark:border-white/[0.12]" />
                  {eng.description && (
                    <div className="px-3 py-2">
                      <p className="text-[11px] leading-relaxed text-tx-body">
                        {parseColoredText(eng.description)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          }) : (
            <p className="text-[11px] text-tx-muted">각인 없음</p>
          )}
        </div>
      </div>
    </div>
  )
}
