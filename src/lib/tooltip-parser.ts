/**
 * @file 로스트아크 장비 툴팁 JSON 파서
 *
 * API의 Tooltip 필드(JSON 문자열)를 파싱하여
 * 컴포넌트 렌더링용 구조화 데이터로 변환합니다.
 */

// ===================================================================
// 타입 정의
// ===================================================================

export interface TooltipSection {
  header: string        // 섹션 제목 (예: "기본 효과", "연마 효과")
  lines: TooltipLine[]  // 각 효과 라인
}

export interface TooltipLine {
  text: string
  color: string  // 'orange' | 'purple' | 'blue' | 'white' | 'gray'
}

export interface ParsedTooltip {
  name: string
  gradeType: string   // 예: "고대 우산"
  quality: number     // -1 이면 없음
  itemLevel: number   // 0이면 없음
  tier: number
  classRestriction: string  // 예: "기상술사 전용"
  sections: TooltipSection[]
}

// ===================================================================
// 헬퍼
// ===================================================================

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, '').trim()
}

/** FONT COLOR hex → 의미 색상 매핑 */
function mapColor(hex: string): string {
  switch (hex.toUpperCase()) {
    case 'FE9600': return 'orange'   // 상 (최고 연마)
    case 'CE43FC': return 'purple'   // 중 (중간 연마) / 일부 퍼센트 값
    case '00B5FF': return 'blue'     // 하 (하위 연마) / 일부 수치 값
    case 'A9D0F5': return 'lightblue'  // 섹션 헤더
    case 'E3C7A1': return 'ancient'    // 고대 등급 색상
    case 'FA5D00': return 'relic'      // 유물 등급 색상
    case 'FFD200': return 'legendary'  // 전설 등급 색상
    case 'C24B46': return 'red'        // 경고/불가
    case '5FD3F1': return 'teal'       // 드롭 위치
    case '73DC04': return 'green'     // 레벨 보너스
    default:        return 'white'
  }
}

/** HTML 라인에서 색상과 텍스트 추출 */
function parseLineColor(html: string): TooltipLine {
  const colorMatch = html.match(/FONT\s+[^>]*COLOR=['"]?#?([0-9A-Fa-f]{6})/i)
  const color = colorMatch ? mapColor(colorMatch[1]) : 'white'
  return { text: stripHtml(html), color }
}

/** ItemPartBox value → TooltipSection */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseItemPartBox(val: any): TooltipSection | null {
  if (!val) return null
  const header = stripHtml(val.Element_000 ?? '')
  const rawContent: string = val.Element_001 ?? ''
  if (!rawContent) return null

  const lines: TooltipLine[] = rawContent
    .split(/<br\s*\/?>/i)
    .map((line) => parseLineColor(line))
    .filter((l) => l.text.length > 0)

  return { header, lines }
}

/** IndentStringGroup (어빌리티 스톤 각인) → TooltipSection */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseIndentGroup(val: any): TooltipSection | null {
  if (!val) return null
  const header = stripHtml(val.Element_000?.topStr ?? '') || '각인 효과'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contentStr: Record<string, any> = val.Element_000?.contentStr ?? {}
  const lines: TooltipLine[] = []

  for (const key of Object.keys(contentStr).sort()) {
    const entry = contentStr[key]
    if (!entry) continue

    // 스톤 형식: contentStr이 바로 HTML 문자열
    if (typeof entry.contentStr === 'string') {
      const raw = entry.contentStr
      const text = stripHtml(raw)
      if (!text) continue
      const color = raw.includes('FE2E2E') ? 'red'          // 감소 각인
        : raw.includes('73DC04') ? 'green'                  // 레벨 보너스
        : raw.includes('FFFFAC') ? 'buff'                   // 버프 각인
        : 'white'
      lines.push({ text, color })
      continue
    }

    // 기존 형식: contentStr이 객체 (하위 엔트리들)
    if (typeof entry.contentStr === 'object') {
      for (const innerKey of Object.keys(entry.contentStr).sort()) {
        const inner = entry.contentStr[innerKey]
        const raw: string = inner?.contentStr ?? ''
        const text = stripHtml(raw)
        if (!text) continue
        const color = inner?.bPoint === 0 ? 'white' : 'gray'
        lines.push({ text, color })
      }
    }
  }

  return lines.length ? { header, lines } : null
}

// ===================================================================
// 메인 파서
// ===================================================================

export function parseTooltipJson(raw: string): ParsedTooltip | null {
  if (!raw) return null
  let tip: Record<string, { type: string; value: unknown }>
  try {
    tip = JSON.parse(raw)
  } catch {
    return null
  }

  // ── 이름 ──────────────────────────────────────────────────────────
  const name = stripHtml((tip.Element_000?.value as string) ?? '')

  // ── ItemTitle ────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const titleVal = tip.Element_001?.value as any
  const gradeType  = stripHtml(titleVal?.leftStr0 ?? '')
  const quality    = titleVal?.qualityValue ?? -1

  const rawStr2    = stripHtml(titleVal?.leftStr2 ?? '')
  const lvMatch    = rawStr2.match(/([\d,]+)\s*\(/)
  const tierMatch  = rawStr2.match(/티어\s*(\d+)/)
  const itemLevel  = lvMatch    ? parseInt(lvMatch[1].replace(/,/g, '')) : 0
  const tier       = tierMatch  ? parseInt(tierMatch[1]) : 0

  // ── 클래스 전용 ────────────────────────────────────────────────────
  // Element_002가 SingleTextBox이고 "전용" 포함하면 클래스 제한
  const e2text = stripHtml((tip.Element_002?.value as string) ?? '')
  const classRestriction = e2text.includes('전용') ? e2text : ''

  // ── 효과 섹션들 ────────────────────────────────────────────────────
  const sections: TooltipSection[] = []
  const SKIP_KEYWORDS = ['거래', '귀속', '판매', '분해', '제작', '내구도', '티어', '아이템 레벨', '전용', '불가']

  for (let i = 2; i <= 15; i++) {
    const key = `Element_${String(i).padStart(3, '0')}`
    const el = tip[key]
    if (!el || !el.value) continue

    const type = el.type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const val = el.value as any

    if (type === 'ItemPartBox') {
      const sec = parseItemPartBox(val)
      if (!sec) continue
      // 불필요 섹션 스킵 (드롭 위치, 거래 불가 등)
      if (SKIP_KEYWORDS.some((kw) => sec.header.includes(kw))) continue
      // 내용 없는 섹션 스킵
      if (!sec.lines.length) continue
      sections.push(sec)
    } else if (type === 'IndentStringGroup') {
      const sec = parseIndentGroup(val)
      if (sec) sections.push(sec)
    }
  }

  return { name, gradeType, quality, itemLevel, tier, classRestriction, sections }
}
