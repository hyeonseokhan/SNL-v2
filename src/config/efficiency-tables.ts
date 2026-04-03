/**
 * @file 효율 계산 상수 테이블
 *
 * LOPEC 시뮬레이터 역추적 기반.
 * 시뮬레이터 dropdown 옵션 + 효율 분석 계산 엔진에서 공통 사용합니다.
 * 상세 수치 출처: docs/EFFICIENCY-CONSTANTS.md
 */

// ===================================================================
// 스탯 변환
// ===================================================================

/** 치명 → 치적 변환 상수 (27.94 치명 = 1% 치적) */
export const CRIT_STAT_DIVISOR = 0.2794

/** 특화 → 딜증 변환 상수 */
export const SPEC_STAT_DIVISOR = 20.791

/** 신속 → 쿨감 변환 상수 */
export const HASTE_CDR_MULTIPLIER = 0.0214739

// ===================================================================
// 악세서리 연마 옵션
// ===================================================================

/**
 * 연마 옵션 효과 속성
 *
 * @property label - 표시명
 * @property tiers - [유물 하, 유물 중, 유물 상, 고대 상] 수치
 * @property property - 효율 계산에 사용되는 속성 키
 */
export interface PolishOption {
  label: string
  tiers: [number, number, number, number]
  property: string
  /** 표시용 단위 ('%' 또는 정수) */
  unit: '%' | 'flat'
}

/** 악세서리 연마 옵션 전체 목록 */
export const POLISH_OPTIONS: PolishOption[] = [
  { label: '추가 피해',         tiers: [0.025, 0.030, 0.035, 0.040], property: 'addDmg', unit: '%' },
  { label: '적에게 주는 피해',   tiers: [0.015, 0.020, 0.025, 0.030], property: 'finalDmg', unit: '%' },
  { label: '무기 공격력 %',     tiers: [0.008, 0.018, 0.030, 0.030], property: 'weaponAtkPer', unit: '%' },
  { label: '공격력 %',         tiers: [0.004, 0.0095, 0.0155, 0.0155], property: 'atkPer', unit: '%' },
  { label: '치명타 적중률',     tiers: [0.004, 0.0095, 0.0155, 0.0155], property: 'critRate', unit: '%' },
  { label: '치명타 피해',       tiers: [0.011, 0.024, 0.040, 0.040], property: 'critDmg', unit: '%' },
  { label: '무기 공격력',       tiers: [195, 480, 960, 960], property: 'weaponAtkPlus', unit: 'flat' },
  { label: '공격력',           tiers: [80, 195, 390, 390], property: 'atkPlus', unit: 'flat' },
]

/** 연마 등급 라벨 */
export const POLISH_TIER_LABELS = ['유물 하', '유물 중', '유물 상', '고대 상'] as const

// ===================================================================
// 보석 효과
// ===================================================================

/** 딜증 보석 — 레벨별 % (index 0 = Lv.1) */
export const GEM_DAMAGE_NORMAL = [3, 6, 9, 12, 15, 18, 21, 24, 30, 40]
export const GEM_DAMAGE_ATTACK_BONUS = [8, 12, 16, 20, 24, 28, 32, 36, 40, 44]

/** 쿨감 보석 — 레벨별 % */
export const GEM_COOLDOWN_NORMAL = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
export const GEM_COOLDOWN_ATTACK_BONUS = [6, 8, 10, 12, 14, 16, 18, 20, 22, 24]

// ===================================================================
// 각인 효과
// ===================================================================

/**
 * finalDmg 기본 진행 (대부분의 각인 공통)
 *
 * 등급별 레벨 진행: [Lv0, Lv1, Lv2, Lv3] 또는 [Lv0, Lv1, Lv2, Lv3, Lv4]
 */
export const ENGRAVING_FINAL_DMG = {
  영웅: [10.00, 10.75, 11.50, 12.25],
  전설: [13.00, 13.75, 14.50, 15.25],
  유물: [16.00, 16.75, 17.50, 18.25, 19.00],
}

