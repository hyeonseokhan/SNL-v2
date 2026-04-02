'use client'

/**
 * @file 캐릭터 데이터 동기화 컴포넌트
 *
 * SSR에서 fetch한 데이터를 클라이언트 측에 동기화합니다:
 * 1. Zustand 스토어에 주입 (모든 클라이언트 컴포넌트에서 접근 가능)
 * 2. localStorage 캐시에 저장 (점검 시 fallback용)
 *
 * 렌더링 결과물은 없습니다 (null 반환).
 */

import { useEffect } from 'react'
import { saveCharCache } from '@/lib/cache/char-cache'
import { useCharacterStore } from '@/stores/character-store'
import type { CharData } from '@/types/character'
import type { CharPalette } from '@/lib/utils/extract-palette'

/**
 * @param name - 캐릭터명
 * @param data - API에서 파싱된 캐릭터 데이터
 * @param palette - 캐릭터 이미지 팔레트 색상
 * @param ranking - KorLark 랭킹 데이터
 */
interface Props {
  name: string
  data: CharData
  palette: CharPalette
  ranking: any
}

/**
 * 캐릭터 데이터 동기화 컴포넌트
 *
 * SSR 페이지에 삽입되어 마운트 시 스토어 + 캐시를 갱신합니다.
 * 다른 캐릭터로 이동하면 자동으로 새 데이터로 교체됩니다.
 *
 * @example
 * <CharCacheSync name="리얼본좌강림" data={data} palette={palette} ranking={ranking} />
 */
export function CharCacheSync({ name, data, palette, ranking }: Props) {
  const setCharacter = useCharacterStore((s) => s.setCharacter)

  useEffect(() => {
    // 1. Zustand 스토어에 주입
    setCharacter(data, palette, ranking)
    // 2. localStorage 캐시 저장
    saveCharCache(name, data, palette, ranking)
  }, [name, data, palette, ranking, setCharacter])

  return null
}
