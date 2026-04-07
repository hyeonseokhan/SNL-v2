/**
 * @file 각인 효율 데이터
 * @category engraving
 * @domain 일반 각인
 * @source LOPEC constants.json (ability_attack)
 * @lastVerified 2026-04-07
 * @lastGameUpdate 2026-04-07
 *
 * @ai-update-guide
 *   각인 밸런스 패치 시 이 파일을 검토하세요.
 *   - 기존 각인 수치 변경: ABILITY_ATTACK 테이블의 해당 key 값 수정
 *   - 새 각인 추가: ABILITY_ATTACK에 항목 추가
 *   - key 공식: 20 × stoneLevel + level + gradeOffset (유물=9, 전설=5)
 *   - point / 10000 + 1 = 전투력 multiplier
 *
 * @ai-search-keywords 각인, 효율, 돌격대장, 원한, 아드레날린, 타격의대가, 질량증가
 */

// 기존 efficiency-tables.ts에서 re-export (점진적 마이그레이션)
export {
  ABILITY_ATTACK,
  GRADE_OFFSET,
  ENGRAVING_FINAL_DMG,
  STONE_BONUS,
  ENGRAVING_EFFICIENCY,
} from '../efficiency-tables'
