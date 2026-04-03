'use client'

/**
 * @file 시뮬레이터 탭 메인 컴포넌트
 *
 * 각 섹션(각인, 보석 등)을 세로로 배치하고
 * 상단에 원본 복원 버튼을 제공합니다.
 */

import { useCharacterStore } from '@/stores/character-store'
import { SimEngraving } from './sim-engraving'
import { SimGem } from './sim-gem'
import { SimStone } from './sim-stone'
import { SimArkPassive } from './sim-ark-passive'

/**
 * 시뮬레이터 탭
 *
 * 캐릭터 세팅을 변경하여 효율 변화를 확인할 수 있는 인터페이스입니다.
 * 변경 사항은 스토어의 simulated에 저장되며 능력치 탭에 즉시 반영됩니다.
 */
export function SimulatorTab() {
  const isDirty = useCharacterStore((s) => s.isDirty)
  const resetSimulated = useCharacterStore((s) => s.resetSimulated)

  return (
    <div className="space-y-2">
      {/* 상단 컨트롤 */}
      <div className="flex items-center justify-between rounded-lg bg-card px-5 py-3 shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">
        <p className="text-[12px] text-tx-label">
          세팅을 변경하면 능력치 탭에 즉시 반영됩니다.
        </p>
        <button
          onClick={resetSimulated}
          disabled={!isDirty}
          className="rounded-md bg-primary/15 px-3 py-1 text-[11px] font-medium text-primary transition-opacity disabled:opacity-30"
        >
          원본 복원
        </button>
      </div>

      {/* 수정 섹션 */}
      <SimEngraving />
      <SimGem />
      <SimStone />
      <SimArkPassive />
    </div>
  )
}
