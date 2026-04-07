/**
 * @file 효율 분석 계산 엔진 (순수 알고리즘)
 *
 * CharData를 입력받아 6가지 효율 지표를 계산합니다.
 * LOPEC (lopec.kr) 계산 로직 기반.
 *
 * **데이터와 알고리즘 분리 원칙**:
 * - 게임 데이터(상수, 테이블)는 src/config/tables/ 하위에서 관리
 * - 게임 변환 공식은 src/config/constants/에서 관리
 * - 이 파일은 순수 알고리즘만 포함 (밸런스 패치 시 수정 불필요)
 *
 * @see docs/AI-PATCH-GUIDE.md
 */

import type { CharData } from '@/types/character'
import { ABILITY_ATTACK, GRADE_OFFSET } from '@/config/tables/engravings'
import { CRIT_STAT_DIVISOR, HASTE_STAT_DIVISOR, BASE_SPEED } from '@/config/constants/stat-conversion'
import {
  CLASS_PASSIVES,
  resolvePassiveCritRate,
  resolvePassiveCritDmg,
  type ClassPassiveEffect,
} from '@/config/tables/class-passives'
import { MAIN_NODE_DEFS } from '@/config/tables/main-nodes'

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
// 변환 함수 (스탯 → 효율 %)
// ===================================================================

/** 치명 스탯 → 치적% (LOPEC: floor(stat / 0.2794) / 100) */
export function critStatToRate(critStat: number): number {
  return Math.floor(critStat / CRIT_STAT_DIVISOR) / 100
}

/** 신속 스탯 → 속도% (LOPEC: floor(stat / 0.5821) / 100) */
export function hasteStatToSpeed(hasteStat: number): number {
  return Math.floor(hasteStat / HASTE_STAT_DIVISOR) / 100
}

