/**
 * @file KLOA(korlark.com) 보조 API 호출 — 랭킹 데이터
 */

export interface RankingData {
  total:        { value: number; position: number }
  server:       { value: number; position: number }
  job:          { value: number; position: number }
  serverAndJob: { value: number; position: number }
}

export async function fetchRanking(characterName: string): Promise<RankingData | null> {
  try {
    const res = await fetch(
      `https://api.korlark.com/lostark/characters/${encodeURIComponent(characterName)}/rank`,
      { next: { revalidate: 300 } },
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}
