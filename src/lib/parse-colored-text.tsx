/**
 * @file FONT COLOR 태그 파싱 유틸
 *
 * 로스트아크 API 응답의 HTML FONT COLOR 태그를
 * React 노드로 변환하여 색상을 적용합니다.
 */

/**
 * API description의 FONT COLOR 태그를 파싱하여 색상이 적용된 span 배열로 변환합니다.
 *
 * @param html - FONT COLOR 태그가 포함된 HTML 문자열
 * @returns React 노드 배열
 *
 * @example
 * parseColoredText("피해가 <FONT COLOR='#99ff99'>20%</FONT> 증가")
 * // → ["피해가 ", <span style={{color:"#99ff99"}}>20%</span>, " 증가"]
 */
export function parseColoredText(html: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  const re = /<FONT COLOR='(#[0-9a-fA-F]+)'>(.*?)<\/FONT>/gi
  while ((match = re.exec(html)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(html.slice(lastIndex, match.index))
    }
    nodes.push(
      <span key={match.index} style={{ color: match[1] }}>{match[2]}</span>
    )
    lastIndex = re.lastIndex
  }
  if (lastIndex < html.length) {
    nodes.push(html.slice(lastIndex))
  }
  return nodes
}
