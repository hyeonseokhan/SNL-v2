/**
 * @file 캐릭터 장비 컴포넌트
 *
 * KLOA 레이아웃 기반, 장비 아이콘은 공식 전투정보실 방식 차용
 * (아이콘 PNG에 등급 테두리 내장 → object-contain 표시)
 * 마우스 호버 시 공식 전투정보실과 동일한 구조의 툴팁 표시
 */

import Image from 'next/image'
import { EquipmentTooltip } from './equipment-tooltip'
import type { ArmoryData, EquipItem, AccessoryInfo, NamedItem, StoneEngraving } from '@/types/character'

// ===================================================================
// 헬퍼
// ===================================================================

function gradeNameColor(grade: string): string {
  switch (grade) {
    case '고대':   return 'text-[#7A5C1E] dark:text-[#E3C7A1]'
    case '유물':   return 'text-[#C44A00] dark:text-[#FA5D00]'
    case '전설':   return 'text-[#9A7A00] dark:text-[#FFD200]'
    case '영웅':   return 'text-purple-700 dark:text-purple-400'
    case '희귀':   return 'text-blue-700 dark:text-blue-400'
    default:       return 'text-tx-body'
  }
}

/** 공식 전투정보실 q0-q6 색상 시스템 */
function qualityColor(q: number): string {
  if (q === 100) return '#fe9600'  // q6
  if (q > 89)    return '#ce43fc'  // q5
  if (q > 69)    return '#00b5ff'  // q4
  if (q > 29)    return '#91fe02'  // q3
  if (q > 9)     return '#ffd200'  // q2
  if (q >= 1)    return '#ff6000'  // q1
  return 'rgba(255,255,255,0.2)'   // q0
}

function optionColor(prefix: string): string {
  switch (prefix) {
    case '상': return 'text-[#FE9600]'
    case '중': return 'text-[#CE43FC]'
    case '하': return 'text-[#00B5FF]'
    default:   return 'text-tx-label'
  }
}

// ===================================================================
// 서브 컴포넌트
// ===================================================================

/** 티어 배지 */
function TierBadge({ tier }: { tier: number }) {
  if (!tier) return null
  return (
    <span className="absolute left-0 top-0 z-10 rounded-br rounded-tl-sm bg-black px-[3px] py-[1px] text-[9px] font-bold leading-none text-white">
      T{tier}
    </span>
  )
}

/** 품질 수치 배지 */
function QualityBadge({ quality }: { quality: number }) {
  if (quality < 0) return null
  const color = qualityColor(quality)
  return (
    <span
      className="rounded px-1.5 py-[2px] text-[10px] font-bold tabular-nums leading-none"
      style={{ color, border: `1px solid ${color}40`, backgroundColor: `${color}18` }}
    >
      {quality}
    </span>
  )
}

/** 옵션 한 줄: "상 공격력 +1.55%" 형태 */
function OptionLine({ text }: { text: string }) {
  const prefix = text.slice(0, 1)
  const body   = text.slice(2) // prefix + 공백 제거
  const parts  = body.split(/(\+[\d,.]+%?|\d[\d,.]*%)/)

  return (
    <p className="whitespace-nowrap text-[10px] leading-[1.45]">
      <span className={`mr-0.5 font-bold ${optionColor(prefix)}`}>{prefix}</span>
      {parts.map((part, i) =>
        /^(\+[\d,.]+%?|\d[\d,.]+%?)$/.test(part)
          ? <span key={i} className={optionColor(prefix)}>{part}</span>
          : <span key={i} className="text-black/80 dark:text-white/80">{part}</span>
      )}
    </p>
  )
}

// ===================================================================
// 아이콘 (공식 전투정보실 방식 — 등급·슬롯별 테두리 이미지 오버레이)
// ===================================================================

const CDN = 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/game'

/** 빈 슬롯 플레이스홀더 이미지 번호 (장비 미착용 시) */
const EMPTY_SLOT_NUM: Record<string, number> = {
  '투구': 1, '어깨': 2, '상의': 3, '하의': 4, '장갑': 5, '무기': 6,
  '목걸이': 7, 'earing1': 8, 'earing2': 9, 'ring1': 10, 'ring2': 11,
  '팔찌': 19, 'stone': 12,
}

/** 방어구 타입 여부 (overlay 사용 여부 결정) */
const ARMOR_TYPES = new Set(['투구', '어깨', '상의', '하의', '장갑', '무기'])

/**
 * 등급별 배경 그라디언트
 * 고대·유물은 KLOA getComputedStyle에서 직접 확인한 값
 */
function gradeBackground(grade: string): string {
  switch (grade) {
    case '고대': return 'linear-gradient(135deg, rgb(61,51,37), rgb(220,201,153))'
    case '유물': return 'linear-gradient(135deg, rgb(52,26,9), rgb(162,64,6))'
    case '전설': return 'linear-gradient(135deg, rgb(40,32,0), rgb(168,138,0))'
    case '영웅': return 'linear-gradient(135deg, rgb(26,8,36), rgb(118,44,188))'
    case '희귀': return 'linear-gradient(135deg, rgb(8,18,40), rgb(28,82,178))'
    default:     return 'linear-gradient(135deg, rgb(18,20,26), rgb(45,48,58))'
  }
}

