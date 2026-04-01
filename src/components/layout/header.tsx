import Link from 'next/link'
import { SearchBar } from './search-bar'
import { ThemeToggle } from './theme-toggle'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-12 w-[1100px] items-center gap-6">
        {/* --- 로고 --- */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-base font-bold tracking-tight text-primary">SNL</span>
        </Link>

        {/* --- 검색바 --- */}
        <SearchBar className="flex-1 max-w-sm hidden sm:block" />

        {/* --- 우측 액션 --- */}
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
