import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { CharData } from '@/types/character'

interface TabSkillsProps {
  data: CharData
}

export function TabSkills({ data }: TabSkillsProps) {
  const { skills } = data

  // 레벨 > 0인 스킬만 표시 (사용 중인 스킬)
  const activeSkills = skills.filter((s) => s.level > 0)

  if (!activeSkills.length) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          등록된 스킬이 없습니다.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">스킬 ({activeSkills.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {activeSkills.map((skill, i) => (
            <div
              key={i}
              className="rounded-lg border bg-secondary/30 p-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{skill.name}</span>
                <Badge variant="outline" className="text-xs">
                  Lv.{skill.level}
                </Badge>
              </div>
              {skill.tripods.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {skill.tripods.map((tripod, j) => (
                    <span
                      key={j}
                      className="rounded bg-secondary px-1.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {tripod.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
