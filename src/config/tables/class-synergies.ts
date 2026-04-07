/**
 * @file 클래스 시너지 데이터 (급소 노출 등)
 * @category class-synergy
 * @domain 클래스 시너지
 * @source 게임 내 정보
 * @lastVerified 2026-04-07
 * @lastGameUpdate 2026-04-07
 *
 * @ai-update-guide
 *   클래스 시너지 패치 시 이 파일을 검토하세요.
 *   - 클래스 고유 시너지 효과 (트라이포드 아닌 패시브)
 *   - 현재 LOPEC 효율표에는 포함되지 않으므로 사용처 없음 (참고용)
 *
 * @ai-search-keywords 시너지, 급소노출, 클래스 시너지
 */

export const CLASS_SYNERGIES: Record<string, { critRate?: number; critDmg?: number }> = {
  /** @gameKey 급소 노출 @class 기상술사 @lastVerified 2026-04-07 */
  '기상술사': { critRate: 10 },
}
