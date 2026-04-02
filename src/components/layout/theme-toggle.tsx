'use client'

import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * 클라이언트 마운트 여부를 SSR-safe하게 감지합니다.
 *
 * useSyncExternalStore를 사용하여 린트 규칙(set-state-in-effect)을
 * 위반하지 않으면서 hydration mismatch를 방지합니다.
 */
const subscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

/**
 * 다크/라이트 테마 전환 버튼
 *
 * SSR 시점에는 테마를 알 수 없으므로 mounted 전까지
 * 빈 placeholder를 렌더링하여 hydration mismatch를 방지합니다.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-9"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {mounted ? (
        resolvedTheme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />
      ) : (
        <span className="size-4" />
      )}
      <span className="sr-only">테마 전환</span>
    </Button>
  )
}
