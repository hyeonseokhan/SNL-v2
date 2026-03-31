import { SearchBar } from '@/components/layout/search-bar'

export default function Home() {
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center gap-8 py-20">
      {/* --- 히어로 타이틀 --- */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">SNL</h1>
        <p className="text-muted-foreground text-lg">
          로스트아크 캐릭터 조회
        </p>
      </div>

      {/* --- 메인 검색바 --- */}
      <SearchBar size="lg" className="w-full max-w-lg" />

      {/* --- 안내 문구 --- */}
      <p className="text-sm text-muted-foreground">
        캐릭터 이름을 입력하면 장비, 스킬, 보석 등 상세 정보를 확인할 수 있습니다.
      </p>
    </div>
  )
}
