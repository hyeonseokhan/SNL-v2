/**
 * @file 보석 효과 데이터
 * @category gem
 * @domain 보석
 * @source LOPEC JS 역추적
 * @lastVerified 2026-04-07
 * @lastGameUpdate 2026-04-07
 *
 * @ai-update-guide
 *   보석 밸런스 패치 시 이 파일을 검토하세요.
 *   - 멸화/겁화: 딜증 보석
 *   - 홍염/작열: 쿨감 보석
 *   - 배열 인덱스 = 레벨 - 1 (0-indexed)
 *
 * @ai-search-keywords 보석, 멸화, 겁화, 홍염, 작열, 딜증, 쿨감
 */

export {
  GEM_DAMAGE_NORMAL,
  GEM_DAMAGE_ATTACK_BONUS,
  GEM_COOLDOWN_NORMAL,
  GEM_COOLDOWN_ATTACK_BONUS,
} from '../efficiency-tables'
