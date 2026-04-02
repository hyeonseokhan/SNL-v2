/**
 * @file 캐릭터 데이터 스토어
 *
 * Zustand 기반 전역 상태 관리.
 * 모든 탭(능력치, 시뮬레이터, 효율 분석)에서 공유되는
 * 캐릭터 데이터의 단일 진실 공급원(Single Source of Truth)입니다.
 *
 * @example
 * // 컴포넌트에서 원본 데이터 읽기
 * const original = useCharacterStore(s => s.original)
 *
 * // 시뮬레이터에서 수정본 업데이트
 * const updateSimulated = useCharacterStore(s => s.updateSimulated)
 * updateSimulated({ armory: { ...armory, accessory: { ...accessory, bangle: newBangle } } })
 *
 * // 효율 분석에서 현재 활성 데이터 가져오기
 * const activeData = useCharacterStore(s => s.activeData)
 */

import { create } from 'zustand'
import type { CharData } from '@/types/character'
import type { CharPalette } from '@/lib/utils/extract-palette'

// ===================================================================
// 타입 정의
// ===================================================================

/**
 * 랭킹 데이터 (KorLark API 응답)
 *
 * @property allServer - 전체 서버 랭킹
 * @property classServer - 서버 내 클래스 랭킹
 */
export interface RankingEntry {
  rank: number
  percentage: number
}

export interface RankingData {
  allServer: RankingEntry | null
  allClass: RankingEntry | null
  server: RankingEntry | null
  serverClass: RankingEntry | null
}

/**
 * 캐릭터 스토어 상태
 *
 * @property original - API에서 받은 원본 데이터 (읽기 전용 취급)
 * @property simulated - 시뮬레이터에서 수정한 데이터 (null이면 수정 없음)
 * @property palette - 캐릭터 이미지 팔레트 색상
 * @property ranking - KorLark 랭킹 데이터
 * @property isDirty - 시뮬레이터에서 수정이 발생했는지 여부
 * @property activeData - 현재 활성 데이터 (수정본 우선, 없으면 원본)
 */
interface CharacterState {
  /** API 원본 데이터 */
  original: CharData | null
  /** 시뮬레이터 수정본 (null이면 원본과 동일) */
  simulated: CharData | null
  /** 캐릭터 이미지 팔레트 */
  palette: CharPalette | null
  /** 랭킹 데이터 */
  ranking: RankingData | null
  /** 시뮬레이터 수정 여부 */
  isDirty: boolean
}

/**
 * 캐릭터 스토어 액션
 *
 * @property setCharacter - 새 캐릭터 데이터를 로드 (원본 설정, 시뮬 초기화)
 * @property updateSimulated - 시뮬레이터에서 수정본을 업데이트
 * @property resetSimulated - 수정본을 원본으로 초기화
 * @property getActiveData - 현재 활성 데이터 반환 (수정본 우선)
 * @property clear - 스토어 전체 초기화
 */
interface CharacterActions {
  setCharacter: (data: CharData, palette: CharPalette | null, ranking: RankingData | null) => void
  updateSimulated: (partial: Partial<CharData>) => void
  resetSimulated: () => void
  getActiveData: () => CharData | null
  clear: () => void
}

// ===================================================================
// 스토어 생성
// ===================================================================

const initialState: CharacterState = {
  original: null,
  simulated: null,
  palette: null,
  ranking: null,
  isDirty: false,
}

/**
 * 캐릭터 데이터 전역 스토어
 *
 * SSR에서 서버 컴포넌트가 데이터를 fetch한 뒤,
 * 클라이언트 컴포넌트(CharCacheSync 등)에서 이 스토어에 주입합니다.
 *
 * @example
 * // 원본 데이터 로드
 * useCharacterStore.getState().setCharacter(data, palette, ranking)
 *
 * // 시뮬레이터에서 장비 변경
 * useCharacterStore.getState().updateSimulated({
 *   armory: modifiedArmory
 * })
 *
 * // 효율 분석에서 활성 데이터 사용
 * const data = useCharacterStore.getState().getActiveData()
 */
export const useCharacterStore = create<CharacterState & CharacterActions>()((set, get) => ({
  ...initialState,

  setCharacter: (data, palette, ranking) => {
    set({
      original: data,
      simulated: null,
      palette,
      ranking,
      isDirty: false,
    })
  },

  updateSimulated: (partial) => {
    const { original, simulated } = get()
    if (!original) return

    const base = simulated ?? original
    set({
      simulated: { ...base, ...partial },
      isDirty: true,
    })
  },

  resetSimulated: () => {
    set({
      simulated: null,
      isDirty: false,
    })
  },

  getActiveData: () => {
    const { original, simulated } = get()
    return simulated ?? original
  },

  clear: () => {
    set(initialState)
  },
}))
