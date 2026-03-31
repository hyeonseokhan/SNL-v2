import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { CharData, ArkPassiveSection } from '@/types/character'

interface TabArkPassiveProps {
  data: CharData
}

function SectionCard({ title, section }: { title: string; section: ArkPassiveSection }) {
  // 티어별 그룹핑
  const tiers = new Map<number, typeof section.nodes>()
  for (const node of section.nodes) {
    const list = tiers.get(node.tier) ?? []
    list.push(node)
    tiers.set(node.tier, list)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <Badge variant="secondary">{section.points}P</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {section.nodes.length === 0 ? (
          <p className="text-sm text-muted-foreground">데이터 없음</p>
        ) : (
          <div className="space-y-3">
            {Array.from(tiers.entries())
              .sort(([a], [b]) => a - b)
              .map(([tier, nodes]) => (
                <div key={tier}>
                  <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                    {tier}티어
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {nodes.map((node, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 rounded-md bg-secondary/50 px-2 py-1"
                      >
                        {node.icon && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={node.icon} alt={node.name} className="size-5 rounded" />
                        )}
                        <span className="text-xs">{node.name}</span>
                        <span className="text-xs font-semibold text-muted-foreground">
                          Lv.{node.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function TabArkPassive({ data }: TabArkPassiveProps) {
  const { arkPassive } = data

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <SectionCard title="진화" section={arkPassive.evolution} />
      <SectionCard title="깨달음" section={arkPassive.enlightenment} />
      <SectionCard title="도약" section={arkPassive.leap} />
    </div>
  )
}
