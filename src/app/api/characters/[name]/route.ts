import { NextResponse } from 'next/server'

/**
 * @file 캐릭터 조회 API Route
 * 로스트아크 공식 API 프록시 (CORS 우회 + 토큰 보안)
 */

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params
  const decodedName = decodeURIComponent(name)

  // TODO: 로스트아크 API 연동
  // const token = process.env.LOA_API_TOKEN
  // if (!token) {
  //   return NextResponse.json({ error: 'API 토큰 미설정' }, { status: 500 })
  // }

  return NextResponse.json({
    message: `캐릭터 "${decodedName}" 조회 API (준비 중)`,
    name: decodedName,
  })
}
