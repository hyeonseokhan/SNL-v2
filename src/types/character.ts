/**
 * @file 캐릭터 분석 데이터 타입 정의
 * 로스트아크 공식 API 응답 파서 출력 기반
 */

// ===================================================================
// 아크패시브
// ===================================================================

export interface ArkPassiveNode {
  name: string
  level: number
  tier: number
  icon: string
  tooltip: string
}

export interface ArkPassiveSection {
  points: number
  karmaRank: number
  karmaLevel: number
  nodes: ArkPassiveNode[]
}

// ===================================================================
// 장비 아이템 (개별)
// ===================================================================

export interface EquipItem {
  type: string
  name: string
  icon: string
  grade: string
  quality: number
  level: number
  refine: number
  option: string[]
}

// ===================================================================
// 장비 / 악세서리 (구조화)
// ===================================================================

export interface WeaponInfo {
  name: string
  quality: number
  refine: number
  grade: string
  icon: string
}

export interface AccessoryInfo {
  name: string
  icon: string
  grade: string
  quality: number
  option: string[]
}

export interface NamedItem {
  name: string
  icon: string
  grade: string
}

export interface ArmoryData {
  /** 방어구 6종 (머리/어깨/상의/하의/장갑/무기) */
  equipList: EquipItem[]
  equipment: {
    weapon: WeaponInfo
  }
  accessory: {
    necklace: AccessoryInfo
    earing1: AccessoryInfo
    earing2: AccessoryInfo
    ring1: AccessoryInfo
    ring2: AccessoryInfo
    bangle: AccessoryInfo & { option: string[] }
    stone: NamedItem & { option: string[] }
    compass: NamedItem
    charm: NamedItem
    orb: NamedItem
  }
}

// ===================================================================
// 보석
// ===================================================================

export interface GemData {
  level: number
  name: string
  icon: string
  grade: string
  type: string
  effect: string
}

// ===================================================================
// 각인
// ===================================================================

export interface EngravingData {
  name: string
  level: number
  icon: string
}

// card는 문자열로 표현 (예: "세상을 구하는 빛 30각")

// ===================================================================
// 아크 그리드
// ===================================================================

export interface ArkGridSlot {
  name: string
  grade: string
  type: string
}

export interface ArkGridEffect {
  name: string
  description: string
}

export interface ArkGridData {
  slots: ArkGridSlot[]
  effects: ArkGridEffect[]
}

// ===================================================================
// 스킬
// ===================================================================

export interface SkillTripod {
  name: string
  tier: number
  tooltip: string
}

export interface SkillData {
  name: string
  level: number
  tripods: SkillTripod[]
}

// ===================================================================
// 메인 캐릭터 데이터
// ===================================================================

export interface CharData {
  profile: {
    class: string
    secondClass: string
    itemLevel: number
    characterName: string
    serverName: string
    characterLevel: number
    guildName: string
    title: string
    titleIcon: string
    characterImage: string | null
    expeditionLevel: number
    pvpGrade: string
    townLevel: number
    townName: string
  }
  stats: {
    critical: number
    haste: number
    special: number
    suppress: number
    patience: number
    expert: number
    combatPower: number
    attack: number
  }
  armory: ArmoryData
  arkPassive: {
    evolution: ArkPassiveSection
    enlightenment: ArkPassiveSection
    leap: ArkPassiveSection
  }
  engraving: EngravingData[]
  gem: GemData[]
  card: string
  arkGrid: ArkGridData
  skills: SkillData[]
  uniqueKey: string
}
