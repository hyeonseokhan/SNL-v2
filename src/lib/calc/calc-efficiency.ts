/**
 * @file 효율 분석 계산 엔진
 *
 * CharData를 입력받아 6가지 효율 지표를 계산합니다.
 * PoC: snl/src/app/tools/character-analyzer/engine/calc-efficiency.ts 기반 이식.
 *
 * @example
 * const metrics = calculateEfficiency(charData)
 * console.log(metrics.critRate)      // { total: 85.3, breakdown: [...] }
 * console.log(metrics.critDamage)    // { total: 252.4, breakdown: [...] }
 */

import type { CharData } from '@/types/character'
import {
  NODE_EFFECTS,
  CLASS_SPEED_BUFF,
  calcCritRateFromEffect,
  calcCritDmgFromEffect,
} from './effect-db'
import { CRIT_STAT_DIVISOR, HASTE_CDR_MULTIPLIER } from '@/config/efficiency-tables'

// ===================================================================
// 타입
// ===================================================================

/** 효율 지표 항목 상세 */
export interface BreakdownItem {
  source: string
  value: number
}

/** 단일 효율 지표 */
export interface EfficiencyMetric {
  total: number
  breakdown: BreakdownItem[]
}

/** 6가지 효율 지표 전체 */
export interface EfficiencyMetrics {
  /** 치명타 적중률 (%) */
  critRate: EfficiencyMetric
  /** 치명타 피해량 (%) */
  critDamage: EfficiencyMetric
  /** 공격 속도 (%) */
  attackSpeed: EfficiencyMetric
  /** 이동 속도 (%) */
  moveSpeed: EfficiencyMetric
  /** 팔찌 효율 (계수) */
  braceletEfficiency: EfficiencyMetric
  /** 각인 총합 효율 (계수) */
  engravingEfficiency: EfficiencyMetric
}

/** 시뮬레이터 버프 옵션 */
export interface BuffOptions {
  /** 만찬 공이속 +5% */
  feast?: boolean
  /** 전투축복 III 공이속 +9% */
  blessing3?: boolean
}

// ===================================================================
// 변환 함수
// ===================================================================

/** 치명 스탯 → 치적% */
export function critStatToRate(critStat: number): number {
  return critStat / CRIT_STAT_DIVISOR
}

/** 신속 스탯 → 속도 증가% */
export function hasteStatToSpeed(hasteStat: number): number {
  return hasteStat / 58.23
}

// ===================================================================
// 메인 계산 함수
// ===================================================================

/**
 * 6가지 효율 지표를 계산합니다.
 *
 * @param data - 캐릭터 전체 데이터 (원본 또는 시뮬레이션 수정본)
 * @param buffs - 외부 버프 옵션
 * @returns 6가지 효율 지표 + breakdown
 */
