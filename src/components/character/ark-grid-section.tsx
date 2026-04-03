/**
 * @file 아크그리드 섹션 — 코어 + 젬 효과
 *
 * 좌측: 코어 슬롯 목록 (아이콘 + 이름 + 포인트)
 * 우측: 젬 효과 목록 (이름 + 레벨 + 수치)
 */

import Image from 'next/image'
import type { ArkGridData } from '@/types/character'
import { gradeTextClass } from '@/config/grade-colors'
import { parseColoredText } from '@/lib/parse-colored-text'
import { SectionLabel } from './section-label'

/**
 * 코어 옵션 HTML을 줄 단위로 분리하여 색상 적용된 React 노드로 변환합니다.
 *
 * @param html - `<br>` 구분, FONT COLOR 태그 포함 HTML
 * @returns React 노드 배열 (줄바꿈 포함)
 */
function parseCoreOptions(html: string): React.ReactNode[] {
  if (!html) return []
  const lines = html.split(/<br\s*\/?>/gi)
  return lines.map((line, i) => (
    <p key={i} className="text-[11px] leading-relaxed text-tx-body">
      {parseColoredText(line)}
    </p>
  ))
}

/** 코어 등급별 배지 배경색 (등급 텍스트 색상은 gradeTextClass 사용) */
const CORE_BADGE: Record<string, string> = {
  '고대': 'bg-[#dcc999]/20 text-[#dcc999]',
  '유물': 'bg-[#FA5D00]/20 text-[#FA5D00]',
  '전설': 'bg-[#F9AE00]/20 text-[#F9AE00]',
  '영웅': 'bg-purple-400/20 text-purple-400',
}

// ===================================================================
// 메인 컴포넌트
// ===================================================================

/**
 * 아크그리드 섹션 (코어 + 젬 효과 2열)
 *
 * @param arkGrid - 아크그리드 데이터 (slots + effects)
 *
 * @example
 * <ArkGridSection arkGrid={data.arkGrid} />
 */
export function ArkGridSection({ arkGrid }: { arkGrid: ArkGridData }) {
  const { slots, effects } = arkGrid
  if (slots.length === 0 && effects.length === 0) return null

  return (
    <div className="flex gap-x-2">
      {/* ── 좌측: 코어 ── */}
      <div className="flex-1 rounded-lg bg-card px-5 py-4 shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">
        <SectionLabel>코어</SectionLabel>
        <div className="space-y-2.5 pl-3">
          {slots.length > 0 ? slots.map((slot, i) => (
            <div key={i} className="group/core relative flex items-center gap-2">
              {slot.icon ? (
                <div className="relative size-7 shrink-0 overflow-hidden rounded-md">
                  <Image src={slot.icon} alt={slot.name} fill className="object-contain" sizes="28px" unoptimized />
                </div>
              ) : (
                <div className="size-7 shrink-0 rounded-md bg-black/10 dark:bg-white/10" />
              )}
              <span className={`text-[12px] font-medium ${gradeTextClass(slot.grade)}`}>
                {slot.name}
              </span>
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${CORE_BADGE[slot.grade] ?? 'bg-white/[0.08] text-tx-caption'}`}>
                {slot.point}P
              </span>

              {/* 호버 툴팁 */}
              <div className="pointer-events-none absolute bottom-full left-0 z-50 mb-2 overflow-hidden rounded-lg border border-black/[0.08] bg-white opacity-0 shadow-2xl transition-opacity group-hover/core:opacity-100 dark:border-white/10 dark:bg-[#181b23]"
                style={{ minWidth: 240, maxWidth: 340 }}
              >
                <div className="px-3 py-2">
                  <p className={`text-[13px] font-bold ${gradeTextClass(slot.grade)}`}>
                    {slot.name}
                  </p>
                </div>
                <div className="border-t border-black/[0.08] dark:border-white/[0.12]" />
                <div className="space-y-1 px-3 py-2">
                  <p className="text-[11px] text-tx-label">
                    {slot.grade} 아크 그리드 코어
                  </p>
                  {slot.coreType && (
                    <p className="text-[11px] text-tx-label">
                      {slot.coreType} | 의지력 {parseColoredText(slot.coreWillpower)}
                    </p>
                  )}
                </div>
                {slot.coreOptions && (
                  <>
                    <div className="border-t border-black/[0.08] dark:border-white/[0.12]" />
                    <div className="px-3 py-2">
                      {parseCoreOptions(slot.coreOptions)}
                    </div>
                  </>
                )}
              </div>
            </div>
          )) : (
            <p className="text-[11px] text-tx-muted">데이터 없음</p>
          )}
        </div>
      </div>

      {/* ── 우측: 젬 효과 ── */}
      <div className="flex-1 rounded-lg bg-card px-5 py-4 shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">
        <SectionLabel>젬 효과</SectionLabel>
        <div className="space-y-2.5 pl-3">
          {effects.length > 0 ? effects.map((eff, i) => (
            <div key={i}>
              <p className="text-[13px] font-bold text-tx-body">
                {eff.name} <span className="text-[11px] font-medium text-tx-label">Lv.{eff.level}</span>
              </p>
              <p className="text-[11px] text-tx-label">
                <span className="text-tx-caption">└</span> {parseColoredText(eff.description)}
              </p>
            </div>
          )) : (
            <p className="text-[11px] text-tx-muted">데이터 없음</p>
          )}
        </div>
      </div>
    </div>
  )
}
