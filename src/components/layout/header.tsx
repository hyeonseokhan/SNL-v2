import Link from 'next/link'
import { SearchBar } from './search-bar'
import { ThemeToggle } from './theme-toggle'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4">
        {/* --- 로고 --- */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-lg font-bold tracking-tight">SNL</span>
        </Link>

        {/* --- 검색바 --- */}
        <SearchBar className="flex-1 max-w-md hidden sm:block" />

        {/* --- 우측 액션 --- */}
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