export function calculateEfficiency(
  data: CharData,
  buffs: BuffOptions = {},
): EfficiencyMetrics {
  const { stats, engraving, armory, arkPassive } = data
  const className = data.profile.class

  // ─── 1. 속도 계산 (치적/치피/노드에서 참조) ───

  const speedFromStat = hasteStatToSpeed(stats.haste)
  const classSpeedBuff = CLASS_SPEED_BUFF[className] ?? 0
  const buffSpeed = (buffs.feast ? 5 : 0) + (buffs.blessing3 ? 9 : 0)
  const massIncreaseAtkSpeedPenalty = engraving.some(e => e.name === '질량 증가') ? -10 : 0

  const totalAtkSpeed = speedFromStat + classSpeedBuff + buffSpeed + massIncreaseAtkSpeedPenalty
  const totalMoveSpeed = speedFromStat + classSpeedBuff + buffSpeed

  const attackSpeedBreakdown: BreakdownItem[] = [
    { source: '신속 스탯', value: speedFromStat },
  ]
  const moveSpeedBreakdown: BreakdownItem[] = [
    { source: '신속 스탯', value: speedFromStat },
  ]
  if (classSpeedBuff) {
    attackSpeedBreakdown.push({ source: `클래스 버프 (${className})`, value: classSpeedBuff })
    moveSpeedBreakdown.push({ source: `클래스 버프 (${className})`, value: classSpeedBuff })
  }
  if (buffSpeed) {
    attackSpeedBreakdown.push({ source: '도핑/버프', value: buffSpeed })
    moveSpeedBreakdown.push({ source: '도핑/버프', value: buffSpeed })
  }
  if (massIncreaseAtkSpeedPenalty) {
    attackSpeedBreakdown.push({ source: '질량 증가', value: massIncreaseAtkSpeedPenalty })
  }

  // ─── 2. 치명타 적중률 ───

  const critBreakdown: BreakdownItem[] = []

  // 2-1. 치명 스탯
  const critFromStat = critStatToRate(stats.critical)
  critBreakdown.push({ source: '치명 스탯', value: critFromStat })

  // 2-2. 악세서리 연마 (치적 옵션)
  const accSlots = [
    armory.accessory.necklace,
    armory.accessory.earing1,
    armory.accessory.earing2,
    armory.accessory.ring1,
    armory.accessory.ring2,
  ]
  let critFromAcc = 0
  for (const acc of accSlots) {
    for (const opt of acc.option) {
      const m = opt.match(/치명타 적중률 \+(\d+\.?\d+)%/)
      if (m) critFromAcc += parseFloat(m[1])
    }
  }
  if (critFromAcc) critBreakdown.push({ source: '악세 연마', value: critFromAcc })

  // 2-3. 팔찌
  let critFromBangle = 0
  for (const opt of armory.accessory.bangle.option) {
    const m = opt.match(/치명타\s*적중률[이가]?\s*\+?(\d+\.?\d+)%/)
    if (m) critFromBangle += parseFloat(m[1])
  }
  if (critFromBangle) critBreakdown.push({ source: '팔찌', value: critFromBangle })

  // 2-4. 아크패시브 노드
  const allNodes = [
    ...arkPassive.evolution.nodes,
    ...arkPassive.enlightenment.nodes,
    ...arkPassive.leap.nodes,
  ]
  for (const node of allNodes) {
    // 기민함은 치적 + 치피 두 가지 효과
    if (node.name === '기민함') {
      const effect = NODE_EFFECTS['기민함_치적']
      if (effect) {
        const val = calcCritRateFromEffect(effect, node.level, totalMoveSpeed)
        if (val) critBreakdown.push({ source: `기민함 (치적)`, value: val })
      }
      continue
    }
    const effect = NODE_EFFECTS[node.name]
    if (effect) {
      const val = calcCritRateFromEffect(effect, node.level, totalMoveSpeed)
      if (val) critBreakdown.push({ source: node.name, value: val })
    }
  }

  // 2-5. 각인 치적
  const adrenaline = engraving.find(e => e.name === '아드레날린')
  if (adrenaline) {
    critBreakdown.push({ source: '아드레날린', value: 20 })
  }
  const precisionDagger = engraving.find(e => e.name === '정밀 단도')
  if (precisionDagger) {
    critBreakdown.push({ source: '정밀 단도', value: 18 })
  }

  // 2-6. 트라이포드 (급소 노출)
  const hasWeakspot = data.skills.some(s =>
    s.tripods.some(t => t.name === '급소 노출')
  )
  if (hasWeakspot) {
    critBreakdown.push({ source: '급소 노출 (트라이포드)', value: 10 })
  }

  const critRateTotal = critBreakdown.reduce((s, b) => s + b.value, 0)

  // ─── 3. 치명타 피해량 ───

  const critDmgBreakdown: BreakdownItem[] = []
  critDmgBreakdown.push({ source: '기본', value: 200 })

  // 3-1. 악세 연마 치피
  let critDmgFromAcc = 0
  for (const acc of accSlots) {
    for (const opt of acc.option) {
      const m = opt.match(/치명타 피해 \+(\d+\.?\d+)%/)
      if (m) critDmgFromAcc += parseFloat(m[1])
    }
  }
  if (critDmgFromAcc) critDmgBreakdown.push({ source: '악세 연마', value: critDmgFromAcc })

  // 3-2. 팔찌 치피
  let critDmgFromBangle = 0
  for (const opt of armory.accessory.bangle.option) {
    const m = opt.match(/치명타\s*피해\s*\+?(\d+\.?\d+)%/)
    if (m) critDmgFromBangle += parseFloat(m[1])
  }
  if (critDmgFromBangle) critDmgBreakdown.push({ source: '팔찌', value: critDmgFromBangle })

  // 3-3. 기민함 (치피)
  for (const node of allNodes) {
    if (node.name === '기민함') {
      const effect = NODE_EFFECTS['기민함_치피']
      if (effect) {
        const val = calcCritDmgFromEffect(effect, node.level, totalAtkSpeed)
        if (val) critDmgBreakdown.push({ source: '기민함 (치피)', value: val })
      }
    }
    // 성검 개방, 치명적인 주먹
    const effect = NODE_EFFECTS[node.name]
    if (effect && effect.stat === 'critDmg') {
      const val = calcCritDmgFromEffect(effect, node.level, 0, critRateTotal)
      if (val) critDmgBreakdown.push({ source: node.name, value: val })
    }
  }

  // 3-4. 각인 치피
  const keenBlunt = engraving.find(e => e.name === '예리한 둔기')
  if (keenBlunt) {
    // 유물 기준 50%
    critDmgBreakdown.push({ source: '예리한 둔기', value: 50 })
  }
  if (precisionDagger) {
    critDmgBreakdown.push({ source: '정밀 단도 (감소)', value: -12 })
  }

  const critDmgTotal = critDmgBreakdown.reduce((s, b) => s + b.value, 0)

  // ─── 4. 팔찌 효율 (간이) ───

  const bangleBreakdown: BreakdownItem[] = []
  for (const opt of armory.accessory.bangle.option) {
    // 간이: 옵션 텍스트에서 수치 추출
    const numMatch = opt.match(/(\d+\.?\d+)%/)
    if (numMatch) {
      bangleBreakdown.push({ source: opt, value: parseFloat(numMatch[1]) })
    }
  }
  const bangleTotal = bangleBreakdown.reduce((s, b) => s + b.value, 0)

  // ─── 5. 각인 총합 효율 ───

  const engBreakdown: BreakdownItem[] = []
  for (const eng of engraving) {
    // 간이: 각인 이름 + 레벨로 효율값 추정
    engBreakdown.push({ source: `${eng.name} x${eng.level}`, value: eng.level * 4 })
  }
  const engTotal = engBreakdown.reduce((s, b) => s + b.value, 0)

  // ─── 6. 메인노드 효율 ───

  // 5티어 진화 노드 찾기
  const mainNode = arkPassive.evolution.nodes.find(n => n.tier === 5)
  const mainNodeBreakdown: BreakdownItem[] = []
  if (mainNode) {
    mainNodeBreakdown.push({ source: `${mainNode.name} Lv.${mainNode.level}`, value: mainNode.level * 10 })
  }
  const mainNodeTotal = mainNodeBreakdown.reduce((s, b) => s + b.value, 0)

  // ─── 결과 ───

  return {
    critRate: { total: critRateTotal, breakdown: critBreakdown },
    critDamage: { total: critDmgTotal, breakdown: critDmgBreakdown },
    attackSpeed: { total: totalAtkSpeed, breakdown: attackSpeedBreakdown },
    moveSpeed: { total: totalMoveSpeed, breakdown: moveSpeedBreakdown },
    braceletEfficiency: { total: bangleTotal, breakdown: bangleBreakdown },
    engravingEfficiency: { total: engTotal, breakdown: engBreakdown },
  }
}
