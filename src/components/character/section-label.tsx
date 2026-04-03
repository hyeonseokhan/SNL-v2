/**
 * @file 섹션 라벨 — pill 배지 + 가로선 + 우측 보조 콘텐츠
 *
 * 캐릭터 컴포넌트 전반에서 공통으로 사용하는 섹션 헤더입니다.
 */

/**
 * @param children - 라벨 텍스트
 * @param right - 우측에 표시할 보조 콘텐츠 (합계, 토글 버튼 등)
 */
export function SectionLabel({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="shrink-0 rounded-full bg-primary/15 px-3 py-1 text-[12px] font-bold text-primary">
        {children}
      </span>
      <div className="h-px flex-1 bg-black/10 dark:bg-white/15" />
      {right}
    </div>
  )
}
