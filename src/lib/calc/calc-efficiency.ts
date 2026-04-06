/**
 * @file 효율 분석 계산 엔진
 *
 * CharData를 입력받아 6가지 효율 지표를 계산합니다.
 * LOPEC (lopec.kr) 계산 로직 기반.
 */

import type { CharData } from '@/types/character'
import { ABILITY_ATTACK, GRADE_OFFSET } from '@/config/efficiency-tables'

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
 * 직업 각인 패시브 효과
 *
 * LOPEC Module 49295에서 추출한 전체 54개 직업 각인 데이터.
 * critRate/critDmg: 고정값 또는 속도 기반 계산 함수
 * atkSpeed/moveSpeed: 고정 % 보너스
 */
interface ClassPassiveEffect {
  critRate: number | ((moveSpeed: number) => number)
  critDmg: number | ((atkSpeed: number) => number)
  atkSpeed: number
  moveSpeed: number
}

/** LOPEC 기준 전체 직업 각인 패시브 테이블 */
const CLASS_PASSIVE: Record<string, ClassPassiveEffect> = {
  // ── 워리어 계열 ──
  '고독한 기사':     { critRate: 15, critDmg: 45, atkSpeed: 0, moveSpeed: 0 },
  '전투 태세':       { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },
  '광기':           { critRate: 30, critDmg: 0, atkSpeed: 15, moveSpeed: 15 },
  '광전사의 비기':   { critRate: 30, critDmg: 0, atkSpeed: 20, moveSpeed: 20 },
  '분노의 망치':     { critRate: 18, critDmg: 51, atkSpeed: 0, moveSpeed: 0 },
  '중력 수련':       { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },
  '처단자':         { critRate: 30, critDmg: 0, atkSpeed: 20, moveSpeed: 20 },
  '포식자':         { critRate: 30, critDmg: 51, atkSpeed: 20, moveSpeed: 20 },
  '심판자':         { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 15 },
  '빛의 기사':       { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 30 },

  // ── 무도가 계열 ──
  '충격 단련':       { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },
  '극의: 체술':      { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },
  '오의 강화':       { critRate: 30, critDmg: 0, atkSpeed: 8, moveSpeed: 16 },
  '초심':           { critRate: 30, critDmg: 0, atkSpeed: 8, moveSpeed: 16 },
  '역천지체':       { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },
  '세맥타통':       { critRate: 0, critDmg: 75, atkSpeed: 0, moveSpeed: 0 },
  '절제':           { critRate: 20, critDmg: 70, atkSpeed: 0, moveSpeed: 0 },
  '절정':           { critRate: 20, critDmg: 70, atkSpeed: 15, moveSpeed: 15 },
  '일격필살':       { critRate: 20, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },
  '오의난무':       { critRate: 20, critDmg: 0, atkSpeed: 8, moveSpeed: 0 },
  '권왕파천무':     { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },
  '수라의 길':       { critRate: 0, critDmg: 0, atkSpeed: 15, moveSpeed: 15 },

  // ── 헌터 계열 ──
  '전술 탄환':       { critRate: 34, critDmg: 14, atkSpeed: 0, moveSpeed: 0 },
  '핸드거너':       { critRate: 10, critDmg: 0, atkSpeed: 8, moveSpeed: 8 },
  '두 번째 동료':    { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 8 },
  '죽음의 습격':     { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },
  '포격 강화':       { critRate: 40, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },
  '화력 강화':       { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },
  '아르데타인의 기술': { critRate: 9, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },
  '진화의 유산':     { critRate: 0, critDmg: 0, atkSpeed: 15, moveSpeed: 30 },
  '피스메이커':      { critRate: 25, critDmg: 0, atkSpeed: 16, moveSpeed: 0 },
  '사냥의 시간':     { critRate: 55, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },

  // ── 마법사 계열 ──
  '황후의 은총':     { critRate: 10, critDmg: 0, atkSpeed: 19.2, moveSpeed: 30 },
  '황제의 칙령':     { critRate: 10, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },
  '넘치는 교감':     { critRate: 11.8, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },
  '상급 소환사':     { critRate: 27.8, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },
  '진실된 용맹':     { critRate: 30, critDmg: 0, atkSpeed: 8, moveSpeed: 0 },
  '점화':           { critRate: 30, critDmg: 55, atkSpeed: 0, moveSpeed: 0 },
  '환류':           { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },

  // ── 암살자 계열 ──
  '버스트':         { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 22.8 },
  '잔재된 기운':     { critRate: 0, critDmg: 0, atkSpeed: 24.8, moveSpeed: 24.8 },
  '멈출 수 없는 충동': { critRate: 30, critDmg: 0, atkSpeed: 0, moveSpeed: 20 },
  '완벽한 억제':     { critRate: 10, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },
  '달의 소리':       { critRate: 10, critDmg: 0, atkSpeed: 10, moveSpeed: 10 },
  '갈증':           { critRate: 23, critDmg: 0, atkSpeed: 10, moveSpeed: 10 },
  '만월의 집행자':   { critRate: 34, critDmg: 0, atkSpeed: 0, moveSpeed: 39.2 },
  '그믐의 경계':     { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 19.2 },

  // ── 스페셜리스트 계열 ──
  '회귀':           { critRate: 25, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },
  // 질풍노도는 속도 기반 특수 계산
  '질풍노도':       {
    critRate: (ms) => 10 + Math.floor(0.3 * Math.min(ms, 40) * 100) / 100,
    critDmg: (as) => Math.floor(1.2 * Math.min(as, 40) * 100) / 100,
    atkSpeed: 12,
    moveSpeed: 12,
  },
  '이슬비':         { critRate: 10, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },
  '야성':           { critRate: 30, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },
  '환수 각성':       { critRate: 0, critDmg: 60, atkSpeed: 20, moveSpeed: 20 },
  '업화의 계승자':   { critRate: 20, critDmg: 0, atkSpeed: 15, moveSpeed: 15 },
  '드레드 로어':     { critRate: 15, critDmg: 0, atkSpeed: 15, moveSpeed: 0 },

  // ── 서포트 (전투 스탯 없음) ──
  '절실한 구원':     { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },
  '축복의 오라':     { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },
  '만개':           { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },
  '해방자':         { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },
}

