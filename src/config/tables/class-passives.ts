/**
 * @file 직업 각인 패시브 효과 (54개)
 * @category class-passive
 * @domain 직업 각인
 * @source LOPEC JS Module 49295 (chunks/7119-e52ea2ee16f92d50.js)
 * @lastVerified 2026-04-07
 * @lastGameUpdate 2026-04-07
 *
 * @ai-update-guide
 *   직업 각인 밸런스 패치 시 이 파일을 검토하세요.
 *   - 기존 각인 수치 변경: 해당 항목의 critRate/critDmg/atkSpeed/moveSpeed 수정
 *   - 새 각인 추가: CLASS_PASSIVES에 항목 추가
 *   - 속도 기반 특수 공식 (질풍노도 등): 함수 형태 사용
 *   - 효과 없는 각인 (서포터): 모두 0으로 설정
 *
 * @ai-search-keywords 직업각인, 클래스각인, 패시브, 질풍노도, 빛의기사, 황제의칙령
 */

// ===================================================================
// 타입 정의
// ===================================================================

export interface ClassPassiveEffect {
  /** 치적 보너스 (% 또는 이속 기반 함수) */
  critRate: number | ((moveSpeed: number) => number)
  /** 치피 보너스 (% 또는 공속 기반 함수) */
  critDmg: number | ((atkSpeed: number) => number)
  /** 공격 속도 보너스 (%) */
  atkSpeed: number
  /** 이동 속도 보너스 (%) */
  moveSpeed: number
}

// ===================================================================
// 직업 각인 데이터
// ===================================================================

