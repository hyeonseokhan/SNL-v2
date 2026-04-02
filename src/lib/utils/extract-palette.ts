/**
 * @file 캐릭터 이미지에서 대표 색상 팔레트 추출 (서버 전용)
 * node-vibrant 사용
 */

import { Vibrant } from 'node-vibrant/node'

export interface CharPalette {
  darkVibrant: string  // 어두운 주조색 (배경 베이스)
  vibrant: string      // 선명한 주조색 (포인트)
  muted: string        // 부드러운 주조색 (보조)
}

const FALLBACK: CharPalette = {
  darkVibrant: '#15181d',
  vibrant: '#2a2d3a',
  muted: '#1e2128',
}

export async function extractPalette(imageUrl: string): Promise<CharPalette> {
  if (!imageUrl) return FALLBACK

  try {
    const palette = await Vibrant.from(imageUrl).getPalette()

    return {
      darkVibrant: palette.DarkVibrant?.hex ?? FALLBACK.darkVibrant,
      vibrant:     palette.Vibrant?.hex     ?? FALLBACK.vibrant,
      muted:       palette.Muted?.hex       ?? FALLBACK.muted,
    }
  } catch {
    return FALLBACK
  }
}
