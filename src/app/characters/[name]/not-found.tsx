import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CharacterNotFound() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>캐릭터를 찾을 수 없습니다</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            입력한 캐릭터 이름이 존재하지 않거나 잘못되었습니다.
          </p>
          <Button asChild>
            <Link href="/">다시 검색하기</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
