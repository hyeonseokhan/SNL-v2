/**
 * @file 공식 API 응답 → CharData 변환
 *
 * 공식 API 응답(`/armories/characters/{name}?filters=...`)을
 * CharData 포맷으로 변환합니다.
 */

import type { CharData, CharStats, ArkPassiveSection, ArkPassiveNode } from '@/types/character'

// ===================================================================
// 내부 헬퍼
// ===================================================================

function stripHtml(s: string | undefined): string {
  return (s ?? '').replace(/<[^>]+>/g, '').trim()
}

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

function parseProfile(armoryProfile: any) {
  const stats: CharStats = {
    critical: 0,
    haste: 0,
    special: 0,
    suppress: 0,
    patience: 0,
    expert: 0,
    combatPower: 0,
    attack: 0,
    maxHp: 0,
  }
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
      case '최대 생명력':
        stats.maxHp = Number(s.Value)
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

function parseEquipment(equipment: any[]) {
  const EQUIP_TYPES = ['무기', '투구', '어깨', '상의', '하의', '장갑']

  // ── 헬퍼 ──────────────────────────────────────────────
  function itemQuality(item: any): number {
    if (!item) return -1
    const t = parseTooltip(item.Tooltip)
    return t.Element_001?.value?.qualityValue ?? -1
  }

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

  function accOptions(item: any): string[] {
    if (!item) return []
    const t = parseTooltip(item.Tooltip)
    const raw = t.Element_006?.value?.Element_001 ?? ''
    return parseEnhanceOptions(raw)
  }

  function bangOptions(item: any): string[] {
    if (!item) return []
    const t = parseTooltip(item.Tooltip)
    const raw = t.Element_005?.value?.Element_001 ?? ''
    return parseBangleOptions(raw)
  }

  function stoneOptions(item: any): string[] {
    if (!item) return []
    const t = parseTooltip(item.Tooltip)
    const r1 = stripHtml(t.Element_004?.value?.Element_001 ?? '')
    const r2 = stripHtml(t.Element_005?.value?.Element_001 ?? '')
    return [r1, r2].filter(Boolean)
  }

  /** 스톤 각인 효과 + 레벨 보너스 추출 */
  function stoneEngravingsAndBonus(item: any): { engravings: { name: string; level: number; isNegative: boolean }[]; levelBonus: string } {
    if (!item) return { engravings: [], levelBonus: '' }
    const t = parseTooltip(item.Tooltip)
    const engravings: { name: string; level: number; isNegative: boolean }[] = []
    let levelBonus = ''
    for (let i = 0; i <= 15; i++) {
      const key = `Element_${String(i).padStart(3, '0')}`
      const el = t[key]
      if (!el || el.type !== 'IndentStringGroup') continue
      const contentStr = el.value?.Element_000?.contentStr ?? {}
      for (const k of Object.keys(contentStr).sort()) {
        const raw: string = contentStr[k]?.contentStr ?? ''
        // 레벨 보너스 (녹색 #73DC04)
        if (raw.includes('73DC04')) {
          levelBonus = stripHtml(raw).replace(/\[레벨 보너스\]\s*/, '')
          continue
        }
        const nameMatch = raw.match(/\[(?:<[^>]+>)*([^<\]]+)(?:<[^>]+>)*\]/)
        const lvMatch = raw.match(/Lv\.(\d+)/)
        if (!nameMatch || !lvMatch) continue
        const isNegative = raw.includes("FE2E2E")
        engravings.push({ name: nameMatch[1], level: parseInt(lvMatch[1]), isNegative })
      }
    }
    return { engravings, levelBonus }
  }

  /** 보주 낙원력 추출 */
  function orbParadisePower(item: any): number {
    if (!item) return 0
    const t = parseTooltip(item.Tooltip)
    for (let i = 0; i <= 10; i++) {
      const key = `Element_${String(i).padStart(3, '0')}`
      const el = t[key]
      if (!el || el.type !== 'ItemPartBox') continue
      const content: string = el.value?.Element_001 ?? ''
      const match = content.match(/최대 낙원력\s*:\s*([\d,]+)/)
      if (match) return parseInt(match[1].replace(/,/g, ''))
    }
    return 0
  }

  // ── equipList (방어구 6종) ──────────────────────────────
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

  function namedInfo(item: any) {
    const { tier } = itemLevelAndTier(item)
    return {
      name: (item?.Name ?? '') as string,
      icon: (item?.Icon ?? '') as string,
      grade: (item?.Grade ?? '') as string,
      tier,
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
        stone: { ...namedInfo(stoneItem), option: stoneOptions(stoneItem), ...stoneEngravingsAndBonus(stoneItem) },
        compass: namedInfo(compItem),
        charm: namedInfo(charmItem),
        orb: { ...namedInfo(orbItem), paradisePower: orbParadisePower(orbItem) },
      },
    },
  }
}

