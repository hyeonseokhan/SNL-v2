/**
 * @file 아크패시브 노드 효과 데이터베이스
 *
 * 진화/깨달음 노드별 효율 계산 공식을 정의합니다.
 * PoC: snl/poc/combat-calc/src/effect-db.ts 기반 이식.
 */

// ===================================================================
// 효과 타입
// ===================================================================

/** 단순 고정값 (perLevel × level) */
interface FlatEffect {
  type: 'flat'
  stat: 'critRate' | 'critDmg'
  perLevel: number
}

/** 스택형 (perStack × maxStack) */
interface StackEffect {
  type: 'stack'
  stat: 'critRate'
  perStack: number
  maxStack: number
  /** true면 만렙 기준 최대 스택 가정 */
  assumeMaxStack: boolean
}

/** 속도 기반 (totalSpeed × multiplier × level / 100) */
interface SpeedBasedEffect {
  type: 'speed_based'
  stat: 'critRate' | 'critDmg'
  multiplierPerLevel: number
}

/** 치적 기반 (critRate × multiplier × level, cap 있음) */
interface CritBasedEffect {
  type: 'crit_based'
  stat: 'critDmg'
  multiplierPerLevel: number
  cap?: number
}

export type NodeEffect = FlatEffect | StackEffect | SpeedBasedEffect | CritBasedEffect

// ===================================================================
// 노드 효과 테이블
// ===================================================================

/**
 * 아크패시브 노드 → 효과 매핑
 *
 * 치적/치피에 기여하는 노드만 정의합니다.
 */
export const NODE_EFFECTS: Record<string, NodeEffect> = {
  // 진화 노드
  '예리한 감각': { type: 'flat', stat: 'critRate', perLevel: 4 },
  '혼신의 강타': { type: 'flat', stat: 'critRate', perLevel: 12 },
  '달인':       { type: 'stack', stat: 'critRate', perStack: 1.4, maxStack: 5, assumeMaxStack: true },
  '일격':       { type: 'flat', stat: 'critRate', perLevel: 10 },

  // 깨달음 노드 — 기민함 (속도 기반, 치적 + 치피)
  '기민함_치적': { type: 'speed_based', stat: 'critRate', multiplierPerLevel: 10 },
  '기민함_치피': { type: 'speed_based', stat: 'critDmg', multiplierPerLevel: 40 },

  // 깨달음 노드 — 성검 개방 (치적 기반 치피)
  '성검 개방':   { type: 'crit_based', stat: 'critDmg', multiplierPerLevel: 0.55, cap: 55 },

  // 깨달음 노드 — 치명적인 주먹 (치적 기반 치피)
  '치명적인 주먹': { type: 'crit_based', stat: 'critDmg', multiplierPerLevel: 0.667, cap: 200 },
}

// ===================================================================
// 클래스별 고유 속도 버프
// ===================================================================

/**
 * 클래스별 고유 공이속 버프 (%)
 *
 * 직업 각인 활성 시 적용되는 영구 속도 버프입니다.
 */
export const CLASS_SPEED_BUFF: Record<string, number> = {
  '기상술사': 12,   // 질풍노도
  '브레이커': 15,   // 수라의 길
}

// ===================================================================
// 헬퍼
// ===================================================================

/**
 * 노드 효과에서 치적 기여분을 계산합니다.
 *
 * @param effect - 노드 효과 정의
 * @param level - 노드 레벨
 * @param totalSpeed - 총 속도 증가% (speed_based용)
 * @param totalCritRate - 총 치적% (crit_based용)
 * @returns 치적 기여분 (%)
 */
export function calcCritRateFromEffect(
  effect: NodeEffect,
  level: number,
  totalSpeed: number = 0,
  totalCritRate: number = 0,
): number {
  if (effect.stat !== 'critRate') return 0

  switch (effect.type) {
    case 'flat':
      return effect.perLevel * level
    case 'stack':
      return effect.perStack * effect.maxStack
    case 'speed_based':
      return totalSpeed * (effect.multiplierPerLevel * level) / 100
    default:
      return 0
  }
}

/**
 * 노드 효과에서 치피 기여분을 계산합니다.
 *
 * @param effect - 노드 효과 정의
 * @param level - 노드 레벨
 * @param totalSpeed - 총 속도 증가% (speed_based용)
 * @param totalCritRate - 총 치적% (crit_based용)
 * @returns 치피 기여분 (%)
 */
export function calcCritDmgFromEffect(
  effect: NodeEffect,
  level: number,
  totalSpeed: number = 0,
  totalCritRate: number = 0,
): number {
  if (effect.stat !== 'critDmg') return 0

  switch (effect.type) {
    case 'speed_based':
      return totalSpeed * (effect.multiplierPerLevel * level) / 100
    case 'crit_based': {
      const raw = totalCritRate * effect.multiplierPerLevel * level
      return effect.cap ? Math.min(raw, effect.cap) : raw
    }
    default:
      return 0
  }
}
