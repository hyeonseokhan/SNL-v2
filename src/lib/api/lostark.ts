/**
 * @file 로스트아크 공식 API 호출
 * 서버 전용 — 클라이언트에서 직접 호출 금지
 */

import fs from 'fs'

const LA_BASE = 'https://developer-lostark.game.onstove.com'
const LA_FILTERS =
  'profiles+equipment+combat-skills+engravings+gems+arkpassive+arkgrid+cards'

// ===================================================================
// 토큰 관리 (서버 전용 환경변수)
// ===================================================================

function getTokens(): string[] {
  const raw = process.env.LOA_API_TOKEN ?? ''
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

let tokenIdx = 0

function getToken(): string {
  const tokens = getTokens()
  if (!tokens.length) throw new Error('LOA_API_TOKEN 환경변수가 설정되지 않았습니다.')
  const token = tokens[tokenIdx % tokens.length]
  tokenIdx++
  return token
}

// ===================================================================
// 에러 클래스
// ===================================================================

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

// ===================================================================
// API 호출
// ===================================================================

export async function fetchCharacter(name: string): Promise<any> {
  // ── 개발용 mock (MOCK_CHAR=true 일 때) ──────────────────────────
  if (process.env.MOCK_CHAR === 'true') {
    const mockPath = process.env.MOCK_CHAR_PATH ?? ''
    if (!mockPath) throw new Error('MOCK_CHAR_PATH 환경변수가 설정되지 않았습니다.')
    const raw = fs.readFileSync(mockPath, 'utf-8')
    console.log(`[mock] fetchCharacter("${name}") → ${mockPath}`)
    return JSON.parse(raw)
  }

  // ── 실제 API 호출 ─────────────────────────────────────────────
  const url = `${LA_BASE}/armories/characters/${encodeURIComponent(name)}?filters=${LA_FILTERS}`
  const token = getToken()

  const res = await fetch(url, {
    headers: {
      Authorization: `bearer ${token}`,
      Accept: 'application/json',
    },
    next: { revalidate: 300 }, // 5분 캐시
  })

  if (!res.ok) {
    if (res.status === 404)
      throw new ApiError(404, `캐릭터 '${name}'를 찾을 수 없습니다.`)
    if (res.status === 401)
      throw new ApiError(401, 'API 인증 오류입니다.')
    if (res.status === 429)
      throw new ApiError(
        429,
        'API 요청 한도를 초과했습니다. 잠시 후 다시 시도하세요.',
      )
    throw new ApiError(res.status, `API 오류 (${res.status})`)
  }

  return res.json()
}
