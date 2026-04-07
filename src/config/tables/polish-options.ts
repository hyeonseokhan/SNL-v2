/**
 * @file 악세서리 연마 옵션 데이터
 * @category polish
 * @domain 악세서리 연마
 * @source LOPEC constants.json
 * @lastVerified 2026-04-07
 * @lastGameUpdate 2026-04-07
 *
 * @ai-update-guide
 *   악세서리 연마 옵션 패치 시 이 파일을 검토하세요.
 *   - tiers 배열: [유물 하, 유물 중, 유물 상, 고대 상]
 *   - unit '%': 비율 (0.025 = 2.5%)
 *   - unit 'flat': 정수 (195, 480 등)
 *
 * @ai-search-keywords 악세서리, 연마, 추가피해, 적주피, 무기공격력, 치적, 치피
 */

export { POLISH_OPTIONS, POLISH_TIER_LABELS } from '../efficiency-tables'
export type { PolishOption } from '../efficiency-tables'
