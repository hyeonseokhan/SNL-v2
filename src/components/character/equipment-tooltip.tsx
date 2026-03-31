'use client'

/**
 * @file 장비 마우스 호버 툴팁
 *
 * 로스트아크 공식 전투정보실과 동일한 구조로
 * 장비 아이콘 호버 시 상세 정보를 표시합니다.
 */

import Image from 'next/image'
import { parseTooltipJson } from '@/lib/tooltip-parser'
import type { ParsedTooltip, TooltipLine } from '@/lib/tooltip-parser'

// ===================================================================
// 아이콘 헬퍼 (character-equipment와 동일한 3레이어 구조)
// ===================================================================

const CDN = 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/game'
const ARMOR_TYPES = new Set(['투구', '어깨', '상의', '하의', '장갑', '무기'])

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

/** gradeType 문자열("고대 우산" 등)에서 등급 추출 */
function extractGrade(gradeType: string): string {
  for (const g of ['고대', '유물', '전설', '영웅', '희귀']) {
    if (gradeType.includes(g)) return g
  }
  return ''
}

// ===================================================================
// 헬퍼
// ===================================================================

const LINE_COLOR: Record<string, string> = {
  orange:    'text-[#FE9600]',
  purple:    'text-[#CE43FC]',
  blue:      'text-[#00B5FF]',
  lightblue: 'text-[#A9D0F5]',
  ancient:   'text-[#E3C7A1]',
  relic:     'text-[#FA5D00]',
  legendary: 'text-[#FFD200]',
  red:       'text-[#C24B46]',
  teal:      'text-[#5FD3F1]',
  white:     'text-white/90',
  gray:      'text-white/35',
}

const GRADE_NAME_COLOR: Record<string, string> = {
  '고대':   'text-[#E3C7A1]',
  '유물':   'text-[#FA5D00]',
  '전설':   'text-[#FFD200]',
  '영웅':   'text-purple-400',
  '희귀':   'text-blue-400',
}

function gradeNameColor(gradeType: string): string {
  for (const [grade, cls] of Object.entries(GRADE_NAME_COLOR)) {
    if (gradeType.includes(grade)) return cls
  }
  return 'text-white'
}

function qualityBarColor(q: number): string {
  if (q >= 100) return 'bg-amber-400'
  if (q >= 75)  return 'bg-blue-500'
  if (q >= 25)  return 'bg-yellow-500'
  return 'bg-red-600'
}

// ===================================================================
// 서브 컴포넌트
// ===================================================================

function QualityBar({ quality }: { quality: number }) {
  if (quality < 0) return null
  const pct = Math.max(0, Math.min(100, quality))
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="text-white/40">품질</span>
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full ${qualityBarColor(quality)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`tabular-nums font-bold ${qualityBarColor(quality).replace('bg-', 'text-')}`}>
        {quality}
      </span>
    </div>
  )
}

function LineText({ line }: { line: TooltipLine }) {
  return (
    <span className={`text-[11px] leading-[1.5] ${LINE_COLOR[line.color] ?? 'text-white/80'}`}>
      {line.text}
    </span>
  )
}

// ===================================================================
// 메인 툴팁 컨텐츠
// ===================================================================

interface TooltipContentProps {
  parsed: ParsedTooltip
  icon: string
  itemType?: string
}

function TooltipContent({ parsed, icon, itemType = '' }: TooltipContentProps) {
  const { name, gradeType, quality, itemLevel, tier, classRestriction, sections } = parsed
  const grade = extractGrade(gradeType)
  const isArmor = ARMOR_TYPES.has(itemType)

  return (
    <div className="w-[260px] overflow-hidden rounded-lg border border-white/10 bg-[#181b23] shadow-2xl">
      {/* 헤더: 아이콘 + 이름 */}
      <div className="flex items-start gap-2.5 p-3">
        {icon && (
          <div
            className="relative h-11 w-11 shrink-0 overflow-hidden rounded-sm"
            style={{ background: gradeBackground(grade) }}
          >
            {/* Layer 2: 아이템 PNG */}
            <Image src={icon} alt={name} fill className="object-contain" sizes="44px" unoptimized />
            {/* Layer 3: 방어구만 petBorder overlay */}
            {isArmor && (
              <Image
                src={`${CDN}/bg_equipment_petBorder.png`}
                alt=""
                fill
                className="pointer-events-none object-fill"
                sizes="44px"
                unoptimized
              />
            )}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className={`text-[13px] font-semibold leading-tight ${gradeNameColor(gradeType)}`}>
            {name}
          </p>
          <p className={`mt-0.5 text-[11px] ${gradeNameColor(gradeType)} opacity-70`}>
            {gradeType}
          </p>
          {(itemLevel > 0 || tier > 0) && (
            <p className="mt-0.5 text-[10px] text-white/40">
              {itemLevel > 0 && `아이템 레벨 ${itemLevel.toLocaleString()}`}
              {tier > 0 && ` (티어 ${tier})`}
            </p>
          )}
        </div>
      </div>

      {/* 품질 바 */}
      {quality >= 0 && (
        <div className="border-t border-white/[0.07] px-3 py-2">
          <QualityBar quality={quality} />
        </div>
      )}

      {/* 클래스 전용 */}
      {classRestriction && (
        <div className="border-t border-white/[0.07] px-3 py-1.5">
          <span className="text-[11px] text-white/40">{classRestriction}</span>
        </div>
      )}

      {/* 효과 섹션들 */}
      {sections.map((sec, i) => (
        <div key={i} className="border-t border-white/[0.07] px-3 py-2">
          <p className="mb-1 text-[11px] font-medium text-[#A9D0F5]">{sec.header}</p>
          <div className="space-y-0.5">
            {sec.lines.map((line, j) => (
              <p key={j}>
                <LineText line={line} />
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ===================================================================
// 호버 래퍼
// ===================================================================

interface EquipmentTooltipProps {
  tooltipRaw: string
  icon: string
  itemType?: string
  children: React.ReactNode
  side?: 'right' | 'left'
}

export function EquipmentTooltip({ tooltipRaw, icon, itemType = '', children, side = 'right' }: EquipmentTooltipProps) {
  const parsed = parseTooltipJson(tooltipRaw)
  if (!parsed) return <>{children}</>

  return (
    <div className="group/tip relative">
      {children}

      {/* 툴팁 */}
      <div
        className={[
          'pointer-events-none absolute top-0 z-50 opacity-0 transition-opacity duration-150 group-hover/tip:opacity-100',
          side === 'right' ? 'left-full ml-2' : 'right-full mr-2',
        ].join(' ')}
      >
        <TooltipContent parsed={parsed} icon={icon} itemType={itemType} />
      </div>
    </div>
  )
}
