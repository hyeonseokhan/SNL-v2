import { NextResponse } from 'next/server'
import { fetchCharacter, ApiError } from '@/lib/api/lostark'
import { parseApiResponse } from '@/lib/parser/api-parser'

/**
 * @file 캐릭터 조회 API Route
 * 로스트아크 공식 API 프록시 (CORS 우회 + 토큰 보안)
 */

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params
  const decodedName = decodeURIComponent(name)

  try {
    const raw = await fetchCharacter(decodedName)
    const data = parseApiResponse(raw)
    return NextResponse.json(data)
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    return NextResponse.json(
      { error: '알 수 없는 오류가 발생했습니다.' },
      { status: 500 },
    )
  }
}
