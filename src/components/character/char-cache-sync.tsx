'use client'

/**
 * @file 캐릭터 데이터 캐시 동기화
 *
 * 정상 조회 성공 시 localStorage에 저장합니다.
 * 렌더링 결과물은 없습니다.
 */

import { useEffect } from 'react'
import { saveCharCache } from '@/lib/char-cache'
import type { CharData } from '@/types/character'
import type { CharPalette } from '@/lib/extract-palette'

interface Props {
  name:    string
  data:    CharData
  palette: CharPalette
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ranking: any
}

export function CharCacheSync({ name, data, palette, ranking }: Props) {
  useEffect(() => {
    saveCharCache(name, data, palette, ranking)
  }, [name, data, palette, ranking])

  return null
}
