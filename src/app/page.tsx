import { SearchBar } from '@/components/layout/search-bar'

export default function Home() {
  return (
    <div className="flex min-h-[calc(100dvh-3rem)] flex-col items-center justify-center gap-10 py-20">
      {/* --- 히어로 --- */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold tracking-tight text-primary sm:text-6xl">
          SNL
        </h1>
        <p className="text-muted-foreground text-base">
          로스트아크 캐릭터 조회
        </p>
      </div>

      {/* --- 메인 검색바 --- */}
      <SearchBar size="lg" className="w-full max-w-md" />

      {/* --- 안내 --- */}
      <p className="text-xs text-muted-foreground/60">
        캐릭터 이름을 입력하면 장비, 스킬, 보석 등 상세 정보를 확인할 수 있습니다.
      </p>
    </div>
  )
}
