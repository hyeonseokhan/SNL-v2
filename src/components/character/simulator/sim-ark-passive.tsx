'use client'

/**
 * @file 시뮬레이터 — 아크패시브 수정 섹션
 *
 * 진화/깨달음/도약 3트리의 카르마 랭크(0~6)와 레벨(1~30)을 수정합니다.
 */

import { useCharacterStore } from '@/stores/character-store'
import { SectionLabel } from '../section-label'

/** 트리 정의 */
const TREES = [
  { key: 'evolution' as const, label: '진화', bg: 'bg-[#c4a33a]' },
  { key: 'enlightenment' as const, label: '깨달음', bg: 'bg-[#3a7ac4]' },
  { key: 'leap' as const, label: '도약', bg: 'bg-[#3ac46a]' },
]

/** 랭크 옵션 */
const RANKS = [0, 1, 2, 3, 4, 5, 6] as const

/**
 * 아크패시브 수정 섹션
 */
export function SimArkPassive() {
  const original = useCharacterStore((s) => s.original)
  const simulated = useCharacterStore((s) => s.simulated)
  const updateSimulated = useCharacterStore((s) => s.updateSimulated)

  if (!original) return null

  const arkPassive = (simulated ?? original).arkPassive

  /** 특정 트리의 랭크/레벨 변경 */
  function updateTree(treeKey: 'evolution' | 'enlightenment' | 'leap', patch: { karmaRank?: number; karmaLevel?: number }) {
    updateSimulated({
      arkPassive: {
        ...arkPassive,
        [treeKey]: { ...arkPassive[treeKey], ...patch },
      },
    })
  }

  return (
    <div className="rounded-lg bg-card px-5 py-4 shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">
      <SectionLabel>아크패시브</SectionLabel>
      <div className="space-y-3 pl-3">
        {TREES.map(({ key, label, bg }) => {
          const tree = arkPassive[key]
          return (
            <div key={key} className="flex items-center gap-3">
              <span className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-bold text-white ${bg}`}>
                {label}
              </span>

              {/* 랭크 */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-tx-caption">랭크</span>
                <select
                  value={tree.karmaRank}
                  onChange={(e) => updateTree(key, { karmaRank: Number(e.target.value) })}
                  className="h-7 rounded border border-black/10 bg-transparent px-1.5 text-[11px] text-tx-body dark:border-white/10"
                >
                  {RANKS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* 레벨 */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-tx-caption">레벨</span>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={tree.karmaLevel}
                  onChange={(e) => updateTree(key, { karmaLevel: Number(e.target.value) })}
                  className="h-7 w-14 rounded border border-black/10 bg-transparent px-1.5 text-center text-[11px] tabular-nums text-tx-body dark:border-white/10"
                />
              </div>

              {/* 포인트 표시 */}
              <span className="text-[10px] tabular-nums text-tx-caption">
                {tree.points}P
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
