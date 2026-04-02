import type { CharData, ArkPassiveSection } from '@/types/character'

interface TabArkPassiveProps {
  data: CharData
}

const SECTION_COLORS = {
  evolution: { label: '진화', badge: 'bg-red-500/20 text-red-400 border-red-500/30' },
  enlightenment: { label: '깨달음', badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  leap: { label: '도약', badge: 'bg-green-500/20 text-green-400 border-green-500/30' },
} as const

function SectionCard({
  sectionKey,
  section,
}: {
  sectionKey: keyof typeof SECTION_COLORS
  section: ArkPassiveSection
}) {
  const { label, badge } = SECTION_COLORS[sectionKey]

  // 티어별 그룹핑
  const tiers = new Map<number, typeof section.nodes>()
  for (const node of section.nodes) {
    const list = tiers.get(node.tier) ?? []
    list.push(node)
    tiers.set(node.tier, list)
  }

  return (
    <div className="rounded-lg bg-card p-4">
      {/* 헤더 */}
      <div className="mb-3 flex items-center gap-2">
        <span className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${badge}`}>
          {label}
        </span>
        <span className="text-sm font-bold tabular-nums">{section.points} 포인트</span>
      </div>

      {/* 노드 목록 */}
      {section.nodes.length === 0 ? (
        <p className="text-xs text-tx-caption">데이터 없음</p>
      ) : (
        <div className="space-y-2.5">
          {Array.from(tiers.entries())
            .sort(([a], [b]) => a - b)
            .map(([tier, nodes]) => (
              <div key={tier}>
                {nodes.map((node, i) => (
                  <div key={i} className="flex items-center gap-2 py-0.5">
                    {node.icon && (
                      <img src={node.icon} alt="" className="size-6 rounded" />
                    )}
                    <span className="text-xs text-tx-caption">{tier}티어</span>
                    <span className="text-xs font-medium">{node.name}</span>
                    <span className="text-xs text-tx-caption">Lv.{node.level}</span>
                  </div>
                ))}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export function TabArkPassive({ data }: TabArkPassiveProps) {
  const { arkPassive } = data

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <SectionCard sectionKey="evolution" section={arkPassive.evolution} />
      <SectionCard sectionKey="enlightenment" section={arkPassive.enlightenment} />
      <SectionCard sectionKey="leap" section={arkPassive.leap} />
    </div>
  )
}
