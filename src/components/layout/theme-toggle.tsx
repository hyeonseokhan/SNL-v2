'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-9"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      suppressHydrationWarning
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
      <span className="sr-only">테마 전환</span>
    </Button>
  )
}
