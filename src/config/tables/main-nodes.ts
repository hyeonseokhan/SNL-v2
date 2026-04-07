/**
 * @file 메인노드 (5티어 진화 노드) 효율 정의
 * @category main-node
 * @domain 메인노드
 * @source LOPEC (lopec.kr) JS 번들 (chunks/952-d89e260f5cc669f2.js) 역추적
 * @lastVerified 2026-04-07
 * @lastGameUpdate 2026-04-07
 *
 * @ai-update-guide
 *   캐릭터 밸런스 패치 시 이 파일을 검토하세요.
 *   - 기존 노드 수치 변경: MAIN_NODE_DEFS의 levels 값만 수정
 *   - 새 노드 추가: MAIN_NODE_DEFS에 항목 추가 + type 결정
 *   - 노드 타입 (type):
 *     * speed_based: 공/이속 기반 (예: 음속 돌파)
 *     * flat: 고정값 (예: 입식 타격가, 인파이팅)
 *     * crit_overflow: 치적 80% cap + 초과분 진피 (예: 뭉툭한 가시)
 *   - 새 type이 필요하면 사용자에게 알리고 알고리즘(main-node-calculator) 추가 요청
 *
 * @ai-search-keywords 메인노드, 진화, 5티어, 음속돌파, 입식타격가, 뭉툭한가시, 인파이팅
 */

// ===================================================================
// 타입 정의
// ===================================================================

/** 속도 기반 노드 (예: 음속 돌파) */
export interface SpeedBasedLevelDef {
  /** 40% 이하 구간 계수 */
  under: number
  /** 양쪽 40% 초과 보너스 */
  bothBonus: number
  /** 40% 초과 구간 계수 */
  over: number
  /** 최대치 (cap) */
  cap: number
}

/** 치적 cap 초과 노드 (예: 뭉툭한 가시) */
export interface CritOverflowLevelDef {
  /** 기본 진피 % */
  base: number
  /** 치적 80% 초과분 × 계수 */
  overflow: number
  /** 최대치 (cap) */
  cap: number
}

export type MainNodeDef =
  | { type: 'speed_based'; levels: Record<number, SpeedBasedLevelDef> }
  | { type: 'flat'; levels: Record<number, number> }
  | { type: 'crit_overflow'; levels: Record<number, CritOverflowLevelDef> }

// ===================================================================
// 메인노드 데이터
// ===================================================================

export const MAIN_NODE_DEFS: Record<string, MainNodeDef> = {
  /**
   * @gameKey 음속 돌파
   * @class 기상술사
   * @category main-node
   * @tier 5
   * @lastVerified 2026-04-07
   * @lastGameUpdate 2026-04-07
   * @formula i = under × min(speed, 40), o = over × max(0, speed - 40)
   *          total = min(i_atk + i_move + bonus + o_atk + o_move, cap)
   */
  '음속 돌파': {
    type: 'speed_based',
    levels: {
      1: { under: 0.05, bothBonus: 4, over: 0.15, cap: 12 },
      2: { under: 0.10, bothBonus: 8, over: 0.30, cap: 24 },
    },
  },

  /**
   * @gameKey 입식 타격가
   * @class 발키리
   * @category main-node
   * @tier 5
   * @lastVerified 2026-04-07
   * @lastGameUpdate 2026-04-07
   */
  '입식 타격가': {
    type: 'flat',
    levels: { 1: 10.5, 2: 21 },
  },

  /**
   * @gameKey 인파이팅
   * @class 브레이커
   * @category main-node
   * @tier 5
   * @lastVerified 2026-04-07
   * @lastGameUpdate 2026-04-07
   */
  '인파이팅': {
    type: 'flat',
    levels: { 1: 9, 2: 18 },
  },

  /**
   * @gameKey 뭉툭한 가시
   * @class 아르카나, 브레이커
   * @category main-node
   * @tier 5
   * @lastVerified 2026-04-07
   * @lastGameUpdate 2026-04-07
   * @formula min(base + max(0, critRate - 80) × overflow, cap)
   */
  '뭉툭한 가시': {
    type: 'crit_overflow',
    levels: {
      1: { base: 7.5, overflow: 1.25, cap: 52.5 },
      2: { base: 15.0, overflow: 1.5, cap: 75 },
    },
  },
}
