/**
 * @file 기본 특성 + 전투 특성 + 각인 섹션
 *
 * 좌측: 기본 특성 (공격력, 최대 생명력) + 전투 특성 (6대 스탯)
 * 우측: 각인 목록 (등급 색상 + 레벨 + 이름 + 스톤 레벨)
 */

import type { CharData } from '@/types/character'

// ===================================================================
// 헬퍼
// ===================================================================

/**
 * 섹션 라벨 — pill 배지 + 가로선 + 우측 보조 텍스트
 *
 * @param children - 라벨 텍스트
 * @param right - 우측 보조 정보 (예: "합계 2810")
 */
function SectionLabel({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="shrink-0 rounded-full bg-primary/15 px-3 py-1 text-[12px] font-bold text-primary">
        {children}
      </span>
      <div className="h-px flex-1 bg-black/10 dark:bg-white/15" />
      {right && (
        <span className="shrink-0 text-[11px] tabular-nums text-tx-caption">
          {right}
        </span>
      )}
    </div>
  )
}

/** 각인 등급별 색상 */
const ENGRAVING_GRADE_COLOR: Record<string, string> = {
  '유물': 'text-[#C44A00] dark:text-[#FA5D00]',
  '전설': 'text-[#9A7A00] dark:text-[#FFD200]',
  '영웅': 'text-purple-700 dark:text-purple-400',
}

// ===================================================================
// 메인 컴포넌트
// ===================================================================

/**
 * 특성 + 각인 섹션 Props
 *
 * @property data - 캐릭터 전체 데이터
 */
interface StatsEngravingSectionProps {
  data: CharData
}

/**
 * 특성 + 각인 섹션 (2열 레이아웃)
 *
 * 좌측: 기본 특성 (공격력, 최대 생명력) + 전투 특성 (6대 스탯 + 합계)
 * 우측: 각인 목록 (등급 색상 × 레벨 + 이름 + 스톤 Lv.)
 *
 * @param data - 캐릭터 전체 데이터
 *
 * @example
 * <StatsEngravingSection data={charData} />
 */
export function StatsEngravingSection({ data }: StatsEngravingSectionProps) {
  const { stats, engraving } = data

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
        {/* 기본 특성 */}
        <SectionLabel>기본 특성</SectionLabel>
        <div className="space-y-2 px-1">
          {/* 공격력 */}
          <div className="flex items-baseline justify-between">
            <span className="text-[13px] font-medium text-tx-body">공격력</span>
            <span className="text-[16px] font-bold tabular-nums text-tx-title">{stats.attack.toLocaleString()}</span>
          </div>
          {/* 최대 생명력 */}
          <div className="flex items-baseline justify-between">
            <span className="text-[13px] font-medium text-tx-body">최대 생명력</span>
            <span className="text-[16px] font-bold tabular-nums text-tx-title">
              {stats.maxHp > 0 ? stats.maxHp.toLocaleString() : '-'}
            </span>
          </div>
        </div>

        {/* 전투 특성 */}
        <div className="mt-5">
          <SectionLabel right={`합계 ${total.toLocaleString()}`}>전투 특성</SectionLabel>
          <div className="grid grid-cols-3 gap-x-6 gap-y-2.5 px-1">
            {statEntries.map(({ label, value }) => {
              const isMain = value > 100
              return (
                <div key={label} className="flex items-baseline justify-between gap-2">
                  <span className={`text-[12px] ${isMain ? 'font-medium text-tx-label' : 'text-tx-muted'}`}>
                    {label}
                  </span>
                  <span className={`text-[15px] font-bold tabular-nums ${isMain ? 'text-tx-title' : 'text-tx-muted'}`}>
                    {value.toLocaleString()}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── 우측: 각인 ── */}
      <div className="flex-1 rounded-lg bg-card px-4 py-3 shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">
        <SectionLabel>각인</SectionLabel>
        <div className="space-y-2">
          {engraving.length > 0 ? engraving.map((eng, i) => {
            const gradeColor = ENGRAVING_GRADE_COLOR[eng.grade] ?? 'text-tx-body'
            return (
              <div key={i} className="flex items-center gap-x-2">
                {/* 등급 + 레벨 */}
                <span className={`text-[12px] font-bold ${gradeColor}`}>
                  x {eng.level}
                </span>
                {/* 각인명 */}
                <span className="text-[12px] font-medium text-tx-body">
                  {eng.name}
                </span>
                {/* 스톤 레벨 */}
                {eng.stoneLevel > 0 && (
                  <span className="ml-auto text-[10px] text-[#007AB8] dark:text-[#00B5FF]">
                    Lv.{eng.stoneLevel}
                  </span>
                )}
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