/** 스톤 보너스 */
export const STONE_BONUS = {
  critRate: { 1: 3, 2: 3.75, 3: 5.25, 4: 6 },
  critDmg: { 1: 7.5, 2: 9.4, 3: 13.2, 4: 15 },
  adrenalineAtkPer: { 1: 2.88, 2: 3.6, 3: 4.98, 4: 5.7 },
  etherAtkPer: { 1: 2.7, 2: 3.51, 3: 4.86, 4: 5.4 },
  awakeningCdr: { 1: 0.06, 2: 0.075, 3: 0.105, 4: 0.12 },
}

/** 주요 각인 효율값 (유물 기준) */
export const ENGRAVING_EFFICIENCY: Record<string, { property: string; lv0: number; lv4: number }> = {
  '돌격대장':     { property: 'efficiency', lv0: 40, lv4: 48 },
  '원한':        { property: 'efficiency', lv0: 18, lv4: 21 },
  '바리케이드':   { property: 'efficiency', lv0: 14, lv4: 17 },
  '추진력':      { property: 'efficiency', lv0: 14, lv4: 17 },
  '저주받은 인형': { property: 'efficiency', lv0: 14, lv4: 17 },
  '안정된 상태':  { property: 'efficiency', lv0: 14, lv4: 17 },
  '달인의 저력':  { property: 'efficiency', lv0: 14, lv4: 17 },
  '질량 증가':    { property: 'efficiency', lv0: 16, lv4: 19 },
  '타격의 대가':  { property: 'normalEfficiency', lv0: 14, lv4: 17 },
  '속전속결':     { property: 'castingEfficiency', lv0: 18, lv4: 21 },
  '슈퍼 차지':    { property: 'chargeEfficiency', lv0: 18, lv4: 21 },
  '예리한 둔기':  { property: 'critDmg', lv0: 44, lv4: 52 },
  '정밀 단도':    { property: 'critRate', lv0: 18, lv4: 21 },
  '아드레날린':   { property: 'critRate', lv0: 14, lv4: 20 },
  '에테르 포식자': { property: 'atkPer', lv0: 11.34, lv4: 14.58 },
  '시선 집중':    { property: 'finalDmg', lv0: 16, lv4: 19 },
}

// ===================================================================
// 장비 품질/재련
// ===================================================================

/** 무기 품질 배율 (index = quality 0~100, 10단위) */
export const WEAPON_QUALITY_MULTIPLIER: Record<number, number> = {
  0: 1.1000, 10: 1.1020, 20: 1.1080, 30: 1.1180, 40: 1.1320,
  50: 1.1500, 60: 1.1720, 70: 1.1980, 80: 1.2280, 90: 1.2620, 100: 1.3000,
}

/** 레벨 배율 */
export const LEVEL_MULTIPLIER: Record<string, number> = {
  '55-59': 1.0895,
  '60-64': 1.1856,
  '65-69': 1.2397,
  '70': 1.2945,
}

// ===================================================================
// 아크패시브
// ===================================================================

/** 아크패시브 전투력 배율 계수 */
export const ARK_PASSIVE_COEFF = {
  evolution: 75,      // 75 × max(points - 40, 0) / 10000 + 1
  enlightenment: 70,  // min(70 × max(points, 0), 7000) / 10000 + 1
  leap: 20,           // 20 × max(points, 0) / 10000 + 1
}

/** 도약 보석 효과 배율 (points → multiplier) */
export const LEAP_GEM_MULTIPLIER: [number, number][] = [
  [70, 1.15], [68, 1.14], [66, 1.13], [64, 1.12],
  [62, 1.11], [60, 1.10], [50, 1.05], [40, 1.03],
]

/** 내실 포인트 옵션 */
export const ENLIGHTENMENT_POINT_OPTIONS = [
  { label: '없음', value: 0 },
  { label: '일반1', value: 3 },
  { label: '일반2', value: 6 },
  { label: '일반3', value: 9 },
  { label: '상급', value: 5 },
  { label: '상급+일반1', value: 8 },
  { label: '상급+일반2', value: 11 },
  { label: '상급+일반3', value: 14 },
]

// ===================================================================
// 기타
// ===================================================================

/** 에스더 무기 보너스 */
export const ESTHER_WEAPON_BONUS = 1.01

/** 회심 (진화 노드) 활성 시 critFinalDmg */
export const HOESIM_CRIT_FINAL_DMG = 1.12

/** 치명타 기본 피해 배율 */
export const BASE_CRIT_DAMAGE = 2.0
