/** @file 캐릭터 관련 타입 정의 */

export interface CharacterProfile {
  name: string
  server: string
  job: string
  jobClass: string
  itemLevel: number
  combatLevel: number
  guildName: string | null
  title: string | null
  imageUrl: string | null
}

export interface CharacterStats {
  critical: number
  specialization: number
  domination: number
  swiftness: number
  endurance: number
  expertise: number
}

export interface EquipmentItem {
  type: string
  name: string
  icon: string
  grade: string
  level: number
  quality: number
  tooltip: string
}

export interface GemItem {
  name: string
  icon: string
  grade: string
  level: number
  effect: string
}

export interface CardItem {
  name: string
  icon: string
  awakeCount: number
}

export interface CardSet {
  name: string
  cards: CardItem[]
  effect: string
}

export interface SkillItem {
  name: string
  icon: string
  level: number
  tripods: { name: string; level: number }[]
  rune: { name: string; icon: string; grade: string } | null
}

export interface CollectibleItem {
  type: string
  point: number
  maxPoint: number
}

/** 캐릭터 전체 데이터 */
export interface CharacterData {
  profile: CharacterProfile
  stats: CharacterStats
  equipment: EquipmentItem[]
  gems: GemItem[]
  cards: CardSet[]
  skills: SkillItem[]
  collectibles: CollectibleItem[]
}
