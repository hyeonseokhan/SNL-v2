/**
 * @file 효율 분석 계산 엔진
 *
 * CharData를 입력받아 6가지 효율 지표를 계산합니다.
 * LOPEC (lopec.kr) 계산 로직 기반.
 */

import type { CharData } from '@/types/character'
import { ENGRAVING_EFFICIENCY } from '@/config/efficiency-tables'

// ===================================================================
// 타입
// ===================================================================

export interface BreakdownItem {
  source: string
  value: number
}

export interface EfficiencyMetric {
  total: number
  breakdown: BreakdownItem[]
}

export interface EfficiencyMetrics {
  critRate: EfficiencyMetric
  critDamage: EfficiencyMetric
  attackSpeed: EfficiencyMetric
  moveSpeed: EfficiencyMetric
  braceletEfficiency: EfficiencyMetric
  engravingEfficiency: EfficiencyMetric
  mainNodeEfficiency: EfficiencyMetric
}

export interface BuffOptions {
  feast?: boolean
  blessing3?: boolean
}

// ===================================================================
// 변환 함수
// ===================================================================

/** 치명 스탯 → 치적% (LOPEC: floor(stat / 0.2794) / 100) */
export function critStatToRate(critStat: number): number {
  return Math.floor(critStat / 0.2794) / 100
}

/** 신속 스탯 → 속도% (LOPEC: floor(stat / 0.5821) / 100) */
export function hasteStatToSpeed(hasteStat: number): number {
  return Math.floor(hasteStat / 0.5821) / 100
}

// ===================================================================
// 클래스별 직업 각인 효과
// ===================================================================

/**
 * 질풍노도 (기상술사)
 * - 치적: 10% + floor(0.3 × min(이동속도, 40) × 100) / 100
 * - 치피: floor(1.2 × min(이동속도, 40) × 100) / 100
 * - 공이속: +12%
 */
interface ClassPassiveEffect {
  critRate: (moveSpeed: number) => number
  critDmg: (moveSpeed: number) => number
  atkSpeed: number
  moveSpeed: number
}

const CLASS_PASSIVE: Record<string, ClassPassiveEffect> = {
  '질풍노도': {
    critRate: (ms) => 10 + Math.floor(0.3 * Math.min(ms, 40) * 100) / 100,
    critDmg: (as) => Math.floor(1.2 * Math.min(as, 40) * 100) / 100,
    atkSpeed: 12,
    moveSpeed: 12,
  },
  '수라의 길': {
    critRate: () => 0,
    critDmg: () => 0,
    atkSpeed: 15,
    moveSpeed: 15,
  },
}

/** 캐릭터 secondClass(직업 각인)에서 패시브 효과 조회 */
function getClassPassive(secondClass: string): ClassPassiveEffect | null {
  return CLASS_PASSIVE[secondClass] ?? null
}

// ===================================================================
// 메인 계산 함수
// ===================================================================

