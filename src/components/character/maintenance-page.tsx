'use client'

/**
 * @file 서버 점검 중 캐릭터 페이지 fallback
 *
 * - 상단에 점검 안내 배너를 표시합니다.
 * - localStorage 캐시가 있으면 기존 데이터로 UI를 렌더링합니다.
 * - 캐시가 없으면 점검 안내만 표시합니다.
 */

import { useState, useEffect } from 'react'
import { loadCharCache } from '@/lib/cache/char-cache'
import { CharacterProfile } from './character-profile'
import { CharacterRanking } from './character-ranking'
import { CharacterContent } from './character-content'

// ===================================================================
// 점검 배너
// ===================================================================

function MaintenanceBanner({ endsAt }: { endsAt: string }) {
  return (
    <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
      {/* 아이콘 */}
      <svg
        className="mt-0.5 h-5 w-5 shrink-0 text-amber-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-amber-300">
          로스트아크 정기 서버 점검 중
        </p>
        <p className="mt-0.5 text-xs text-amber-200/70">
          매주 수요일 오전 6시 ~ {endsAt}까지 서버 점검이 진행됩니다.
          {' '}점검 종료 후 최신 데이터를 불러올 수 있습니다.
        </p>
      </div>
    </div>
  )
}

// ===================================================================
// 캐시 없음 안내
// ===================================================================

function NoCacheNotice() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
      <p className="text-lg font-medium text-tx-label">저장된 데이터가 없습니다</p>
      <p className="max-w-xs text-sm text-tx-muted">
        점검 종료 후 한 번 이상 조회한 캐릭터는 점검 중에도 확인할 수 있습니다.
      </p>
    </div>
  )
}

// ===================================================================
// 메인 컴포넌트
// ===================================================================

interface MaintenancePageProps {
  characterName: string
  endsAt: string
}

export function MaintenancePage({ characterName, endsAt }: MaintenancePageProps) {
  const [cache, setCache] = useState<ReturnType<typeof loadCharCache> | undefined>(undefined)

  useEffect(() => {
    setCache(loadCharCache(characterName))
  }, [characterName])

  // 캐시 로딩 전 (hydration)
  if (cache === undefined) return null

  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-12 pt-6">
      <MaintenanceBanner endsAt={endsAt} />

      {cache ? (
        <div className="flex gap-2">
          {/* 좌측 패널 */}
          <aside className="w-[272px] shrink-0 space-y-2">
            <CharacterProfile data={cache.data} palette={cache.palette} />
            {cache.ranking && (
              <CharacterRanking ranking={cache.ranking} serverName={cache.data.profile.serverName} />
            )}
          </aside>

          {/* 우측 패널 */}
          <div className="min-w-0 flex-1">
            <CharacterContent data={cache.data} />
          </div>
        </div>
      ) : (
        <NoCacheNotice />
      )}
    </div>
  )
}
