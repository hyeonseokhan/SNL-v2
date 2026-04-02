'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getMaintenanceInfo } from '@/lib/utils/maintenance'

export default function CharacterError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { isMaintenance } = getMaintenanceInfo()

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>캐릭터 조회 실패</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isMaintenance && (
            <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2.5">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
              <p className="text-xs text-amber-200/80">
                현재 로스트아크 정기 점검 시간입니다 (매주 수요일 오전 6시 ~ 10시).
                점검 종료 후 다시 시도해주세요.
              </p>
            </div>
          )}

          <p className="text-sm text-tx-caption">
            {error.message || '캐릭터 정보를 불러오는 중 오류가 발생했습니다.'}
          </p>

          <Button onClick={reset}>다시 시도</Button>
        </CardContent>
      </Card>
    </div>
  )
}
