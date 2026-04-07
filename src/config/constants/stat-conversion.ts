/**
 * @file 스탯 → 효율 변환 상수
 * @category constant
 * @domain 스탯 변환
 * @source LOPEC JS 역추적 + 로스트빌드 검증
 * @lastVerified 2026-04-07
 * @lastGameUpdate 2026-04-07
 *
 * @ai-update-guide
 *   로스트아크 게임 시스템 변경 시 이 파일을 수정합니다.
 *   - 치명/신속/특화 스탯 → 효율 % 변환 비율
 *   - 변환 공식: floor(stat / divisor) / 100
 *   - 게임 시스템 패치는 매우 드물게 발생합니다.
 *
 * @ai-search-keywords 스탯 변환, 치명, 신속, 특화, critStat, hasteStat
 */

/**
 * 치명 스탯 → 치적% 변환 분모
 * @gameKey 치명 변환 상수
 * @formula floor(critStat / 0.2794) / 100
 */
export const CRIT_STAT_DIVISOR = 0.2794

/**
 * 신속 스탯 → 속도% 변환 분모
 * @gameKey 신속 변환 상수
 * @formula floor(hasteStat / 0.5821) / 100
 */
export const HASTE_STAT_DIVISOR = 0.5821

/**
 * 신속 스탯 → 쿨감 변환 계수
 * @gameKey 신속 쿨감 계수
 * @formula 0.0214739 × hasteStat / 100
 */
export const HASTE_CDR_MULTIPLIER = 0.0214739

/**
 * 기본 공/이속 (게임 내 모든 캐릭터 공통)
 * @gameKey 기본 속도
 */
export const BASE_SPEED = 14