function parseArkPassive(arkPassive: any): {
  arkPassive: {
    evolution: ArkPassiveSection
    enlightenment: ArkPassiveSection
    leap: ArkPassiveSection
  }
} {
  const effects: unknown[] = arkPassive.Effects ?? []
  const points: unknown[] = arkPassive.Points ?? []

  /** Points의 Description("6랭크 25레벨")에서 랭크·레벨 추출 */
  function parseRankLevel(pt: any): { value: number; rank: number; level: number } {
    const value: number = pt?.Value ?? 0
    const desc: string = pt?.Description ?? ''
    const rankMatch = desc.match(/(\d+)랭크/)
    const levelMatch = desc.match(/(\d+)레벨/)
    return { value, rank: rankMatch ? parseInt(rankMatch[1]) : 0, level: levelMatch ? parseInt(levelMatch[1]) : 0 }
  }

  const evolution = parseRankLevel((points as any[]).find((p) => p.Name === '진화'))
  const enlightenment = parseRankLevel((points as any[]).find((p) => p.Name === '깨달음'))
  const leap = parseRankLevel((points as any[]).find((p) => p.Name === '도약'))

  const evolutionNodes: ArkPassiveNode[] = []
  const enlightenmentNodes: ArkPassiveNode[] = []
  const leapNodes: ArkPassiveNode[] = []

  for (const eff of effects as any[]) {
    const desc = eff.Description ?? ''
    const tip = parseTooltip(eff.ToolTip)

    const nodeName: string = stripHtml(tip.Element_000?.value ?? eff.Name ?? '')
    const levelRaw: string = stripHtml(tip.Element_001?.value?.leftText ?? '')
    const level = parseInt(levelRaw.replace(/[^0-9]/g, '') || '0')
    const tooltipRaw: string = (tip.Element_002?.value ?? '')
      .replace(/\|\|/g, '')
      .replace(/<BR\s*\/?>/gi, '')
      .trim()
    const icon: string = eff.Icon ?? ''

    let tier = 1
    const tierMatch = desc.match(/(\d+)티어/)
    if (tierMatch) tier = parseInt(tierMatch[1])

    const node: ArkPassiveNode = { name: nodeName, level, tier, icon, tooltip: tooltipRaw }

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
      evolution: { points: evolution.value, karmaRank: evolution.rank, karmaLevel: evolution.level, nodes: evolutionNodes },
      enlightenment: { points: enlightenment.value, karmaRank: enlightenment.rank, karmaLevel: enlightenment.level, nodes: enlightenmentNodes },
      leap: { points: leap.value, karmaRank: leap.rank, karmaLevel: leap.level, nodes: leapNodes },
    },
  }
}

/**
 * 각인 데이터 파싱
 *
 * ArmoryEngraving.ArkPassiveEffects에서 각인 정보를 추출합니다.
 *
 * @param armoryEngraving - 공식 API의 ArmoryEngraving 응답
 * @returns 파싱된 각인 배열
 */
function parseEngraving(armoryEngraving: any) {
  const effects: any[] = armoryEngraving?.ArkPassiveEffects ?? []
  return {
    engraving: effects.map((e) => ({
      name: (e.Name ?? '') as string,
      level: (e.Level ?? 0) as number,
      grade: (e.Grade ?? '') as string,
      stoneLevel: (e.AbilityStoneLevel ?? 0) as number,
      description: (e.Description ?? '') as string,
      icon: (e.Icon ?? '') as string,
    })),
  }
}

/**
 * 보석 데이터 파싱
 *
 * ArmoryGem.Gems[]와 ArmoryGem.Effects.Skills[]를 매칭하여
 * 각 보석의 적용 스킬명, 효과, 추가 옵션을 추출합니다.
 *
 * @param armoryGem - 공식 API의 ArmoryGem 응답
 * @returns 파싱된 보석 배열
 */
function parseGems(armoryGem: any) {
  const gems: any[] = armoryGem?.Gems ?? []
  const skills: any[] = armoryGem?.Effects?.Skills ?? []

  // GemSlot → Skills 매핑
  const skillMap: Record<number, any> = {}
  for (const s of skills) {
    if (s.GemSlot !== undefined) skillMap[s.GemSlot] = s
  }

  return {
    gem: gems.map((g) => {
      const slot = g.Slot ?? 0
      const skill = skillMap[slot]
      const desc = Array.isArray(skill?.Description) ? skill.Description.join(', ') : ''
      return {
        level: g.Level ?? 0,
        name: stripHtml(g.Name),
        icon: (g.Icon ?? '') as string,
        grade: g.Grade ?? '',
        type: (g.Name ?? '').includes('작열') ? 'cooldown' : 'damage',
        effect: desc,
        skillName: (skill?.Name ?? '') as string,
        skillIcon: (skill?.Icon ?? '') as string,
        option: (skill?.Option ?? '') as string,
      }
    }),
  }
}

