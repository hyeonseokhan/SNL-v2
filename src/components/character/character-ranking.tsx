/**
 * @file 캐릭터 랭킹 컴포넌트
 *
 * 전체 서버 / 해당 서버 × 전체 클래스 / 서버 클래스 2×2 매트릭스
 */

import type { RankingData } from '@/lib/korlark-api'

interface CharacterRankingProps {
  ranking: RankingData
  serverName: string
}

// ===================================================================
// 헬퍼
// ===================================================================

/** 상위 N% 텍스트 (0.024 → "2%") */
function toPercent(position: number): string {
  return `${Math.max(1, Math.ceil(position * 100))}%`
}

/** 순위 포맷 (40416 → "40,416위") */
function toRank(value: number): string {
  return `${value.toLocaleString('ko-KR')}위`
}

// ===================================================================
// 행 컴포넌트
// ===================================================================

// 서버당 2행 레이아웃: 순위 / 클래스 각 한 줄
function RankSection({
  label,
  overall,
  job,
}: {
  label: string
  overall: { value: number; position: number }
  job: { value: number; position: number }
}) {
  return (
    <div className="space-y-[3px] text-[11px]">
      {/* 1행: 서버명 + 순위 */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-tx-caption">{label}</span>
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="tabular-nums text-tx-body">{toRank(overall.value)}</span>
          <span className="text-[10px] text-tx-muted">{toPercent(overall.position)}</span>
        </div>
      </div>
      {/* 2행: 클래스 순위 */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-tx-muted">클래스</span>
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="tabular-nums text-tx-label">{toRank(job.value)}</span>
          <span className="text-[10px] text-tx-muted">{toPercent(job.position)}</span>
        </div>
      </div>
    </div>
  )
}

// ===================================================================
// 메인
// ===================================================================

export function CharacterRanking({ ranking, serverName }: CharacterRankingProps) {
  return (
    <div className="rounded-lg bg-card px-4 py-3 shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">
      <div className="space-y-2">
        <RankSection
          label="전체 서버"
          overall={ranking.total}
          job={ranking.job}
        />
        <div className="h-px bg-white/8" />
        <RankSection
          label={`${serverName} 서버`}
          overall={ranking.server}
          job={ranking.serverAndJob}
        />
      </div>
    </div>
  )
}
