import { Badge } from '@/components/ui/badge'
import type { CharData } from '@/types/character'

interface CharacterHeaderProps {
  data: CharData
}

export function CharacterHeader({ data }: CharacterHeaderProps) {
  const { profile, stats } = data

  return (
    <div className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:gap-6">
      {/* --- 캐릭터 이미지 --- */}
      {profile.characterImage && (
        <div className="size-24 shrink-0 rounded-lg bg-secondary overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.characterImage}
            alt={profile.characterName}
            className="size-full object-cover"
          />
        </div>
      )}

      {/* --- 기본 정보 --- */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-bold">{profile.characterName}</h1>
          <Badge variant="secondary">{profile.serverName}</Badge>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span>{profile.class}</span>
          <span className="text-border">|</span>
          <span>Lv. {profile.characterLevel}</span>
          <span className="text-border">|</span>
          <span className="font-semibold text-foreground">
            iLv {profile.itemLevel.toFixed(2)}
          </span>
          <span className="text-border">|</span>
          <span>전투력 {stats.combatPower.toLocaleString()}</span>
          {profile.guildName && (
            <>
              <span className="text-border">|</span>
              <span>{profile.guildName}</span>
            </>
          )}
        </div>

        {profile.title && (
          <p className="text-xs text-muted-foreground">{profile.title}</p>
        )}
      </div>
    </div>
  )
}
