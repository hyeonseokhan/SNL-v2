/**
 * @file 장비 / 악세서리 타입 정의
 *
 * 방어구 6종, 악세서리 5종, 팔찌, 어빌리티 스톤, 보주 등
 * 장착 장비에 대한 구조화된 타입입니다.
 */

/**
 * 방어구/무기 장비 아이템
 *
 * 머리/어깨/상의/하의/장갑/무기 6종에 해당합니다.
 *
 * @property type - 장비 부위 (예: "투구", "무기")
 * @property name - 아이템명 (예: "+17 운명의 전율 머리장식")
 * @property icon - 아이콘 URL
 * @property grade - 등급 (예: "고대", "유물")
 * @property quality - 품질 (0~100, -1이면 없음)
 * @property itemLevel - 아이템 레벨 (예: 1760)
 * @property tier - 티어 (예: 4)
 * @property refine - 재련 수치 (예: 17)
 * @property option - 옵션 문자열 배열 (예: ["체력 +23481"])
 * @property tooltipRaw - 툴팁 원본 JSON 문자열
 */
export interface EquipItem {
  type: string
  name: string
  icon: string
  grade: string
  quality: number
  itemLevel: number
  tier: number
  refine: number
  option: string[]
  tooltipRaw: string
}

/**
 * 무기 요약 정보
 *
 * 프로필 영역에서 무기 정보를 간략히 표시할 때 사용합니다.
 *
 * @property name - 무기명
 * @property quality - 품질
 * @property refine - 재련 수치
 * @property grade - 등급
 * @property icon - 아이콘 URL
 */
export interface WeaponInfo {
  name: string
  quality: number
  refine: number
  grade: string
  icon: string
}

/**
 * 악세서리 아이템 (목걸이, 귀걸이, 반지)
 *
 * @property name - 악세서리명
 * @property icon - 아이콘 URL
 * @property grade - 등급
 * @property quality - 품질
 * @property tier - 티어
 * @property enlightenment - 깨달음 수치
 * @property option - 연마 옵션 문자열 배열 (예: ["상 공격력 +1.55%"])
 * @property tooltipRaw - 툴팁 원본 JSON 문자열
 */
export interface AccessoryInfo {
  name: string
  icon: string
  grade: string
  quality: number
  tier: number
  enlightenment: number
  option: string[]
  tooltipRaw: string
}

/**
 * 이름 + 아이콘만 있는 장비 (보주, 나침반, 부적 등)
 *
 * @property name - 아이템명
 * @property icon - 아이콘 URL
 * @property grade - 등급
 * @property tier - 티어
 * @property tooltipRaw - 툴팁 원본 JSON 문자열
 */
export interface NamedItem {
  name: string
  icon: string
  grade: string
  tier: number
  tooltipRaw: string
}

/**
 * 어빌리티 스톤 각인 정보
 *
 * @property name - 각인명 (예: "돌격대장")
 * @property level - 각인 레벨 (0~10)
 * @property isNegative - 감소 각인 여부 (true: 빨간색 디버프)
 */
export interface StoneEngraving {
  name: string
  level: number
  isNegative: boolean
}

/**
 * 장비 전체 구조 (방어구 + 악세서리)
 *
 * @property equipList - 방어구 6종 배열
 * @property equipment.weapon - 무기 요약 정보
 * @property accessory - 악세서리/팔찌/스톤/보주 등
 */
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
    stone: NamedItem & { option: string[]; engravings: StoneEngraving[]; levelBonus: string }
    compass: NamedItem
    charm: NamedItem
    orb: NamedItem & { paradisePower: number }
  }
}
