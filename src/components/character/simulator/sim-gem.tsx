'use client'

/**
 * @file 시뮬레이터 — 보석 수정 섹션
 *
 * 11슬롯 × (종류 + 레벨 + 적용 스킬) dropdown으로 보석을 변경합니다.
 * 일괄 변경 버튼으로 전체 보석을 한번에 설정할 수 있습니다.
 */

import { useCharacterStore } from '@/stores/character-store'
import { SectionLabel } from '../section-label'
import type { GemData } from '@/types/character'

/** 보석 종류 옵션 */
const GEM_TYPES = [
  { value: '', label: '없음' },
  { value: 'damage', label: '딜증 (겁화/멸화)' },
  { value: 'cooldown', label: '쿨감 (작열/홍염)' },
] as const

/** 보석 레벨 옵션 */
const GEM_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const

/** 일괄 변경 프리셋 */
const BATCH_PRESETS = [
  { label: '10겁작', level: 10 },
  { label: '9겁작', level: 9 },
  { label: '8겁작', level: 8 },
  { label: '7겁작', level: 7 },
] as const

/** 빈 보석 슬롯 */
const EMPTY_GEM: GemData = {
  level: 7, name: '', icon: '', grade: '', type: '',
  effect: '', skillName: '', skillIcon: '', option: '',
}

/** 최대 보석 슬롯 수 */
const MAX_SLOTS = 11

/**
 * 보석 수정 섹션
 *
 * 현재 캐릭터의 보석을 11슬롯 dropdown으로 수정합니다.
 * 각 슬롯: 종류(딜증/쿨감) + 레벨(1~10) + 적용 스킬
 */
export function SimGem() {
  const original = useCharacterStore((s) => s.original)
  const simulated = useCharacterStore((s) => s.simulated)
  const updateSimulated = useCharacterStore((s) => s.updateSimulated)

  if (!original) return null

  const currentGems = (simulated ?? original).gem
  const skills = original.skills

  // 11슬롯 보장
  const slots: GemData[] = Array.from({ length: MAX_SLOTS }, (_, i) =>
    currentGems[i] ?? { ...EMPTY_GEM }
  )

  // 스킬 이름 목록 (중복 제거)
  const skillNames = [...new Set(skills.map((s) => s.name).filter(Boolean))]

  /** 특정 슬롯 변경 */
  function updateSlot(index: number, patch: Partial<GemData>) {
    const updated = slots.map((slot, i) =>
      i === index ? { ...slot, ...patch } : slot
    ).filter(s => s.type) // 종류 없는 슬롯 제거
    updateSimulated({ gem: updated })
  }

  /** 일괄 변경 — 딜증 6 + 쿨감 5 세트 */
  function applyBatch(level: number) {
    const damageSkills = skillNames.slice(0, 6)
    const cooldownSkills = skillNames.slice(0, 5)
    const gems: GemData[] = [
      ...damageSkills.map((sk) => ({ ...EMPTY_GEM, type: 'damage', level, skillName: sk })),
      ...cooldownSkills.map((sk) => ({ ...EMPTY_GEM, type: 'cooldown', level, skillName: sk })),
    ]
    updateSimulated({ gem: gems })
  }

  return (
    <div className="rounded-lg bg-card px-5 py-4 shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">
      <SectionLabel
        right={
          <div className="flex gap-1">
            {BATCH_PRESETS.map((p) => (
              <button
                key={p.level}
                onClick={() => applyBatch(p.level)}
                className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        }
      >
        보석
      </SectionLabel>
      <div className="space-y-2 pl-3">
        {slots.map((slot, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-4 text-[11px] tabular-nums text-tx-caption">{i + 1}</span>

            {/* 종류 */}
            <select
              value={slot.type}
              onChange={(e) => updateSlot(i, { type: e.target.value })}
              className="h-7 w-[120px] rounded border border-black/10 bg-transparent px-1.5 text-[11px] text-tx-body dark:border-white/10"
            >
              {GEM_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>

            {/* 레벨 */}
            <select
              value={slot.level}
              onChange={(e) => updateSlot(i, { level: Number(e.target.value) })}
              className="h-7 rounded border border-black/10 bg-transparent px-1.5 text-[11px] text-tx-body dark:border-white/10"
            >
              {GEM_LEVELS.map((lv) => (
                <option key={lv} value={lv}>Lv.{lv}</option>
              ))}
            </select>

            {/* 적용 스킬 */}
            <select
              value={slot.skillName}
              onChange={(e) => updateSlot(i, { skillName: e.target.value })}
              className="h-7 min-w-0 flex-1 rounded border border-black/10 bg-transparent px-1.5 text-[11px] text-tx-body dark:border-white/10"
            >
              <option value="">스킬 선택</option>
              {skillNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}
