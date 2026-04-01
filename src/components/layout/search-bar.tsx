'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  size?: 'sm' | 'lg'
  className?: string
}

export function SearchBar({ size = 'sm', className }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      router.push(`/characters/${encodeURIComponent(trimmed)}`)
      setQuery('')
    }
  }

  const isLarge = size === 'lg'

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative group">
        <Search
          className={`absolute left-3 top-1/2 -translate-y-1/2 text-tx-caption transition-colors group-focus-within:text-primary ${
            isLarge ? 'size-5' : 'size-4'
          }`}
        />
        <Input
          type="text"
          placeholder="캐릭터명을 입력하세요"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`${
            isLarge
              ? 'h-12 pl-11 pr-4 text-base'
              : 'h-9 pl-9 pr-3 text-sm'
          } rounded-lg bg-card border-border/50 focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50 placeholder:text-tx-muted`}
        />
      </div>
    </form>
  )
}