function ItemIcon({
  icon, name, tier, grade = '', itemType = '', size = 36,
}: {
  icon: string; name: string; tier: number; grade?: string; itemType?: string; size?: number
}) {
  // 장비 미착용: 빈 슬롯 플레이스홀더
  if (!icon) {
    const slotN = itemType === 'orb' ? 'orb' : (EMPTY_SLOT_NUM[itemType] ?? 1)
    const emptyUrl = itemType === 'orb'
      ? `${CDN}/bg_equipment_slot_orb.png`
      : `${CDN}/bg_equipment_slot${slotN}.png`
    return (
      <div
        className="relative shrink-0"
        style={{ width: size, height: size, backgroundImage: `url(${emptyUrl})`, backgroundSize: '100% 100%', backgroundColor: '#0d1117' }}
      >
        <TierBadge tier={tier} />
      </div>
    )
  }

  // 장비 착용: Layer1(등급 그라디언트 배경) + Layer2(아이템 PNG) + Layer3(방어구만 petBorder overlay)
  const isArmor = ARMOR_TYPES.has(itemType)
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-sm"
      style={{ width: size, height: size, background: gradeBackground(grade) }}
    >
      {/* Layer 2: 아이템 PNG */}
      <Image
        src={icon}
        alt={name}
        fill
        className="object-contain"
        sizes={`${size}px`}
        unoptimized
      />
      {/* Layer 3: 방어구에만 petBorder 오버레이 */}
      {isArmor && (
        <Image
          src={`${CDN}/bg_equipment_petBorder.png`}
          alt=""
          fill
          className="pointer-events-none object-fill"
          sizes={`${size}px`}
          unoptimized
        />
      )}
      <TierBadge tier={tier} />
    </div>
  )
}

// ===================================================================
// 방어구 행
// ===================================================================

function ArmorRow({ item }: { item: EquipItem }) {
  return (
    <EquipmentTooltip tooltipRaw={item.tooltipRaw} icon={item.icon} itemType={item.type} side="right">
      <div className="flex cursor-default items-center gap-2">
        <ItemIcon icon={item.icon} name={item.name} tier={item.tier} grade={item.grade} itemType={item.type} />
        <div className="min-w-0 flex-1">
          <p className={`truncate text-[11px] font-medium leading-tight ${gradeNameColor(item.grade)}`}>
            {item.name || '—'}
          </p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <QualityBadge quality={item.quality} />
            {item.itemLevel > 0 && (
              <span className="text-[10px] text-black/80 dark:text-white/80">
                <span className="text-[8px]">·</span> iLv {item.itemLevel}
              </span>
            )}
          </div>
        </div>
      </div>
    </EquipmentTooltip>
  )
}

// ===================================================================
// 악세서리 행
// ===================================================================

interface AccessoryRowProps {
  item: AccessoryInfo
  itemType: string
  showEnlightenment?: boolean
  tooltipSide?: 'right' | 'left'
}

function AccessoryRow({ item, itemType, showEnlightenment = true, tooltipSide = 'left' }: AccessoryRowProps) {
  if (!item.name) return null

  return (
    <EquipmentTooltip tooltipRaw={item.tooltipRaw} icon={item.icon} itemType={itemType} side={tooltipSide}>
      <div className="flex cursor-default items-start gap-2">
        <ItemIcon icon={item.icon} name={item.name} tier={item.tier} grade={item.grade} itemType={itemType} />

        {/* 이름 + 품질 */}
        <div className="w-[100px] shrink-0">
          <p className={`truncate text-[11px] font-medium leading-tight ${gradeNameColor(item.grade)}`}>
            {item.name}
          </p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <QualityBadge quality={item.quality} />
            {showEnlightenment && item.enlightenment > 0 && (
              <span className="text-[10px] text-tx-muted">깨달음 +{item.enlightenment}</span>
            )}
          </div>
        </div>

        {/* 옵션 */}
        <div className="min-w-0 flex-1">
          {item.option.map((opt, i) => <OptionLine key={i} text={opt} />)}
        </div>
      </div>
    </EquipmentTooltip>
  )
}

// ===================================================================
// 보주 행
// ===================================================================

function OrbRow({ item }: { item: NamedItem }) {
  if (!item.name) return null
  return (
    <EquipmentTooltip tooltipRaw={item.tooltipRaw} icon={item.icon} itemType="orb" side="right">
      <div className="flex cursor-default items-center gap-2">
        <ItemIcon icon={item.icon} name={item.name} tier={0} grade={item.grade} itemType="orb" />
        <div className="min-w-0">
          <p className="text-[10px] text-tx-muted">보주</p>
          <p className={`truncate text-[11px] font-medium leading-tight ${gradeNameColor(item.grade)}`}>
            {item.name}
          </p>
        </div>
      </div>
    </EquipmentTooltip>
  )
}