export const CLASS_PASSIVES: Record<string, ClassPassiveEffect> = {
  // ── 워리어 계열 ──

  /** @gameKey 고독한 기사 @class 건랜서 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '고독한 기사':     { critRate: 15, critDmg: 45, atkSpeed: 0, moveSpeed: 0 },

  /** @gameKey 전투 태세 @class 건랜서 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '전투 태세':       { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },

  /** @gameKey 광기 @class 버서커 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '광기':           { critRate: 30, critDmg: 0, atkSpeed: 15, moveSpeed: 15 },

  /** @gameKey 광전사의 비기 @class 버서커 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '광전사의 비기':   { critRate: 30, critDmg: 0, atkSpeed: 20, moveSpeed: 20 },

  /** @gameKey 분노의 망치 @class 디스트로이어 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '분노의 망치':     { critRate: 18, critDmg: 51, atkSpeed: 0, moveSpeed: 0 },

  /** @gameKey 중력 수련 @class 디스트로이어 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '중력 수련':       { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },

  /** @gameKey 처단자 @class 슬레이어 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '처단자':         { critRate: 30, critDmg: 0, atkSpeed: 20, moveSpeed: 20 },

  /** @gameKey 포식자 @class 슬레이어 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '포식자':         { critRate: 30, critDmg: 51, atkSpeed: 20, moveSpeed: 20 },

  /** @gameKey 심판자 @class 홀리나이트 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '심판자':         { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 15 },

  /** @gameKey 빛의 기사 @class 발키리 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '빛의 기사':       { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 30 },

  // ── 무도가 계열 ──

  /** @gameKey 충격 단련 @class 인파이터 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '충격 단련':       { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },

  /** @gameKey 극의: 체술 @class 인파이터 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '극의: 체술':      { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },

  /** @gameKey 오의 강화 @class 배틀마스터 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '오의 강화':       { critRate: 30, critDmg: 0, atkSpeed: 8, moveSpeed: 16 },

  /** @gameKey 초심 @class 배틀마스터 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '초심':           { critRate: 30, critDmg: 0, atkSpeed: 8, moveSpeed: 16 },

  /** @gameKey 역천지체 @class 기공사 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '역천지체':       { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },

  /** @gameKey 세맥타통 @class 기공사 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '세맥타통':       { critRate: 0, critDmg: 75, atkSpeed: 0, moveSpeed: 0 },

  /** @gameKey 절제 @class 창술사 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '절제':           { critRate: 20, critDmg: 70, atkSpeed: 0, moveSpeed: 0 },

  /** @gameKey 절정 @class 창술사 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '절정':           { critRate: 20, critDmg: 70, atkSpeed: 15, moveSpeed: 15 },

  /** @gameKey 일격필살 @class 스트라이커 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '일격필살':       { critRate: 20, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },

  /** @gameKey 오의난무 @class 스트라이커 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '오의난무':       { critRate: 20, critDmg: 0, atkSpeed: 8, moveSpeed: 0 },

  /** @gameKey 권왕파천무 @class 브레이커 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '권왕파천무':     { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },

  /** @gameKey 수라의 길 @class 브레이커 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '수라의 길':       { critRate: 0, critDmg: 0, atkSpeed: 15, moveSpeed: 15 },

  // ── 헌터 계열 ──

  /** @gameKey 전술 탄환 @class 데빌헌터 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '전술 탄환':       { critRate: 34, critDmg: 14, atkSpeed: 0, moveSpeed: 0 },

  /** @gameKey 핸드거너 @class 데빌헌터 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '핸드거너':       { critRate: 10, critDmg: 0, atkSpeed: 8, moveSpeed: 8 },

  /** @gameKey 두 번째 동료 @class 호크아이 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '두 번째 동료':    { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 8 },

  /** @gameKey 죽음의 습격 @class 호크아이 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '죽음의 습격':     { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },

  /** @gameKey 포격 강화 @class 블래스터 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '포격 강화':       { critRate: 40, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },

  /** @gameKey 화력 강화 @class 블래스터 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '화력 강화':       { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },

  /** @gameKey 아르데타인의 기술 @class 스카우터 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '아르데타인의 기술': { critRate: 9, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },

  /** @gameKey 진화의 유산 @class 스카우터 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '진화의 유산':     { critRate: 0, critDmg: 0, atkSpeed: 15, moveSpeed: 30 },

  /** @gameKey 피스메이커 @class 건슬링어 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '피스메이커':      { critRate: 25, critDmg: 0, atkSpeed: 16, moveSpeed: 0 },

  /** @gameKey 사냥의 시간 @class 건슬링어 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '사냥의 시간':     { critRate: 55, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },

  // ── 마법사 계열 ──

  /** @gameKey 황후의 은총 @class 아르카나 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '황후의 은총':     { critRate: 10, critDmg: 0, atkSpeed: 19.2, moveSpeed: 30 },

  /** @gameKey 황제의 칙령 @class 아르카나 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '황제의 칙령':     { critRate: 10, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },

  /** @gameKey 넘치는 교감 @class 서머너 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '넘치는 교감':     { critRate: 11.8, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },

  /** @gameKey 상급 소환사 @class 서머너 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '상급 소환사':     { critRate: 27.8, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },

  /** @gameKey 진실된 용맹 @class 바드 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '진실된 용맹':     { critRate: 30, critDmg: 0, atkSpeed: 8, moveSpeed: 0 },

  /** @gameKey 점화 @class 소서리스 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '점화':           { critRate: 30, critDmg: 55, atkSpeed: 0, moveSpeed: 0 },

  /** @gameKey 환류 @class 소서리스 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '환류':           { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },

  // ── 암살자 계열 ──

  /** @gameKey 버스트 @class 블레이드 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '버스트':         { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 22.8 },

  /** @gameKey 잔재된 기운 @class 블레이드 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '잔재된 기운':     { critRate: 0, critDmg: 0, atkSpeed: 24.8, moveSpeed: 24.8 },

  /** @gameKey 멈출 수 없는 충동 @class 데모닉 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '멈출 수 없는 충동': { critRate: 30, critDmg: 0, atkSpeed: 0, moveSpeed: 20 },

  /** @gameKey 완벽한 억제 @class 데모닉 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '완벽한 억제':     { critRate: 10, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },

  /** @gameKey 달의 소리 @class 리퍼 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '달의 소리':       { critRate: 10, critDmg: 0, atkSpeed: 10, moveSpeed: 10 },

  /** @gameKey 갈증 @class 리퍼 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '갈증':           { critRate: 23, critDmg: 0, atkSpeed: 10, moveSpeed: 10 },

  /** @gameKey 만월의 집행자 @class 소울이터 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '만월의 집행자':   { critRate: 34, critDmg: 0, atkSpeed: 0, moveSpeed: 39.2 },

  /** @gameKey 그믐의 경계 @class 소울이터 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '그믐의 경계':     { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 19.2 },

  // ── 스페셜리스트 계열 ──

  /** @gameKey 회귀 @class 도화가 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '회귀':           { critRate: 25, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },

  /**
   * @gameKey 질풍노도
   * @class 기상술사
   * @category class-passive
   * @lastVerified 2026-04-07
   * @lastGameUpdate 2026-04-07
   * @formula 치적 = 10 + floor(0.3 × min(이속, 40) × 100) / 100
   *          치피 = floor(1.2 × min(공속, 40) × 100) / 100
   */
  '질풍노도':       {
    critRate: (ms) => 10 + Math.floor(0.3 * Math.min(ms, 40) * 100) / 100,
    critDmg: (as) => Math.floor(1.2 * Math.min(as, 40) * 100) / 100,
    atkSpeed: 12,
    moveSpeed: 12,
  },

  /** @gameKey 이슬비 @class 기상술사 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '이슬비':         { critRate: 10, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },

  /** @gameKey 야성 @class 환수사(브레이서) @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '야성':           { critRate: 30, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },

  /** @gameKey 환수 각성 @class 환수사(브레이서) @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '환수 각성':       { critRate: 0, critDmg: 60, atkSpeed: 20, moveSpeed: 20 },

  /** @gameKey 업화의 계승자 @class 소울워커 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '업화의 계승자':   { critRate: 20, critDmg: 0, atkSpeed: 15, moveSpeed: 15 },

  /** @gameKey 드레드 로어 @class 소울워커 @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '드레드 로어':     { critRate: 15, critDmg: 0, atkSpeed: 15, moveSpeed: 0 },

  // ── 서포터 (전투 스탯 없음) ──

  /** @gameKey 절실한 구원 @class 바드 @category support @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '절실한 구원':     { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },

  /** @gameKey 축복의 오라 @class 홀리나이트 @category support @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '축복의 오라':     { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },

  /** @gameKey 만개 @class 도화가 @category support @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '만개':           { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },

  /** @gameKey 해방자 @class 발키리 @category support @lastVerified 2026-04-07 @lastGameUpdate 2026-04-07 */
  '해방자':         { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0 },
}

// ===================================================================
// 헬퍼
// ===================================================================

/** 직업 각인의 치적 값 계산 (고정값 또는 함수) */
export function resolvePassiveCritRate(passive: ClassPassiveEffect, moveSpeed: number): number {
  return typeof passive.critRate === 'function' ? passive.critRate(moveSpeed) : passive.critRate
}

/** 직업 각인의 치피 값 계산 (고정값 또는 함수) */
export function resolvePassiveCritDmg(passive: ClassPassiveEffect, atkSpeed: number): number {
  return typeof passive.critDmg === 'function' ? passive.critDmg(atkSpeed) : passive.critDmg
}