/** 캐릭터 secondClass(직업 각인)에서 패시브 효과 조회 */
function getClassPassive(secondClass: string): ClassPassiveEffect | null {
  return CLASS_PASSIVES[secondClass] ?? null
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
    const critFromClass = resolvePassiveCritRate(classPassive, moveSpeedIncrease)
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

  // 3-3. 직업 각인 고정 치피 (질풍노도 제외 — 기민함에서 처리)
  if (classPassive) {
    const critDmgFromClass = resolvePassiveCritDmg(classPassive, totalAtkSpeed)
    // 질풍노도는 기민함에서 이미 처리하므로 중복 방지
    if (critDmgFromClass && data.profile.secondClass !== '질풍노도') {
      critDmgBreakdown.push({ source: `직업 (${data.profile.secondClass})`, value: critDmgFromClass })
    }
  }

  // 3-4. 각인 치피
  const keenBlunt = engraving.find(e => e.name === '예리한 둔기')
  if (keenBlunt) {
    critDmgBreakdown.push({ source: '예리한 둔기', value: 50 })
  }
  const precisionDagger = engraving.find(e => e.name === '정밀 단도')
  if (precisionDagger) {
    critDmgBreakdown.push({ source: '정밀 단도 (감소)', value: -12 })
  }

  const critDmgTotal = critDmgBreakdown.reduce((s, b) => s + b.value, 0)

  // ─── 4. 팔찌 효율 (전투력 계수 기반) ───
  // 팔찌 옵션을 bracelet_addontype_attack / bracelet_stattype 포인트로 변환
  // 각 포인트 → multiplier = point / 10000 + 1, 곱연산
  const bangleBreakdown: BreakdownItem[] = []
  let bangleProduct = 1

  // 팔찌 특수효과 포인트 매핑 (bracelet_addontype_attack에서 추출)
  const BANGLE_ADDON_PATTERNS: [RegExp, number][] = [
    [/추가\s*피해가?\s*(\d+\.?\d+)%.*악마/, 450],   // 추피+악마 (3.5%/2.5%)
    [/추가\s*피해가?\s*(\d+\.?\d+)%/, 350],          // 추피 단독
    [/치명타\s*적중률[이가]?\s*(\d+\.?\d+)%.*치명타.*피해가?\s*(\d+\.?\d+)%/, 400], // 치적+치주피
    [/적에게\s*주는\s*피해가?\s*(\d+\.?\d+)%/, 300],  // 적주피
  ]

  // 팔찌 스탯 포인트 계수 (bracelet_stattype)
  const BANGLE_STAT_COEFF: Record<string, number> = {
    '치명': 7000,   // critRate 계수
    '특화': 5000,
    '신속': 5000,
  }

  for (const opt of armory.accessory.bangle.option) {
    // 스탯 옵션 (치명 +117, 신속 +83 등)
    const statMatch = opt.match(/^(치명|특화|신속|제압|인내|숙련)\s*\+(\d+)$/)
    if (statMatch) {
      const statName = statMatch[1]
      const statValue = parseInt(statMatch[2])
      const coeff = BANGLE_STAT_COEFF[statName]
      if (coeff) {
        // 스탯 → 전투력 변화 비율 근사
        // 치명: 117 / 27.94 = 4.19% 치적 → 전투력 기여 ~3.25%
        // 신속: 83 / 58.23 = 1.43% 속도 → 돌격대장 연동 등 ~2.83%
        let contribution = 0
        if (statName === '치명') {
          contribution = statValue / 27.94 * 0.78 // 치적→딜증 변환 계수
        } else if (statName === '신속') {
          contribution = statValue / 58.23 * 1.98 // 속도→딜증 변환 (돌격대장 등 연동)
        } else {
          contribution = statValue * coeff / 10000000
        }
        bangleBreakdown.push({ source: opt, value: contribution })
        bangleProduct *= (1 + contribution / 100)
      }
      continue
    }

    // 특수효과 옵션
    let matched = false
    for (const [pattern, point] of BANGLE_ADDON_PATTERNS) {
      if (pattern.test(opt)) {
        const mult = point / 10000
        bangleBreakdown.push({ source: opt, value: mult * 100 })
        bangleProduct *= (1 + mult)
        matched = true
        break
      }
    }
    if (!matched) {
      // 매칭 안 되는 옵션은 퍼센트 추출 시도
      const pctMatch = opt.match(/(\d+\.?\d+)%/)
      if (pctMatch) {
        bangleBreakdown.push({ source: opt, value: parseFloat(pctMatch[1]) })
      }
    }
  }
  const bangleTotal = (bangleProduct - 1) * 100

  // ─── 5. 각인 총합 효율 (곱연산) ───
  // LOPEC ABILITY_ATTACK 테이블 직접 조회
  // key = 20 × stoneLevel + engravingLevel + gradeOffset (유물=9, 전설=5)
  // value = point → multiplier = point / 10000 + 1
  const engBreakdown: BreakdownItem[] = []
  let engProduct = 1
  for (const eng of engraving) {
    const table = ABILITY_ATTACK[eng.name]
    if (!table) continue

    const gradeOffset = GRADE_OFFSET[eng.grade as keyof typeof GRADE_OFFSET] ?? 9
    const key = String(20 * eng.stoneLevel + eng.level + gradeOffset)
    const point = table[key]
    if (point === undefined) continue

    const multiplier = point / 10000
    engBreakdown.push({ source: `${eng.name} x${eng.level}`, value: multiplier * 100 })
    engProduct *= (1 + multiplier)
  }
  const engTotal = (engProduct - 1) * 100

  // ─── 6. 메인노드 효율 ───
  // 데이터: src/config/tables/main-nodes.ts (MAIN_NODE_DEFS)
  // 알고리즘: 노드 type별로 분기 (speed_based / flat / crit_overflow)
  const mainNode = arkPassive.evolution.nodes.find(n => n.tier === 5)
  const { total: mainNodeTotal, breakdown: mainNodeBreakdown } = mainNode
    ? calcMainNode(mainNode.name, mainNode.level, {
        atkSpeed: totalAtkSpeed,
        moveSpeed: totalMoveSpeed,
        critRate: critRateTotal,
      })
    : { total: 0, breakdown: [] as BreakdownItem[] }

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

// ===================================================================
// 메인노드 효율 계산 헬퍼
// ===================================================================

/**
 * 메인노드(5티어 진화) 효율 계산
 *
 * MAIN_NODE_DEFS 테이블에서 노드 정의를 조회하고 type에 따라 분기 계산합니다.
 * 새 노드 type이 필요하면 src/config/tables/main-nodes.ts에 정의 추가 후
 * 이 함수에 분기 추가가 필요합니다.
 *
 * @param name - 노드명 (예: "음속 돌파")
 * @param level - 노드 레벨 (1~2)
 * @param ctx - 계산 컨텍스트 (현재 공/이속, 치적)
 */
function calcMainNode(
  name: string,
  level: number,
  ctx: { atkSpeed: number; moveSpeed: number; critRate: number },
): { total: number; breakdown: BreakdownItem[] } {
  const def = MAIN_NODE_DEFS[name]
  if (!def) {
    return { total: 0, breakdown: [{ source: `${name} (지원 안 함)`, value: 0 }] }
  }

  const breakdown: BreakdownItem[] = []
  let total = 0

  if (def.type === 'speed_based') {
    const params = def.levels[level]
    if (!params) return { total: 0, breakdown }
    const i = Math.min(ctx.atkSpeed, 40) * params.under + Math.min(ctx.moveSpeed, 40) * params.under
    const o = Math.max(0, ctx.atkSpeed - 40) * params.over + Math.max(0, ctx.moveSpeed - 40) * params.over
    const bonus = (ctx.atkSpeed > 40 && ctx.moveSpeed > 40) ? params.bothBonus : 0
    total = Math.min(Math.floor((i + bonus + o) * 100) / 100, params.cap)
    breakdown.push({ source: `${name} Lv.${level}`, value: total })
    breakdown.push({ source: '상한', value: params.cap })
  } else if (def.type === 'flat') {
    const cap = def.levels[level]
    if (cap === undefined) return { total: 0, breakdown }
    total = cap
    breakdown.push({ source: `${name} Lv.${level}`, value: cap })
    breakdown.push({ source: '상한', value: cap })
  } else if (def.type === 'crit_overflow') {
    const params = def.levels[level]
    if (!params) return { total: 0, breakdown }
    const overflow = Math.max(0, ctx.critRate - 80) * params.overflow
    total = Math.min(params.base + overflow, params.cap)
    breakdown.push({ source: `${name} Lv.${level}`, value: total })
    breakdown.push({ source: '상한', value: params.cap })
  }

  return { total, breakdown }
}
