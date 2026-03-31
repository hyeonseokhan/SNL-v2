import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CharData } from '@/types/character'

interface TabEngravingProps {
  data: CharData
}

export function TabEngraving({ data }: TabEngravingProps) {
  const { engraving } = data

  if (!engraving.length) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          적용된 각인이 없습니다.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">각인</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 sm:grid-cols-2">
          {engraving.map((eng, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-md bg-secondary/50 px-3 py-2"
            >
              {eng.icon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={eng.icon}
                  alt={eng.name}
                  className="size-8 rounded"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{eng.name}</p>
                <p className="text-xs text-muted-foreground">Lv. {eng.level}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