// ===================================================================
// 팔찌 행
// ===================================================================

function BangleRow({ item }: { item: AccessoryInfo }) {
  if (!item.name) return null
  return (
    <EquipmentTooltip tooltipRaw={item.tooltipRaw} icon={item.icon} itemType="팔찌" side="left">
      <div className="flex cursor-default items-start gap-2">
        <ItemIcon icon={item.icon} name={item.name} tier={item.tier} grade={item.grade} itemType="팔찌" />
        <div className="min-w-0">
          <p className={`truncate text-[11px] font-medium leading-tight ${gradeNameColor(item.grade)}`}>
            {item.name}
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {item.option.map((opt, i) => (
              <span key={i} className="rounded bg-white/10 px-1.5 py-[2px] text-[10px] text-tx-label">
                {opt}
              </span>
            ))}
          </div>
        </div>
      </div>
    </EquipmentTooltip>
  )
}

// ===================================================================
// 어빌리티 스톤 행
// ===================================================================

function StoneEngravingLine({ eng }: { eng: StoneEngraving }) {
  const lvColor = eng.isNegative ? 'text-[#C24B46]' : 'text-[#00B5FF]'
  return (
    <p className="whitespace-nowrap text-[10px] leading-[1.45]">
      <span className="text-black/80 dark:text-white/80">{eng.name} </span>
      <span className={lvColor}>Lv.{eng.level}</span>
    </p>
  )
}

function StoneRow({ item }: { item: NamedItem & { option: string[]; engravings: StoneEngraving[] } }) {
  if (!item.name) return null
  return (
    <EquipmentTooltip tooltipRaw={item.tooltipRaw} icon={item.icon} itemType="stone" side="left">
      <div className="flex cursor-default items-start gap-2">
        <ItemIcon icon={item.icon} name={item.name} tier={item.tier} grade={item.grade} itemType="stone" />

        <div className="w-[100px] shrink-0">
          <p className={`truncate text-[11px] font-medium leading-tight ${gradeNameColor(item.grade)}`}>
            {item.name}
          </p>
          <div className="mt-0.5">
            <span className="text-[10px] text-black/50 dark:text-white/50">Lv.5</span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          {(item.engravings ?? []).map((eng, i) => <StoneEngravingLine key={i} eng={eng} />)}
        </div>
      </div>
    </EquipmentTooltip>
  )
}

// ===================================================================
// 메인 컴포넌트
// ===================================================================

interface CharacterEquipmentProps {
  armory: ArmoryData
}

export function CharacterEquipment({ armory }: CharacterEquipmentProps) {
  const { equipList, accessory } = armory

  // 방어구 순서: 투구 → 어깨 → 상의 → 하의 → 장갑 → 무기
  const ARMOR_ORDER = ['투구', '어깨', '상의', '하의', '장갑', '무기']
  const emptyArmor: EquipItem = {
    type: '', name: '', icon: '', grade: '', quality: -1,
    itemLevel: 0, tier: 0, refine: 0, option: [], tooltipRaw: '',
  }
  const armorSorted = ARMOR_ORDER.map(
    (type) => equipList.find((e) => e.type === type) ?? { ...emptyArmor, type }
  )

  const accessories: AccessoryInfo[] = [
    accessory.necklace,
    accessory.earing1,
    accessory.earing2,
    accessory.ring1,
    accessory.ring2,
  ]

  return (
    <div className="rounded-lg bg-card p-3 shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">

      {/* ── 상단: 방어구(좌) + 악세서리(우) ── */}
      <div className="grid grid-cols-[5fr_6fr] gap-x-2 gap-y-2">
        {/* 좌: 방어구 6종 */}
        <div className="space-y-2">
          {armorSorted.map((item) => (
            <ArmorRow key={item.type} item={item} />
          ))}
        </div>

        {/* 우: 목걸이/귀걸이×2/반지×2 + 스톤 */}
        <div className="space-y-2">
          {(['목걸이', 'earing1', 'earing2', 'ring1', 'ring2'] as const).map((type, i) => (
            <AccessoryRow key={type} item={accessories[i]} itemType={type} tooltipSide="left" />
          ))}
          <StoneRow item={accessory.stone} />
        </div>
      </div>

      {/* 구분선 */}
      <div className="my-3 h-px bg-white/[0.06]" />

      {/* ── 하단: 보주(좌) + 팔찌(우) ── */}
      <div className="grid grid-cols-[5fr_6fr] gap-x-2">
        <div>
          <OrbRow item={accessory.orb} />
        </div>
        <div>
          <BangleRow item={accessory.bangle as AccessoryInfo} />
        </div>
      </div>

    </div>
  )
}
