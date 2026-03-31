import { Badge } from '@/components/ui/badge'
import type { CharacterProfile } from '@/types/character'

interface CharacterHeaderProps {
  profile: CharacterProfile
}

export function CharacterHeader({ profile }: CharacterHeaderProps) {
  return (
    <div className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:gap-6">
      {/* --- 캐릭터 이미지 (추후 구현) --- */}
      {profile.imageUrl && (
        <div className="size-20 shrink-0 rounded-lg bg-secondary overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.imageUrl}
            alt={profile.name}
            className="size-full object-cover"
          />
        </div>
      )}

      {/* --- 기본 정보 --- */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <Badge variant="secondary">{profile.server}</Badge>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span>{profile.job}</span>
          <span className="text-border">|</span>
          <span>Lv. {profile.combatLevel}</span>
          <span className="text-border">|</span>
          <span className="font-semibold text-foreground">
            iLv {profile.itemLevel.toFixed(2)}
          </span>
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