function parseCard(armoryCard: any) {
  // 개별 카드
  const rawCards: any[] = armoryCard?.Cards ?? []
  const cards = rawCards.map((c) => ({
    slot: c.Slot ?? 0,
    name: c.Name ?? '',
    icon: c.Icon ?? '',
    grade: c.Grade ?? '',
    awakeCount: c.AwakeCount ?? 0,
    awakeTotal: c.AwakeTotal ?? 5,
  }))

  // 세트 효과
  const effects: any[] = armoryCard?.Effects ?? []
  const setEffects: { name: string; description: string }[] = []
  let setName = ''
  let setSummary = ''

  for (const eff of effects) {
    for (const item of eff.Items ?? []) {
      const rawName: string = item.Name ?? ''
      const desc: string = item.Description ?? ''

      // 세트명 추출 (첫 번째 항목에서)
      const nameMatch = rawName.match(/^(.+?)\s+\d+세트/)
      if (nameMatch && !setName) setName = nameMatch[1]

      // 표시용 조건명: "2세트", "12각성" 등
      const setCountMatch = rawName.match(/(\d+)세트/)
      const awakeMatch = rawName.match(/\((\d+)각성합계\)/)
      const label = awakeMatch ? `${awakeMatch[1]}각성` : setCountMatch ? `${setCountMatch[1]}세트` : rawName

      setEffects.push({ name: label, description: desc })

      // 요약: 가장 마지막 효과 기준
      if (awakeMatch) {
        setSummary = `${setName} ${awakeMatch[1]}각`
      } else if (setCountMatch && !setSummary) {
        setSummary = `${setName} ${setCountMatch[1]}세트`
      }
    }
  }

  return { card: { cards, setName, setSummary, setEffects } }
}

function parseArkGrid(arkGrid: any) {
  const slots: any[] = arkGrid?.Slots ?? []
  const effects: any[] = Array.isArray(arkGrid?.Effects)
    ? arkGrid.Effects
    : Object.values(arkGrid?.Effects ?? {})

  return {
    arkGrid: {
      slots: slots.map((s) => {
        const tip = parseTooltip(s.Tooltip)
        // 고정 인덱스 대신 ItemPartBox의 라벨 키워드로 검색
        let coreType = ''
        let coreWillpower = ''
        let coreOptions = ''
        for (let i = 0; i <= 15; i++) {
          const key = `Element_${String(i).padStart(3, '0')}`
          const el = tip[key]
          if (el?.type !== 'ItemPartBox') continue
          const label = el.value?.Element_000 ?? ''
          const value = el.value?.Element_001 ?? ''
          if (label.includes('코어 타입')) coreType = stripHtml(value)
          else if (label.includes('코어 공급 의지력')) coreWillpower = value
          else if (label.includes('코어 옵션') && !label.includes('발동 조건')) coreOptions = value
        }
        return {
          name: s.Name ?? '',
          grade: s.Grade ?? '',
          type: s.Type ?? '',
          icon: s.Icon ?? '',
          point: s.Point ?? 0,
          coreType,
          coreWillpower,
          coreOptions,
        }
      }),
      effects: effects.map((e) => ({
        name: e.Name ?? '',
        level: e.Level ?? 0,
        description: e.Tooltip ?? e.Description ?? '',
      })),
    },
  }
}

function parseSkills(armorySkills: any[]) {
  return {
    skills: (armorySkills ?? []).map((s) => ({
      name: s.Name ?? '',
      level: s.Level ?? 0,
      tripods: (s.Tripods ?? [])
        .filter((t: any) => t.IsSelected)
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

export function parseApiResponse(apiData: any): CharData {
  const { stats, profile } = parseProfile(apiData.ArmoryProfile ?? {})
  const { armory } = parseEquipment(apiData.ArmoryEquipment ?? [])
  const { arkPassive } = parseArkPassive(apiData.ArkPassive ?? {})
  const { engraving } = parseEngraving(apiData.ArmoryEngraving)
  const { gem } = parseGems(apiData.ArmoryGem)
  const { card } = parseCard(apiData.ArmoryCard)
  const { arkGrid } = parseArkGrid(apiData.ArkGrid)
  const { skills } = parseSkills(apiData.ArmorySkills)

  // 직업 각인(secondClass)은 깨달음 1티어 첫 번째 노드에서 추출
  const tier1Enlightenment = arkPassive.enlightenment.nodes.find((n) => n.tier === 1)
  if (tier1Enlightenment?.name) {
    profile.secondClass = tier1Enlightenment.name
  }

  return {
    profile,
    stats,
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
