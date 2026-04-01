/**
 * @file 공식 API 응답 → CharData 변환
 *
 * 공식 API 응답(`/armories/characters/{name}?filters=...`)을
 * CharData 포맷으로 변환합니다.
 */

import type { CharData, ArkPassiveSection, ArkPassiveNode } from '@/types/character'

// ===================================================================
// 내부 헬퍼
// ===================================================================

function stripHtml(s: string | undefined): string {
  return (s ?? '').replace(/<[^>]+>/g, '').trim()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseTooltip(raw: string | undefined): Record<string, any> {
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function parseEnhanceOptions(raw: string): string[] {
  // <br> 기준으로 분리 후 FONT COLOR 로 상/중/하 판별
  const COLOR_GRADE: Record<string, string> = {
    'FE9600': '상',
    'CE43FC': '중',
    '00B5FF': '하',
  }
  return raw
    .split(/<br\s*\/?>/i)
    .map((part) => {
      const colorMatch = part.match(/FONT\s+COLOR=['"]?([0-9A-Fa-f]{6})/i)
      const grade = colorMatch ? (COLOR_GRADE[colorMatch[1].toUpperCase()] ?? '하') : '하'
      const text = stripHtml(part).trim()
      return text ? `${grade} ${text}` : null
    })
    .filter(Boolean) as string[]
}

function parseBangleOptions(raw: string): string[] {
  const cleaned = stripHtml(raw)
  return cleaned
    .split(/(?<=\d)\s*(?=[가-힣])/)
    .map((p) => p.trim())
    .filter(Boolean)
}

// ===================================================================
// 섹션별 파서
// ===================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseProfile(armoryProfile: any) {
  const stats: Record<string, number> = {}
  for (const s of armoryProfile.Stats ?? []) {
    switch (s.Type) {
      case '치명':
        stats.critical = Number(s.Value)
        break
      case '신속':
        stats.haste = Number(s.Value)
        break
      case '특화':
        stats.special = Number(s.Value)
        break
      case '제압':
        stats.suppress = Number(s.Value)
        break
      case '인내':
        stats.patience = Number(s.Value)
        break
      case '숙련':
        stats.expert = Number(s.Value)
        break
      case '공격력':
        stats.attack = Number(s.Value)
        break
    }
  }
  stats.combatPower = Number(
    (armoryProfile.CombatPower ?? '0').toString().replace(/,/g, ''),
  )

  return {
    stats,
    profile: {
      class: armoryProfile.CharacterClassName ?? '',
      secondClass: '',
      itemLevel: parseFloat(
        (armoryProfile.ItemAvgLevel ?? '0').toString().replace(/,/g, ''),
      ),
      characterName: armoryProfile.CharacterName ?? '',
      serverName: armoryProfile.ServerName ?? '',
      characterLevel: Number(armoryProfile.CharacterLevel ?? 0),
      guildName: armoryProfile.GuildName ?? '',
      title: stripHtml(armoryProfile.Title ?? ''),
      titleIcon: ((): string => {
        const m = (armoryProfile.Title ?? '').match(/src='([^']+)'/)
        return m ? `https://cdn.korlark.com/lostark/icons/honortitle/${m[1]}.webp` : ''
      })(),
      characterImage: armoryProfile.CharacterImage ?? null,
      expeditionLevel: Number(armoryProfile.ExpeditionLevel ?? 0),
      pvpGrade: armoryProfile.PvpGradeName ?? '',
      townLevel: Number(armoryProfile.TownLevel ?? 0),
      townName: armoryProfile.TownName ?? '',
    },
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseEquipment(equipment: any[]) {
  const EQUIP_TYPES = ['무기', '투구', '어깨', '상의', '하의', '장갑']

  // ── 헬퍼 ──────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function itemQuality(item: any): number {
    if (!item) return -1
    const t = parseTooltip(item.Tooltip)
    return t.Element_001?.value?.qualityValue ?? -1
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function itemLevelAndTier(item: any): { itemLevel: number; tier: number } {
    if (!item) return { itemLevel: 0, tier: 0 }
    const t = parseTooltip(item.Tooltip)
    const raw = stripHtml(t.Element_001?.value?.leftStr2 ?? '')
    const lvMatch = raw.match(/아이템 레벨\s+([\d,]+)/)
    const tierMatch = raw.match(/티어\s*(\d+)/)
    return {
      itemLevel: lvMatch ? parseInt(lvMatch[1].replace(/,/g, '')) : 0,
      tier: tierMatch ? parseInt(tierMatch[1]) : 0,
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function accEnlightenment(item: any): number {
    if (!item) return 0
    const t = parseTooltip(item.Tooltip)
    for (let i = 2; i <= 8; i++) {
      const key = `Element_00${i}`
      const val = stripHtml(t[key]?.value?.Element_000 ?? t[key]?.value ?? '')
      const m = val.match(/깨달음\s*\+(\d+)/)
      if (m) return parseInt(m[1])
    }
    return 0
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function accOptions(item: any): string[] {
    if (!item) return []
    const t = parseTooltip(item.Tooltip)
    const raw = t.Element_006?.value?.Element_001 ?? ''
    return parseEnhanceOptions(raw)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function bangOptions(item: any): string[] {
    if (!item) return []
    const t = parseTooltip(item.Tooltip)
    const raw = t.Element_005?.value?.Element_001 ?? ''
    return parseBangleOptions(raw)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function stoneOptions(item: any): string[] {
    if (!item) return []
    const t = parseTooltip(item.Tooltip)
    const r1 = stripHtml(t.Element_004?.value?.Element_001 ?? '')
    const r2 = stripHtml(t.Element_005?.value?.Element_001 ?? '')
    return [r1, r2].filter(Boolean)
  }

  // ── equipList (방어구 6종) ──────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const equipList = equipment
    .filter((e) => EQUIP_TYPES.includes(e.Type))
    .map((e) => {
      const name: string = e.Name ?? ''
      const refineMatch = name.match(/^\+(\d+)/)
      const refine = refineMatch ? parseInt(refineMatch[1]) : 0
      const { itemLevel, tier } = itemLevelAndTier(e)
      return {
        type: e.Type as string,
        name,
        icon: (e.Icon ?? '') as string,
        grade: (e.Grade ?? '') as string,
        quality: itemQuality(e),
        itemLevel,
        tier,
        refine,
        option: [] as string[],
        tooltipRaw: (e.Tooltip ?? '') as string,
      }
    })

  // ── 개별 아이템 ────────────────────────────────────────
  const weaponItem = equipment.find((e) => e.Type === '무기')
  const weaponName: string = weaponItem?.Name ?? ''
  const weaponRefine = parseInt(weaponName.match(/^\+(\d+)/)?.[1] ?? '0')

  const necklaceItem = equipment.find((e) => e.Type === '목걸이')
  const earrings = equipment.filter((e) => e.Type === '귀걸이')
  const rings = equipment.filter((e) => e.Type === '반지')
  const bangleItem = equipment.find((e) => e.Type === '팔찌')
  const stoneItem = equipment.find((e) => e.Type === '어빌리티 스톤')
  const compItem = equipment.find((e) => e.Type === '나침반')
  const charmItem = equipment.find((e) => e.Type === '부적')
  const orbItem = equipment.find((e) => e.Type === '보주')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function accInfo(item: any) {
    const { tier } = itemLevelAndTier(item)
    return {
      name: (item?.Name ?? '') as string,
      icon: (item?.Icon ?? '') as string,
      grade: (item?.Grade ?? '') as string,
      quality: itemQuality(item),
      tier,
      enlightenment: accEnlightenment(item),
      option: accOptions(item),
      tooltipRaw: (item?.Tooltip ?? '') as string,
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function namedInfo(item: any) {
    return {
      name: (item?.Name ?? '') as string,
      icon: (item?.Icon ?? '') as string,
      grade: (item?.Grade ?? '') as string,
      tooltipRaw: (item?.Tooltip ?? '') as string,
    }
  }

  return {
    armory: {
      equipList,
      equipment: {
        weapon: {
          name: weaponName,
          quality: itemQuality(weaponItem),
          refine: weaponRefine,
          grade: (weaponItem?.Grade ?? '') as string,
          icon: (weaponItem?.Icon ?? '') as string,
        },
      },
      accessory: {
        necklace: accInfo(necklaceItem),
        earing1: accInfo(earrings[0]),
        earing2: accInfo(earrings[1]),
        ring1: accInfo(rings[0]),
        ring2: accInfo(rings[1]),
        bangle: { ...accInfo(bangleItem), option: bangOptions(bangleItem) },
        stone: { ...namedInfo(stoneItem), option: stoneOptions(stoneItem) },
        compass: namedInfo(compItem),
        charm: namedInfo(charmItem),
        orb: namedInfo(orbItem),
      },
    },
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseArkPassive(arkPassive: any): {
  arkPassive: {
    evolution: ArkPassiveSection
    enlightenment: ArkPassiveSection
    leap: ArkPassiveSection
  }
} {
  const effects: unknown[] = arkPassive.Effects ?? []
  const points: unknown[] = arkPassive.Points ?? []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const evolutionPts = (points as any[]).find((p) => p.Name === '진화')?.Value ?? 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enlightenmentPts = (points as any[]).find((p) => p.Name === '깨달음')?.Value ?? 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leapPts = (points as any[]).find((p) => p.Name === '도약')?.Value ?? 0

  const evolutionNodes: ArkPassiveNode[] = []
  const enlightenmentNodes: ArkPassiveNode[] = []
  const leapNodes: ArkPassiveNode[] = []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const eff of effects as any[]) {
    const desc = eff.Description ?? ''
    const tip = parseTooltip(eff.ToolTip)

    const nodeName: string = stripHtml(tip.Element_000?.value ?? eff.Name ?? '')
    const levelRaw: string = stripHtml(tip.Element_001?.value?.leftText ?? '')
    const level = parseInt(levelRaw.replace(/[^0-9]/g, '') || '0')
    const tooltipText: string = stripHtml(tip.Element_002?.value ?? '')
    const icon: string = eff.Icon ?? ''

    let tier = 1
    const tierMatch = desc.match(/(\d+)티어/)
    if (tierMatch) tier = parseInt(tierMatch[1])

    const node: ArkPassiveNode = { name: nodeName, level, tier, icon, tooltip: tooltipText }

    if (desc.includes('진화')) {
      evolutionNodes.push(node)
    } else if (desc.includes('깨달음')) {
      enlightenmentNodes.push(node)
    } else if (desc.includes('도약')) {
      leapNodes.push(node)
    }
  }

  return {
    arkPassive: {
      evolution: { points: evolutionPts, karmaRank: 0, karmaLevel: 0, nodes: evolutionNodes },
      enlightenment: { points: enlightenmentPts, karmaRank: 0, karmaLevel: 0, nodes: enlightenmentNodes },
      leap: { points: leapPts, karmaRank: 0, karmaLevel: 0, nodes: leapNodes },
    },
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseEngraving(armoryEngraving: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const effects: any[] = armoryEngraving?.ArkPassiveEffects ?? []
  return {
    engraving: effects.map((e) => ({
      name: e.Name ?? '',
      level: e.Level ?? 0,
      icon: e.Icon ?? '',
    })),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseGems(armoryGem: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gems: any[] = armoryGem?.Gems ?? []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const effects: any[] = Array.isArray(armoryGem?.Effects)
    ? armoryGem.Effects
    : Object.values(armoryGem?.Effects ?? {})

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const effMap: Record<number, any> = {}
  for (const e of effects) {
    if (e.GemIdx !== undefined) effMap[e.GemIdx] = e
  }

  return {
    gem: gems.map((g, idx) => ({
      level: g.Level ?? 0,
      name: stripHtml(g.Name),
      icon: (g.Icon ?? '') as string,
      grade: g.Grade ?? '',
      type: (g.Name ?? '').includes('작열') ? 'cooldown' : 'damage',
      effect: effMap[idx]?.Description ?? '',
    })),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseCard(armoryCard: any): { card: string } {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const effects: any[] = armoryCard?.Effects ?? []
  if (!effects.length) return { card: '' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items: any[] = effects[0]?.Items ?? []
  let cardName = ''
  let maxAwake = 0
  for (const item of items) {
    const m = item.Name?.match(/(\d+)각성합계/)
    const awake = m ? parseInt(m[1]) : 0
    if (awake >= maxAwake) {
      maxAwake = awake
      const nameMatch = item.Name?.match(/^(.+?)\s+\d+세트\s+\((\d+)각성합계\)/)
      if (nameMatch) cardName = `${nameMatch[1]} ${nameMatch[2]}각`
    }
  }
  return { card: cardName }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseArkGrid(arkGrid: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const slots: any[] = arkGrid?.Slots ?? []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const effects: any[] = Array.isArray(arkGrid?.Effects)
    ? arkGrid.Effects
    : Object.values(arkGrid?.Effects ?? {})

  return {
    arkGrid: {
      slots: slots.map((s) => ({
        name: s.Name ?? '',
        grade: s.Grade ?? '',
        type: s.Type ?? '',
      })),
      effects: effects.map((e) => ({
        name: e.Name ?? '',
        description: stripHtml(e.Description ?? ''),
      })),
    },
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseSkills(armorySkills: any[]) {
  return {
    skills: (armorySkills ?? []).map((s) => ({
      name: s.Name ?? '',
      level: s.Level ?? 0,
      tripods: (s.Tripods ?? [])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((t: any) => t.IsSelected)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((t: any) => ({
          name: t.Name ?? '',
          tier: t.Tier ?? 0,
          tooltip: stripHtml(t.Tooltip ?? ''),
        })),
    })),
  }
}

// ===================================================================
// 메인 파서
// ===================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseApiResponse(apiData: any): CharData {
  const { stats, profile } = parseProfile(apiData.ArmoryProfile ?? {})
  const { armory } = parseEquipment(apiData.ArmoryEquipment ?? [])
  const { arkPassive } = parseArkPassive(apiData.ArkPassive ?? {})
  const { engraving } = parseEngraving(apiData.ArmoryEngraving)
  const { gem } = parseGems(apiData.ArmoryGem)
  const { card } = parseCard(apiData.ArmoryCard)
  const { arkGrid } = parseArkGrid(apiData.ArkGrid)
  const { skills } = parseSkills(apiData.ArmorySkills)

  return {
    profile,
    stats: stats as CharData['stats'],
    armory,
    arkPassive,
    engraving,
    gem,
    card,
    arkGrid,
    skills,
    uniqueKey: apiData.ArmoryProfile?.CharacterName ?? '',
  }
}
