/**
 * @file 캐릭터 데이터 타입 정의 (통합 진입점)
 *
 * 도메인별로 분리된 타입 파일들을 re-export하여
 * 기존 `import from '@/types/character'` 호환성을 유지합니다.
 *
 * 개별 도메인 타입이 필요한 경우 직접 import도 가능합니다:
 * @example
 * import type { EquipItem } from '@/types/equipment'
 * import type { SkillData } from '@/types/skill'
 */

// 프로필 & 스탯
export type { CharProfile, CharStats } from './profile'

// 장비 & 악세서리
export type {
  EquipItem,
  WeaponInfo,
  AccessoryInfo,
  NamedItem,
  StoneEngraving,
  ArmoryData,
} from './equipment'

// 스킬 & 각인 & 보석
export type { SkillTripod, SkillData, EngravingData, GemData } from './skill'

// 아크패시브 & 아크그리드
export type {
  ArkPassiveNode,
  ArkPassiveSection,
  ArkGridSlot,
  ArkGridEffect,
  ArkGridData,
} from './ark'

// ===================================================================
// 메인 캐릭터 데이터
// ===================================================================

import type { CharProfile, CharStats } from './profile'
import type { ArmoryData } from './equipment'
import type { EngravingData, GemData, SkillData } from './skill'
import type { ArkPassiveSection, ArkGridData } from './ark'

/**
 * 캐릭터 전체 데이터
 *
 * API 응답을 파싱한 최종 구조체로, 모든 탭/컴포넌트에서 사용됩니다.
 * 시뮬레이터에서는 이 타입의 사본을 수정하여 효율 분석에 전달합니다.
 *
 * @property profile - 캐릭터 기본 정보 (이름, 서버, 클래스 등)
 * @property stats - 전투 특성 (치명, 신속, 특화 등)
 * @property armory - 장비 전체 (방어구 + 악세서리)
 * @property arkPassive - 아크패시브 (진화/깨달음/도약)
 * @property engraving - 각인 목록
 * @property gem - 보석 목록
 * @property card - 카드 세트 설명 문자열
 * @property arkGrid - 아크그리드 (슬롯 + 효과)
 * @property skills - 전투 스킬 목록
 * @property uniqueKey - 캐릭터 고유 키 (캐릭터명)
 */
export interface CharData {
  profile: CharProfile
  stats: CharStats
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
