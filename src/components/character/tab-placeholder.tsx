import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TabPlaceholderProps {
  title: string
  description?: string
}

export function TabPlaceholder({ title, description }: TabPlaceholderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {description ?? `${title} 정보가 여기에 표시됩니다.`}
        </p>
      </CardContent>
    </Card>
  )
}