/** 캐릭터 secondClass(직업 각인)에서 패시브 효과 조회 */
function getClassPassive(secondClass: string): ClassPassiveEffect | null {
  return CLASS_PASSIVE[secondClass] ?? null
}

/** 직업 각인의 치적 값 계산 (고정값 또는 함수) */
function resolvePassiveCritRate(passive: ClassPassiveEffect, moveSpeed: number): number {
  return typeof passive.critRate === 'function' ? passive.critRate(moveSpeed) : passive.critRate
}

/** 직업 각인의 치피 값 계산 (고정값 또는 함수) */
function resolvePassiveCritDmg(passive: ClassPassiveEffect, atkSpeed: number): number {
  return typeof passive.critDmg === 'function' ? passive.critDmg(atkSpeed) : passive.critDmg
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
  // 지원 클래스: 기상술사(음속 돌파), 발키리(입식 타격가), 브레이커(인파이팅)
  const mainNode = arkPassive.evolution.nodes.find(n => n.tier === 5)
  const mainNodeBreakdown: BreakdownItem[] = []
  let mainNodeTotal = 0

  if (mainNode) {
    const lv = mainNode.level

    if (mainNode.name === '음속 돌파') {
      // LOPEC 공식 (Lv별 계수 다름):
      // Lv1: under=0.05, both bonus=4,  over=0.15, cap=12
      // Lv2: under=0.10, both bonus=8,  over=0.30, cap=24
      const params = lv === 1
        ? { under: 0.05, both: 4, over: 0.15, cap: 12 }
        : { under: 0.10, both: 8, over: 0.30, cap: 24 }
      const as = totalAtkSpeed
      const ms = totalMoveSpeed
      const i = Math.min(as, 40) * params.under + Math.min(ms, 40) * params.under
      const o = Math.max(0, as - 40) * params.over + Math.max(0, ms - 40) * params.over
      const bonus = (as > 40 && ms > 40) ? params.both : 0
      mainNodeTotal = Math.min(Math.floor((i + bonus + o) * 100) / 100, params.cap)
      mainNodeBreakdown.push({ source: `${mainNode.name} Lv.${lv}`, value: mainNodeTotal })
      mainNodeBreakdown.push({ source: '상한', value: params.cap })
    } else if (mainNode.name === '입식 타격가') {
      // 발키리: 고정값
      const cap = lv === 1 ? 10.5 : 21
      mainNodeTotal = cap
      mainNodeBreakdown.push({ source: `${mainNode.name} Lv.${lv}`, value: cap })
      mainNodeBreakdown.push({ source: '상한', value: cap })
    } else if (mainNode.name === '인파이팅') {
      // 브레이커: 고정값
      const cap = lv === 1 ? 9 : 18
      mainNodeTotal = cap
      mainNodeBreakdown.push({ source: `${mainNode.name} Lv.${lv}`, value: cap })
      mainNodeBreakdown.push({ source: '상한', value: cap })
    } else {
      mainNodeBreakdown.push({ source: `${mainNode.name} (지원 안 함)`, value: 0 })
    }
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
