/**
 * @file 아크패시브 / 아크그리드 타입 정의
 *
 * 아크패시브(진화/깨달음/도약) 노드 정보와
 * 아크그리드(젬/코어) 슬롯 및 효과를 구조화합니다.
 */

// ===================================================================
// 아크패시브
// ===================================================================

/**
 * 아크패시브 노드 (개별 스킬 노드)
 *
 * @property name - 노드명 (예: "예리한 감각", "기민함")
 * @property level - 현재 레벨
 * @property tier - 노드 티어
 * @property icon - 아이콘 URL
 * @property tooltip - 효과 설명 (HTML 포함)
 */
export interface ArkPassiveNode {
  name: string
  level: number
  tier: number
  icon: string
  tooltip: string
}

/**
 * 아크패시브 섹션 (진화/깨달음/도약 중 하나)
 *
 * @property points - 투자된 포인트 합계
 * @property karmaRank - 카르마 등급
 * @property karmaLevel - 카르마 레벨
 * @property nodes - 해당 섹션의 노드 목록
 */
export interface ArkPassiveSection {
  points: number
  karmaRank: number
  karmaLevel: number
  nodes: ArkPassiveNode[]
}

// ===================================================================
// 아크그리드
// ===================================================================

/**
 * 아크그리드 슬롯 (장착된 젬/코어)
 *
 * @property name - 슬롯명
 * @property grade - 등급 (예: "고대", "유물")
 * @property type - 슬롯 타입
 */
export interface ArkGridSlot {
  name: string
  grade: string
  type: string
  icon: string
  point: number
  /** 코어 타입 (예: "혼돈 - 달") */
  coreType: string
  /** 코어 공급 의지력 (HTML 포함) */
  coreWillpower: string
  /** 코어 옵션 — 포인트별 효과 (HTML FONT COLOR 태그 포함) */
  coreOptions: string
}

/**
 * 아크그리드 효과
 *
 * @property name - 효과명 (예: "공격력", "추가 피해")
 * @property level - 효과 레벨
 * @property description - 효과 설명 (HTML FONT COLOR 태그 포함)
 */
export interface ArkGridEffect {
  name: string
  level: number
  description: string
}

/**
 * 아크그리드 전체 데이터
 *
 * @property slots - 장착된 슬롯 목록
 * @property effects - 활성화된 효과 목록
 */
export interface ArkGridData {
  slots: ArkGridSlot[]
  effects: ArkGridEffect[]
}
