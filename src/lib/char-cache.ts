/**
 * @file 캐릭터 데이터 브라우저 캐시
 *
 * localStorage에 캐릭터 데이터를 저장/조회합니다.
 * 클라이언트 전용 — 서버에서 import 금지
 */

import type { CharData } from '@/types/character'
import type { CharPalette } from '@/lib/extract-palette'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RankingData = any

const CACHE_VERSION = 'v1'
const CACHE_TTL     = 7 * 24 * 60 * 60 * 1000  // 7일

function key(name: string): string {
  return `snl_char_${CACHE_VERSION}_${name}`
}

export interface CharCacheEntry {
  data:    CharData
  palette: CharPalette
  ranking: RankingData
  savedAt: number
}

export function saveCharCache(
  name:    string,
  data:    CharData,
  palette: CharPalette,
  ranking: RankingData,
): void {
  try {
    const entry: CharCacheEntry = { data, palette, ranking, savedAt: Date.now() }
    localStorage.setItem(key(name), JSON.stringify(entry))
  } catch {
    // 용량 초과 등 무시
  }
}

export function loadCharCache(name: string): CharCacheEntry | null {
  try {
    const raw = localStorage.getItem(key(name))
    if (!raw) return null
    const entry = JSON.parse(raw) as CharCacheEntry
    if (Date.now() - entry.savedAt > CACHE_TTL) return null
    return entry
  } catch {
    return null
  }
}
