/**
 * @file 캐릭터 프로필 및 전투 스탯 타입 정의
 *
 * 로스트아크 공식 API의 ArmoryProfile, Stats 응답을 기반으로
 * 캐릭터의 기본 정보와 전투 특성을 구조화합니다.
 */

/**
 * 캐릭터 프로필 정보
 *
 * @property class - 직업명 (예: "기상술사")
 * @property secondClass - 2차 직업명 / 각인 (예: "질풍노도")
 * @property itemLevel - 아이템 레벨 (예: 1762.50)
 * @property characterName - 캐릭터명
 * @property serverName - 서버명 (예: "아브렐슈드")
 * @property characterLevel - 전투 레벨 (예: 70)
 * @property guildName - 길드명
 * @property title - 칭호
 * @property titleIcon - 칭호 아이콘 URL
 * @property characterImage - 캐릭터 이미지 URL (없으면 null)
 * @property expeditionLevel - 원정대 레벨
 * @property pvpGrade - PVP 등급 (없으면 "-")
 * @property townLevel - 영지 레벨
 * @property townName - 영지 이름
 */
export interface CharProfile {
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

/**
 * 전투 특성 스탯
 *
 * 로스트아크의 6대 전투 특성과 전투력/공격력을 포함합니다.
 *
 * @property critical - 치명 스탯
 * @property haste - 신속 스탯
 * @property special - 특화 스탯
 * @property suppress - 제압 스탯
 * @property patience - 인내 스탯
 * @property expert - 숙련 스탯
 * @property combatPower - 전투력
 * @property attack - 공격력
 */
export interface CharStats {
  critical: number
  haste: number
  special: number
  suppress: number
  patience: number
  expert: number
  combatPower: number
  attack: number
}
