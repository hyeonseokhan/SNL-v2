'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ComponentProps } from 'react'

/**
 * 테마 프로바이더
 *
 * next-themes의 ThemeProvider를 래핑합니다.
 * Next.js 16에서 인라인 스크립트 경고를 방지하기 위해
 * `enableColorScheme={false}`를 설정합니다.
 *
 * @param children - 하위 컴포넌트 트리
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  )
}
