/**
 * @file 로스트아크 등급 색상 중앙 관리
 *
 * 등급(고대, 유물, 전설, 영웅, 희귀, 고급, 일반)에 대한
 * 텍스트 색상, 배경 색상, HEX 값을 통합 관리합니다.
 */

/** 등급별 색상 정의 */
interface GradeColor {
  /** Tailwind 텍스트 클래스 (라이트 + 다크) */
  text: string
  /** HEX 색상값 (다크 모드 기준, 인라인 style용) */
  hex: string
}

/** 등급 색상 매핑 */
const GRADE_COLORS: Record<string, GradeColor> = {
  '고대': { text: 'text-[#7A5C1E] dark:text-[#E3C7A1]', hex: '#E3C7A1' },
  '유물': { text: 'text-[#C44A00] dark:text-[#FA5D00]', hex: '#FA5D00' },
  '전설': { text: 'text-[#9A7A00] dark:text-[#FFD200]', hex: '#FFD200' },
  '영웅': { text: 'text-purple-700 dark:text-purple-400', hex: '#a855f7' },
  '희귀': { text: 'text-blue-700 dark:text-blue-400', hex: '#60a5fa' },
  '고급': { text: 'text-green-700 dark:text-green-400', hex: '#4ade80' },
  '일반': { text: 'text-tx-caption', hex: '#9ca3af' },
}

/**
 * 등급명으로 Tailwind 텍스트 클래스를 반환합니다.
 *
 * @param grade - 등급명 (예: "유물", "전설")
 * @returns Tailwind 텍스트 클래스 (없으면 기본 body 색상)
 *
 * @example
 * gradeTextClass('유물') // → "text-[#C44A00] dark:text-[#FA5D00]"
 */
export function gradeTextClass(grade: string): string {
  return GRADE_COLORS[grade]?.text ?? 'text-tx-body'
}

/**
 * 등급 문자열을 포함하는 텍스트에서 등급을 찾아 색상 클래스를 반환합니다.
 * 장비 툴팁의 gradeType("고대 무기" 등)에서 등급을 추출할 때 사용합니다.
 *
 * @param gradeType - 등급이 포함된 문자열 (예: "고대 전율 무기")
 * @returns Tailwind 텍스트 클래스
 */
export function gradeTextClassFromType(gradeType: string): string {
  for (const [grade, color] of Object.entries(GRADE_COLORS)) {
    if (gradeType.includes(grade)) return color.text
  }
  return 'text-tx-body'
}

/**
 * 등급명으로 HEX 색상값을 반환합니다.
 *
 * @param grade - 등급명
 * @returns HEX 색상 문자열 (없으면 빈 문자열)
 */
export function gradeHex(grade: string): string {
  return GRADE_COLORS[grade]?.hex ?? ''
}
