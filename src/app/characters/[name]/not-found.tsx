import Link from 'next/link'

export default function CharacterNotFound() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-card p-6 text-center">
        <h2 className="text-lg font-semibold">캐릭터를 찾을 수 없습니다</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          입력한 캐릭터 이름이 존재하지 않거나 잘못되었습니다.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          다시 검색하기
        </Link>
      </div>
    </div>
  )
}
