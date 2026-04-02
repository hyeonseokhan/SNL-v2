import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/layout/header'
import { siteConfig } from '@/config/site'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
}

/**
 * 루트 레이아웃
 *
 * next-themes의 ThemeProvider로 다크/라이트 테마를 관리합니다.
 * suppressHydrationWarning은 next-themes의 인라인 스크립트가
 * 서버/클라이언트 간 class 속성을 변경하기 때문에 필요합니다.
 *
 * @remarks
 * Next.js 16에서 next-themes의 `<script>` 태그 경고가 발생하지만
 * 기능에 영향 없음. next-themes의 Next.js 16 정식 지원 시 해결 예정.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-dvh bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <Header />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
