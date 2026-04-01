import type { CharData } from '@/types/character'

interface CharacterHeaderProps {
  data: CharData
}

export function CharacterHeader({ data }: CharacterHeaderProps) {
  const { profile, stats } = data

  return (
    <div className="relative overflow-hidden rounded-lg bg-card">
      {/* --- 배경 이미지 --- */}
      {profile.characterImage && (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.characterImage}
            alt=""
            className="h-full w-full object-cover object-top opacity-30 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/90 to-card/60" />
        </div>
      )}

      <div className="relative flex items-stretch gap-0">
        {/* --- 캐릭터 이미지 --- */}
        {profile.characterImage && (
          <div className="hidden w-48 shrink-0 sm:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.characterImage}
              alt={profile.characterName}
              className="h-full w-full object-cover object-top"
            />
          </div>
        )}

        {/* --- 캐릭터 정보 --- */}
        <div className="flex flex-1 flex-col justify-center gap-3 p-5 sm:p-6">
          {/* 상단: 레벨 + 클래스 */}
          <div className="flex items-center gap-2 text-sm text-tx-caption">
            <span>Lv. {profile.characterLevel}</span>
            <span>{profile.class}</span>
            {profile.title && (
              <>
                <span className="text-border">|</span>
                <span className="text-xs">#{profile.title}</span>
              </>
            )}
          </div>

          {/* 캐릭터 이름 */}
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {profile.characterName}
          </h1>

          {/* 아이템 레벨 + 전투력 */}
          <div className="flex items-baseline gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-tx-caption">⚔</span>
              <span className="text-xl font-bold text-amber-400">
                {profile.itemLevel.toLocaleString('ko-KR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-tx-caption">⚡</span>
              <span className="text-lg font-semibold text-emerald-400">
                {stats.combatPower.toLocaleString()}
              </span>
            </div>
          </div>

          {/* 하단 정보 */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-tx-caption">
            <span>서버 {profile.serverName}</span>
            {profile.guildName && <span>길드 {profile.guildName}</span>}
          </div>
        </div>

        {/* --- 우측: 전투 특성 미니 요약 --- */}
        <div className="hidden items-center border-l border-border/50 px-6 lg:flex">
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {[
              { label: '치명', value: stats.critical },
              { label: '특화', value: stats.special },
              { label: '신속', value: stats.haste },
              { label: '제압', value: stats.suppress },
              { label: '인내', value: stats.patience },
              { label: '숙련', value: stats.expert },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="w-8 text-tx-caption">{label}</span>
                <span className={`font-semibold tabular-nums ${value > 100 ? 'text-foreground' : 'text-tx-muted'}`}>
                  {value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
