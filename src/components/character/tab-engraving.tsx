import type { CharData } from '@/types/character'

interface TabEngravingProps {
  data: CharData
}

export function TabEngraving({ data }: TabEngravingProps) {
  const { engraving } = data

  if (!engraving.length) {
    return (
      <div className="rounded-lg bg-card p-8 text-center text-sm text-muted-foreground">
        적용된 각인이 없습니다.
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-card p-4">
      <h3 className="mb-4 text-sm font-semibold text-primary">각인</h3>
      <div className="space-y-2.5">
        {engraving.map((eng, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3"
          >
            {eng.icon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={eng.icon} alt="" className="size-9 rounded-lg" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">x {eng.level}</span>
                <span className="text-sm">{eng.name}</span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">Lv.{eng.level}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
