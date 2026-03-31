/**
 * @file 캐릭터 장비 컴포넌트
 *
 * KLOA 레이아웃 기반, 장비 아이콘은 공식 전투정보실 방식 차용
 * (아이콘 PNG에 등급 테두리 내장 → object-contain 표시)
 * 마우스 호버 시 공식 전투정보실과 동일한 구조의 툴팁 표시
 */

import Image from 'next/image'
import { EquipmentTooltip } from './equipment-tooltip'
import type { ArmoryData, EquipItem, AccessoryInfo, NamedItem } from '@/types/character'

// ===================================================================
// 헬퍼
// ===================================================================

function gradeNameColor(grade: string): string {
  switch (grade) {
    case '고대':   return 'text-[#E3C7A1]'
    case '유물':   return 'text-[#FA5D00]'
    case '전설':   return 'text-[#FFD200]'
    case '영웅':   return 'text-purple-400'
    case '희귀':   return 'text-blue-400'
    default:       return 'text-white/70'
  }
}

function qualityBg(q: number): string {
  if (q >= 100) return 'bg-amber-500 text-black'
  if (q >= 75)  return 'bg-sky-600 text-white'
  if (q >= 25)  return 'bg-yellow-600 text-white'
  if (q >= 1)   return 'bg-red-700 text-white'
  return 'bg-white/10 text-white/40'
}

function optionColor(prefix: string): string {
  switch (prefix) {
    case '상': return 'text-[#FE9600]'
    case '중': return 'text-[#CE43FC]'
    case '하': return 'text-[#00B5FF]'
    default:   return 'text-white/60'
  }
}

// ===================================================================
// 서브 컴포넌트
// ===================================================================

/** 티어 배지 */
function TierBadge({ tier }: { tier: number }) {
  if (!tier) return null
  return (
    <span className="absolute left-0 top-0 z-10 rounded-br rounded-tl-sm bg-black/80 px-[3px] py-[1px] text-[9px] font-bold leading-none text-white/60">
      T{tier}
    </span>
  )
}

/** 품질 수치 배지 */
function QualityBadge({ quality }: { quality: number }) {
  if (quality < 0) return null
  return (
    <span className={`rounded px-1.5 py-[2px] text-[10px] font-bold tabular-nums leading-none ${qualityBg(quality)}`}>
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
          : <span key={i} className="text-white/70">{part}</span>
      )}
    </p>
  )
}

// ===================================================================
// 아이콘 (공식 방식 — PNG 내장 테두리 + bg_special_slot 오버레이)
// ===================================================================

/** 공식 전투정보실과 동일: 아이콘 위에 프레임 오버레이 적용 */
const BG_SLOT_URL =
  'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/game/bg_special_slot.png'

function ItemIcon({
  icon, name, tier, size = 36,
}: {
  icon: string; name: string; tier: number; size?: number
}) {
  return (
    <div
      className="relative shrink-0"
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${BG_SLOT_URL})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#0d1117',
      }}
    >
      {icon && (
        <Image
          src={icon}
          alt={name}
          fill
          className="object-contain"
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
    <EquipmentTooltip tooltipRaw={item.tooltipRaw} icon={item.icon} side="right">
      <div className="flex cursor-default items-center gap-2">
        <ItemIcon icon={item.icon} name={item.name} tier={item.tier} />
        <div className="min-w-0 flex-1">
          <p className={`truncate text-[11px] font-medium leading-tight ${gradeNameColor(item.grade)}`}>
            {item.name || '—'}
          </p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <QualityBadge quality={item.quality} />
            {item.itemLevel > 0 && (
              <span className="text-[10px] text-white/35">{item.itemLevel}</span>
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
  showEnlightenment?: boolean
  tooltipSide?: 'right' | 'left'
}

function AccessoryRow({ item, showEnlightenment = true, tooltipSide = 'left' }: AccessoryRowProps) {
  if (!item.name) return null

  return (
    <EquipmentTooltip tooltipRaw={item.tooltipRaw} icon={item.icon} side={tooltipSide}>
      <div className="flex cursor-default items-start gap-2">
        <ItemIcon icon={item.icon} name={item.name} tier={item.tier} />

        {/* 이름 + 품질 */}
        <div className="w-[120px] shrink-0">
          <p className={`truncate text-[11px] font-medium leading-tight ${gradeNameColor(item.grade)}`}>
            {item.name}
          </p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <QualityBadge quality={item.quality} />
            {showEnlightenment && item.enlightenment > 0 && (
              <span className="text-[10px] text-white/35">깨달음 +{item.enlightenment}</span>
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
    <EquipmentTooltip tooltipRaw={item.tooltipRaw} icon={item.icon} side="right">
      <div className="flex cursor-default items-center gap-2">
        <ItemIcon icon={item.icon} name={item.name} tier={0} />
        <div className="min-w-0">
          <p className="text-[10px] text-white/30">보주</p>
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
    <EquipmentTooltip tooltipRaw={item.tooltipRaw} icon={item.icon} side="left">
      <div className="flex cursor-default items-start gap-2">
        <ItemIcon icon={item.icon} name={item.name} tier={item.tier} />
        <div className="min-w-0">
          <p className={`truncate text-[11px] font-medium leading-tight ${gradeNameColor(item.grade)}`}>
            {item.name}
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {item.option.map((opt, i) => (
              <span key={i} className="rounded bg-white/10 px-1.5 py-[2px] text-[10px] text-white/70">
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

function StoneRow({ item }: { item: AccessoryInfo }) {
  if (!item.name) return null
  return (
    <EquipmentTooltip tooltipRaw={item.tooltipRaw} icon={item.icon} side="left">
      <div className="flex cursor-default items-start gap-2">
        <ItemIcon icon={item.icon} name={item.name} tier={item.tier} />

        <div className="w-[120px] shrink-0">
          <p className={`truncate text-[11px] font-medium leading-tight ${gradeNameColor(item.grade)}`}>
            {item.name}
          </p>
          <div className="mt-0.5">
            <span className="text-[10px] text-white/35">Lv.{item.quality >= 0 ? item.quality : 5}</span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          {item.option.map((opt, i) => <OptionLine key={i} text={opt} />)}
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
    <div className="rounded-lg bg-card p-4 shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">

      {/* ── 상단: 방어구(좌) + 악세서리(우) ── */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {/* 좌: 방어구 6종 */}
        <div className="space-y-2">
          {armorSorted.map((item) => (
            <ArmorRow key={item.type} item={item} />
          ))}
        </div>

        {/* 우: 목걸이/귀걸이×2/반지×2 */}
        <div className="space-y-2">
          {accessories.map((item, i) => (
            <AccessoryRow key={i} item={item} tooltipSide="left" />
          ))}
          {/* 어빌리티 스톤 */}
          <StoneRow item={accessory.stone as AccessoryInfo} />
        </div>
      </div>

      {/* 구분선 */}
      <div className="my-3 h-px bg-white/[0.06]" />

      {/* ── 하단: 보주(좌) + 팔찌(우) ── */}
      <div className="grid grid-cols-2 gap-x-4">
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