export function calculateEfficiency(
  data: CharData,
  buffs: BuffOptions = {},
): EfficiencyMetrics {
  const { stats, engraving, armory, arkPassive } = data
  const classPassive = getClassPassive(data.profile.secondClass)

  // ─── 1. 속도 계산 ───
  const BASE_SPEED = 14
  const speedFromStat = hasteStatToSpeed(stats.haste)
  const classAtkSpeed = classPassive?.atkSpeed ?? 0
  const classMoveSpeed = classPassive?.moveSpeed ?? 0
  const buffSpeed = (buffs.feast ? 5 : 0) + (buffs.blessing3 ? 9 : 0)
  const massIncreasePenalty = engraving.some(e => e.name === '질량 증가') ? -10 : 0

  const totalAtkSpeed = BASE_SPEED + speedFromStat + classAtkSpeed + buffSpeed + massIncreasePenalty
  const totalMoveSpeed = BASE_SPEED + speedFromStat + classMoveSpeed + buffSpeed

  const atkSpeedBreakdown: BreakdownItem[] = [
    { source: '기본', value: BASE_SPEED },
    { source: '신속 스탯', value: speedFromStat },
  ]
  const moveSpeedBreakdown: BreakdownItem[] = [
    { source: '기본', value: BASE_SPEED },
    { source: '신속 스탯', value: speedFromStat },
  ]
  if (classAtkSpeed) {
    atkSpeedBreakdown.push({ source: `직업 (${data.profile.secondClass})`, value: classAtkSpeed })
    moveSpeedBreakdown.push({ source: `직업 (${data.profile.secondClass})`, value: classMoveSpeed })
  }
  if (buffSpeed) {
    atkSpeedBreakdown.push({ source: '도핑/버프', value: buffSpeed })
    moveSpeedBreakdown.push({ source: '도핑/버프', value: buffSpeed })
  }
  if (massIncreasePenalty) {
    atkSpeedBreakdown.push({ source: '질량 증가', value: massIncreasePenalty })
  }

  // ─── 2. 치명타 적중률 ───
  const critBreakdown: BreakdownItem[] = []

  // 2-1. 치명 스탯
  const critFromStat = critStatToRate(stats.critical)
  critBreakdown.push({ source: '특성', value: critFromStat })

  // 2-2. 악세서리 연마
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

  // 2-3. 팔찌 치적
  let critFromBangle = 0
  for (const opt of armory.accessory.bangle.option) {
    const m = opt.match(/치명타\s*적중률[이가]?\s*(\d+\.?\d+)%/)
    if (m) critFromBangle += parseFloat(m[1])
  }
  if (critFromBangle) critBreakdown.push({ source: '팔찌', value: critFromBangle })

  // 2-4. 진화 노드 (치적 기여)
  let critFromEvolution = 0
  for (const node of arkPassive.evolution.nodes) {
    if (node.name === '예리한 감각') { critFromEvolution += 4 * node.level }
    else if (node.name === '혼신의 강타') { critFromEvolution += 12 * node.level }
    else if (node.name === '달인') { critFromEvolution += 1.4 * 5 } // max stack 가정
    else if (node.name === '일격') { critFromEvolution += 10 * node.level }
  }
  if (critFromEvolution) critBreakdown.push({ source: '진화', value: critFromEvolution })

  // 2-5. 직업 각인 고유 치적 (질풍노도 등)
  // 질풍노도 치적: 10% + floor(0.3 × min(이속증가, 40))
  // 이속증가 = 전체 이동속도 - 기본 100% (기본 14% 포함)
  // LOPEC 기준: 이속 53.83% → min(53.83, 40) = 40 → 10 + 12 = 22%
  if (classPassive) {
    const moveSpeedIncrease = totalMoveSpeed
    const critFromClass = classPassive.critRate(moveSpeedIncrease)
    if (critFromClass) critBreakdown.push({ source: `직업 기본 (${data.profile.secondClass})`, value: critFromClass })
  }

  // 기민함 — 로스트빌드에서는 치적/치피에 기여하지만, LOPEC 효율표에서는 별도 계산
  // 여기서는 찾아두고 치피 계산에서 사용
  const allNodes = [
    ...arkPassive.evolution.nodes,
    ...arkPassive.enlightenment.nodes,
    ...arkPassive.leap.nodes,
  ]
  const giminham = allNodes.find(n => n.name === '기민함')

  // 2-7. 각인 치적
  const adrenaline = engraving.find(e => e.name === '아드레날린')
  if (adrenaline) {
    critBreakdown.push({ source: '아드레날린', value: 20 })
  }

  // 급소 노출: 로스트빌드에서는 스킬별 딜 계산에 적용, LOPEC 효율표에서는 미포함

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

  // 3-2. 기민함 치피 — 공속 기반
  // 기민함 치피: min(공속증가, 40) × 40 × level / 10000 (%)
  if (giminham) {
    const cappedAtkSpeed = Math.min(totalAtkSpeed, 40)
    const critDmgFromGiminham = cappedAtkSpeed * 40 * giminham.level / 10000 * 100
    critDmgBreakdown.push({ source: '기민함 (치피)', value: critDmgFromGiminham })
  }

  // 3-3. 각인 치피
  const keenBlunt = engraving.find(e => e.name === '예리한 둔기')
  if (keenBlunt) {
    critDmgBreakdown.push({ source: '예리한 둔기', value: 50 })
  }
  const precisionDagger = engraving.find(e => e.name === '정밀 단도')
  if (precisionDagger) {
    critDmgBreakdown.push({ source: '정밀 단도 (감소)', value: -12 })
  }

  const critDmgTotal = critDmgBreakdown.reduce((s, b) => s + b.value, 0)

  // ─── 4. 팔찌 효율 (간이) ───
  const bangleBreakdown: BreakdownItem[] = []
  for (const opt of armory.accessory.bangle.option) {
    const numMatch = opt.match(/(\d+\.?\d+)%/)
    if (numMatch) {
      bangleBreakdown.push({ source: opt, value: parseFloat(numMatch[1]) })
    }
  }
  const bangleTotal = bangleBreakdown.reduce((s, b) => s + b.value, 0)

  // ─── 5. 각인 총합 효율 (곱연산) ───
  const engBreakdown: BreakdownItem[] = []
  let engProduct = 1
  for (const eng of engraving) {
    const eff = ENGRAVING_EFFICIENCY[eng.name]
    if (eff) {
      // 스톤 레벨에 따른 보간 (lv0 ~ lv4)
      const ratio = eng.stoneLevel / 4
      const value = eff.lv0 + (eff.lv4 - eff.lv0) * ratio
      const multiplier = value / 100
      engBreakdown.push({ source: `${eng.name} x${eng.level}`, value: multiplier * 100 })
      engProduct *= (1 + multiplier)
    }
  }
  const engTotal = (engProduct - 1) * 100

  // ─── 6. 메인노드 효율 ───
  const mainNode = arkPassive.evolution.nodes.find(n => n.tier === 5)
  const mainNodeBreakdown: BreakdownItem[] = []
  let mainNodeTotal = 0

  if (mainNode?.name === '음속 돌파') {
    // LOPEC 공식: i = min(공속,40)*0.1 + min(이속,40)*0.1
    //            o = max(0,공속-40)*0.3 + max(0,이속-40)*0.3
    //            bonus = 양쪽 40 초과 시 +8
    //            total = min(i + bonus + o, 12 * level)
    const as = totalAtkSpeed
    const ms = totalMoveSpeed
    const i = Math.min(as, 40) * 0.1 + Math.min(ms, 40) * 0.1
    const o = Math.max(0, as - 40) * 0.3 + Math.max(0, ms - 40) * 0.3
    const bonus = (as > 40 && ms > 40) ? 8 : 0
    const cap = 12 * mainNode.level
    mainNodeTotal = Math.min(Math.floor((i + bonus + o) * 100) / 100, cap)
    mainNodeBreakdown.push({ source: `${mainNode.name} Lv.${mainNode.level}`, value: mainNodeTotal })
    mainNodeBreakdown.push({ source: '상한', value: cap })
  }

  // ─── 결과 ───
  return {
    critRate: { total: critRateTotal, breakdown: critBreakdown },
    critDamage: { total: critDmgTotal, breakdown: critDmgBreakdown },
    attackSpeed: { total: totalAtkSpeed, breakdown: atkSpeedBreakdown },
    moveSpeed: { total: totalMoveSpeed, breakdown: moveSpeedBreakdown },
    braceletEfficiency: { total: bangleTotal, breakdown: bangleBreakdown },
    engravingEfficiency: { total: engTotal, breakdown: engBreakdown },
    mainNodeEfficiency: { total: mainNodeTotal, breakdown: mainNodeBreakdown },
  }
}
