/**
 * @file 카드 타입 정의
 *
 * 캐릭터 장착 카드 + 카드 세트 효과를 구조화합니다.
 */

/**
 * 개별 카드 정보
 *
 * @property slot - 슬롯 번호 (0~5)
 * @property name - 카드명 (예: "샨디")
 * @property icon - 카드 이미지 URL (CDN)
 * @property grade - 등급 (전설, 영웅, 희귀, 고급, 일반)
 * @property awakeCount - 현재 각성 수 (0~5)
 * @property awakeTotal - 최대 각성 수 (5)
 */
export interface CardInfo {
  slot: number
  name: string
  icon: string
  grade: string
  awakeCount: number
  awakeTotal: number
}

/**
 * 카드 세트 효과 항목
 *
 * @property name - 효과 조건명 (예: "2세트", "12각성")
 * @property description - 효과 설명 (예: "암속성 피해 감소 +10.00%")
 */
export interface CardSetEffect {
  name: string
  description: string
}

/**
 * 카드 전체 데이터
 *
 * @property cards - 장착된 카드 6장
 * @property setName - 세트명 (예: "세상을 구하는 빛")
 * @property setSummary - 세트 요약 (예: "세상을 구하는 빛 30각")
 * @property setEffects - 세트 효과 목록
 */
export interface CardData {
  cards: CardInfo[]
  setName: string
  setSummary: string
  setEffects: CardSetEffect[]
}
