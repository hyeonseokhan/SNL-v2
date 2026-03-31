import type { CharData } from '@/types/character'

interface TabSkillsProps {
  data: CharData
}

export function TabSkills({ data }: TabSkillsProps) {
  const { skills } = data
  const activeSkills = skills.filter((s) => s.level > 0)

  if (!activeSkills.length) {
    return (
      <div className="rounded-lg bg-card p-8 text-center text-sm text-muted-foreground">
        등록된 스킬이 없습니다.
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-card p-4">
      <h3 className="mb-4 text-sm font-semibold text-primary">
        스킬 ({activeSkills.length})
      </h3>
      <div className="grid gap-2 sm:grid-cols-2">
        {activeSkills.map((skill, i) => (
          <div key={i} className="rounded-lg bg-secondary/50 p-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{skill.name}</span>
              <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground">
                Lv.{skill.level}
              </span>
            </div>
            {skill.tripods.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {skill.tripods.map((t, j) => (
                  <span key={j} className="text-[10px] text-muted-foreground">
                    {t.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
