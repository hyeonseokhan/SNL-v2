/**
 * @file 스킬 / 각인 / 보석 타입 정의
 *
 * 캐릭터의 전투 스킬, 각인 효과, 보석 정보를 구조화합니다.
 */

/**
 * 스킬 트라이포드 (스킬 강화 옵션)
 *
 * @property name - 트라이포드명 (예: "급소 노출")
 * @property tier - 트라이포드 티어 (1~3)
 * @property tooltip - 효과 설명 (HTML 포함 가능)
 */
export interface SkillTripod {
  name: string
  tier: number
  tooltip: string
}

/**
 * 전투 스킬 정보
 *
 * @property name - 스킬명 (예: "공간가르기")
 * @property level - 스킬 레벨
 * @property tripods - 장착된 트라이포드 목록
 */
export interface SkillData {
  name: string
  level: number
  tripods: SkillTripod[]
}

/**
 * 각인 효과 정보
 *
 * @property name - 각인명 (예: "돌격대장", "아드레날린")
 * @property level - 각인 레벨
 * @property icon - 각인 아이콘 URL
 */
export interface EngravingData {
  name: string
  level: number
  icon: string
}

/**
 * 보석 정보
 *
 * @property level - 보석 레벨 (1~10)
 * @property name - 보석명 (예: "9레벨 겁화의 보석")
 * @property icon - 보석 아이콘 URL
 * @property grade - 등급 (예: "유물", "전설")
 * @property type - 보석 종류 ("damage" = 겁화/딜증, "cooldown" = 작열/쿨감)
 * @property effect - 효과 설명 (예: "피해 40.00% 증가")
 * @property skillName - 적용 스킬명 (예: "몰아치기")
 * @property skillIcon - 스킬 아이콘 URL
 * @property option - 추가 효과 (예: "기본 공격력 1.00% 증가")
 */
export interface GemData {
  level: number
  name: string
  icon: string
  grade: string
  type: string
  effect: string
  skillName: string
  skillIcon: string
  option: string
}
