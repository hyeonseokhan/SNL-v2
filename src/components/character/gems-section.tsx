/**
 * @file 보석 섹션 컴포넌트
 *
 * KLOA 스타일 보석 표시: 좌측에 아이콘 나열 + 그룹 안내선,
 * 우측에 추가 효과(기본 공격력) 합산 표시.
 * 장비 컴포넌트 하단에 배치됩니다.
 */

import Image from 'next/image'
import type { GemData } from '@/types/character'

// ===================================================================
// 헬퍼
// ===================================================================

/**
 * 보석 등급별 배경 그라디언트
 *
 * 장비 아이콘과 동일한 등급 색상 체계를 사용합니다.
 *
 * @param grade - 보석 등급 (유물, 전설, 영웅 등)
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
 * 보석 option 필드에서 퍼센트 수치를 추출합니다.
 *
 * @param option - "기본 공격력 1.00% 증가" 형태의 문자열
 * @returns 추출된 퍼센트 수치 (없으면 0)
 *
 * @example
 * extractOptionPercent("기본 공격력 1.00% 증가") // → 1.0
 * extractOptionPercent("기본 공격력 0.80% 증가") // → 0.8
 */
function extractOptionPercent(option: string | undefined): number {
  if (!option) return 0
  const match = option.match(/([\d.]+)%/)
  return match ? parseFloat(match[1]) : 0
}

// ===================================================================
// 서브 컴포넌트
// ===================================================================

/**
 * 개별 보석 아이콘
 *
 * 등급 그라디언트 배경 위에 보석 이미지를 표시하고,
 * 좌상단에 레벨 배지를 렌더링합니다 (장비 티어 배지와 동일 스타일).
 * 마우스 호버 시 스킬명 + 효과 툴팁이 표시됩니다.
 *
 * @param gem - 보석 데이터
 */
function GemIcon({ gem }: { gem: GemData }) {
  return (
    <div className="group/gem relative">
      <div
        className="relative overflow-hidden rounded-sm"
        style={{ background: gemBackground(gem.grade), width: 36, height: 36 }}
      >
        <Image
          src={gem.icon}
          alt={gem.name}
          fill
          className="object-contain"
          sizes="36px"
          unoptimized
        />
        {/* 레벨 배지 — 장비 TierBadge와 동일한 좌상단 스타일 */}
        <span className="absolute left-0 top-0 z-10 rounded-br rounded-tl-sm bg-black px-[3px] py-[1px] text-[9px] font-bold leading-none text-white">
          {gem.level}
        </span>
      </div>
      {/* 호버 툴팁 — 장비 툴팁과 동일 스타일 */}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 overflow-hidden rounded-lg border border-black/[0.08] bg-white opacity-0 shadow-2xl transition-opacity group-hover/gem:opacity-100 dark:border-white/10 dark:bg-[#181b23]"
        style={{ minWidth: 140 }}
      >
        {/* 상단: 스킬명 */}
        <div className="px-3 py-1.5">
          <p className="whitespace-nowrap text-[11px] font-semibold text-black/80 dark:text-white">
            {gem.skillName || gem.name}
          </p>
        </div>
        {/* 구분선 */}
        <div className="border-t border-black/[0.08] dark:border-white/[0.12]" />
        {/* 하단: 효과 */}
        <div className="px-3 py-1.5">
          <p className="whitespace-nowrap text-[10px] text-black/60 dark:text-white/60">
            {gem.effect || gem.name}
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * 딜증/쿨감 그룹 안내선
 *
 * KLOA 스타일 ㄴ자 브래킷으로 보석 그룹을 시각적으로 구분합니다.
 *
 * @param label - 그룹 이름 (딜증 / 쿨감)
 * @param count - 보석 개수
 * @param gemCount - 해당 그룹의 보석 수 (안내선 너비 계산용)
 */
function GroupBracket({ label, count, gemCount }: { label: string; count: number; gemCount: number }) {
  if (count === 0) return null
  const GEM_SIZE = 36
  const GEM_GAP = 8
  return (
    <div className="flex w-full items-center" style={{ width: gemCount * GEM_SIZE + (gemCount - 1) * GEM_GAP }}>
      <div className="h-px flex-1 bg-black/30 dark:bg-white/30" />
      <span className="shrink-0 px-1.5 text-[10px] text-black/80 dark:text-white/80">
        {label} {count}
      </span>
      <div className="h-px flex-1 bg-black/30 dark:bg-white/30" />
    </div>
  )
}

// ===================================================================
// 메인 컴포넌트
// ===================================================================

/**
 * 보석 섹션 Props
 *
 * @property gems - 보석 데이터 배열
 */
interface GemsSectionProps {
  gems: GemData[]
}

/**
 * 보석 섹션
 *
 * 좌측: 보석 아이콘 일렬 나열 + 딜증/쿨감 그룹 안내선
 * 우측: 추가 효과(기본 공격력) 합산 표시
 *
 * @param gems - 보석 데이터 배열
 *
 * @example
 * <GemsSection gems={data.gem} />
 */
export function GemsSection({ gems }: GemsSectionProps) {
  if (!gems.length) return null

  const gemSort = (a: GemData, b: GemData) =>
    b.level - a.level || (a.skillName ?? '').localeCompare(b.skillName ?? '')
  const damageGems = gems.filter(g => g.type === 'damage').sort(gemSort)
  const cooldownGems = gems.filter(g => g.type === 'cooldown').sort(gemSort)

  // 추가 효과 합산 (option 필드의 퍼센트 수치)
  const totalOptionPercent = gems.reduce((sum, g) => sum + extractOptionPercent(g.option), 0)

  return (
    <div className="rounded-lg bg-card p-3 shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">
      <div className="flex items-start gap-4">
        {/* 좌측: 보석 아이콘 (그룹별) + 안내선 — 내용 크기만큼만 차지 */}
        <div className="shrink-0">
          {/* 보석 아이콘 — 딜증/쿨감 그룹별 렌더링, 그룹 간 12px 간격 */}
          <div className="flex items-center gap-3">
            {/* 딜증 그룹 */}
            {damageGems.length > 0 && (
              <div className="flex items-center" style={{ gap: 8 }}>
                {damageGems.map((g, i) => <GemIcon key={`d${i}`} gem={g} />)}
              </div>
            )}
            {/* 쿨감 그룹 */}
            {cooldownGems.length > 0 && (
              <div className="flex items-center" style={{ gap: 8 }}>
                {cooldownGems.map((g, i) => <GemIcon key={`c${i}`} gem={g} />)}
              </div>
            )}
          </div>

          {/* 그룹 안내선 */}
          <div className="mt-1.5 flex items-start gap-3">
            <GroupBracket label="딜증" count={damageGems.length} gemCount={damageGems.length} />
            <GroupBracket label="쿨감" count={cooldownGems.length} gemCount={cooldownGems.length} />
          </div>
        </div>

        {/* 우측: 추가 효과 합산 — 남은 공간 차지 */}
        {totalOptionPercent > 0 && (
          <div className="min-w-0 flex-1 rounded-lg bg-black/[0.03] px-4 py-2.5 dark:bg-white/[0.04]">
            <p className="text-[10px] text-black/40 dark:text-white/40">추가 효과</p>
            <p className="mt-1 text-[13px] font-semibold text-black/80 dark:text-white/80">
              기본 공격력 <span className="text-[#4CAF50] dark:text-[#73DC04]">+{totalOptionPercent.toFixed(2)}%</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
