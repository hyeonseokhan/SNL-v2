'use client'

/**
 * @file 카드 섹션 컴포넌트
 *
 * 카드 6장 가로 배치 + 세트 효과 토글 표시.
 * 각 카드: 이미지 + 등급 테두리 색상 + 각성 도트 + 이름
 * 세트 효과: 토글로 펼침/접힘, 조건 배지 + 효과 설명
 */

import { useState } from 'react'
import Image from 'next/image'
import type { CardData, CardInfo, CardSetEffect } from '@/types/character'

// ===================================================================
// 상수
// ===================================================================

/**
 * 카드 등급 → 프레임 스프라이트 X 오프셋 (%)
 *
 * card-grade.png: 869x200, 6등급 프레임이 가로로 연결
 * API 등급 문자열 → data-grade 숫자 매핑
 */
const CARD_GRADE_OFFSET: Record<string, string> = {
  '일반': '0%',
  '고급': '20%',
  '희귀': '40%',
  '영웅': '60%',
  '전설': '80%',
}

// ===================================================================
// 헬퍼
// ===================================================================

/**
 * 섹션 라벨 — pill 배지 + 가로선 + 우측 콘텐츠
 *
 * @param children - 라벨 텍스트
 * @param right - 우측 콘텐츠
 */
function SectionLabel({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="shrink-0 rounded-full bg-primary/15 px-3 py-1 text-[12px] font-bold text-primary">
        {children}
      </span>
      <div className="h-px flex-1 bg-black/10 dark:bg-white/15" />
      {right}
    </div>
  )
}

// ===================================================================
// 서브 컴포넌트
// ===================================================================

/**
 * 카드 레이아웃 상수 (단위: px)
 *
 * 기준: 프레임 실제 폭 134px (스프라이트 147px 중 우측 13px 빈 공간 제외)
 * scale = CARD_W / 134 로 모든 수치를 비례 축소합니다.
 *
 * 원본 카드 이미지: 248×362 (비율 1:1.46)
 * 프레임 원본: 134×200
 * 프레임 테두리 두께: 좌=6, 우=6, 상=4, 하=9 (원본 기준)
 * 각성 도트 스프라이트: 120×72 (상단 36px=회색, 하단 36px=금색, 1도트=24px)
 * 공식 CSS 각성 위치: bottom=14px (원본 기준)
 */
const CARD_W = 88
const SCALE = CARD_W / 134               // 0.6567
const CARD_H = Math.round(200 * SCALE)   // 131

// 이미지 inset — 프레임 테두리 안쪽에 배치
const IMG_TOP = Math.round(4 * SCALE)    // 3
const IMG_LEFT = Math.round(6 * SCALE)   // 4
const IMG_RIGHT = Math.round(6 * SCALE)  // 4
const IMG_BOTTOM = Math.round(9 * SCALE) // 6

// 프레임 스프라이트 backgroundSize (전체 스프라이트 scaled)
const FRAME_BG_W = Math.round(869 * SCALE) // 571
const FRAME_BG_H = CARD_H                  // 131

// 프레임 등급별 backgroundPositionX (스프라이트 간격 147px × scale)
const GRADE_POS: Record<string, number> = {
  '일반': 0,
  '고급': Math.round(147 * SCALE),        // 97
  '희귀': Math.round(294 * SCALE),        // 193
  '영웅': Math.round(441 * SCALE),        // 290
  '전설': Math.round(588 * SCALE),        // 386
}

// 각성 도트 (5도트 기준)
const AWAKE_DOT_W = Math.round(24 * SCALE)  // 16 (1도트)
const AWAKE_H = Math.round(36 * SCALE)      // 24
const AWAKE_BOTTOM = Math.round(14 * SCALE) // 9
// 3번째 도트 중앙 = 2도트 + 0.5도트 = 2.5도트
// 도트 영역 left = 카드 중앙(44px) - 2.5도트 중앙(40px) = 4px
const AWAKE_LEFT = CARD_W / 2 - AWAKE_DOT_W * 2.5 // 4

/**
 * 개별 카드 렌더링
 *
 * 레이어 순서: 카드 이미지 → 등급 프레임 오버레이 → 각성 도트 오버레이
 *
 * @param card - 카드 데이터
 */
function CardItem({ card }: { card: CardInfo }) {
  const frameX = GRADE_POS[card.grade] ?? 0
  const awakeMaxPx = card.awakeTotal * AWAKE_DOT_W
  const awakePx = card.awakeCount * AWAKE_DOT_W
  const awakeBgW = awakeMaxPx
  const awakeBgH = AWAKE_H * 2

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: CARD_W, height: CARD_H }}>
        {/* 1) 카드 이미지 — 프레임 투명 영역에 정확히 맞춤 */}
        <div
          className="absolute overflow-hidden"
          style={{ top: IMG_TOP, left: IMG_LEFT, right: IMG_RIGHT, bottom: IMG_BOTTOM }}
        >
          <Image
            src={card.icon}
            alt={card.name}
            fill
            className="object-cover"
            sizes={`${CARD_W}px`}
            unoptimized
          />
        </div>

        {/* 2) 등급 프레임 오버레이 */}
        <div
          className="pointer-events-none absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: 'url(/icons/card/card-grade.png)',
            backgroundSize: `${FRAME_BG_W}px ${FRAME_BG_H}px`,
            backgroundPositionX: -frameX,
          }}
        />

        {/* 3) 각성 도트 — 하단 중앙 */}
        {card.awakeTotal > 0 && (
          <div
            className="pointer-events-none absolute overflow-hidden"
            style={{
              bottom: AWAKE_BOTTOM,
              left: AWAKE_LEFT,
              width: awakeMaxPx,
              height: AWAKE_H,
              backgroundImage: 'url(/icons/card/card-awake.png)',
              backgroundSize: `${awakeBgW}px ${awakeBgH}px`,
              backgroundPosition: '0 0',
            }}
          >
            {/* 활성 도트 (금색) — 너비 클리핑 */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'url(/icons/card/card-awake.png)',
                backgroundSize: `${awakeBgW}px ${awakeBgH}px`,
                backgroundPosition: `0 -${AWAKE_H}px`,
                width: awakePx,
              }}
            />
          </div>
        )}
      </div>
      {/* 카드 이름 */}
      <span className="text-[10px] text-tx-caption">{card.name}</span>
    </div>
  )
}

/**
 * 세트 효과 목록
 *
 * @param effects - 세트 효과 배열
 */
function SetEffectList({ effects }: { effects: CardSetEffect[] }) {
  return (
    <div className="mt-3 rounded-lg bg-black/[0.03] px-4 py-3 dark:bg-white/[0.04]">
      <p className="mb-2 text-[13px] font-bold text-tx-body">세트 효과</p>
      <div className="space-y-1.5">
        {effects.map((eff, i) => (
          <div key={i} className="flex items-baseline gap-2">
            <span className="shrink-0 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-primary">
              {eff.name}
            </span>
            <span className="text-[11px] text-tx-body">{eff.description}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ===================================================================
// 메인 컴포넌트
// ===================================================================

/**
 * 카드 섹션
 *
 * 상단: 카드 6장 가로 배치 (이미지 + 등급 테두리 + 각성 도트)
 * 하단: 세트 효과 토글 (접힘/펼침)
 *
 * @param card - 카드 전체 데이터
 *
 * @example
 * <CardSection card={data.card} />
 */
export function CardSection({ card }: { card: CardData }) {
  const [expanded, setExpanded] = useState(false)

  if (card.cards.length === 0) return null

  return (
    <div className="rounded-lg bg-card px-5 py-4 shadow-[1px_1px_10px_0_rgba(72,75,108,0.08)]">
      <SectionLabel
        right={
          card.setSummary ? (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-[12px] font-medium text-tx-body hover:text-primary transition-colors"
            >
              {card.setSummary}
              <svg
                width="12" height="12" viewBox="0 0 12 12"
                className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
              >
                <path d="M3 5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : undefined
        }
      >
        카드
      </SectionLabel>

      {/* 카드 6장 가로 배치 */}
      <div className="flex justify-center gap-3">
        {card.cards.map((c) => (
          <CardItem key={c.slot} card={c} />
        ))}
      </div>

      {/* 세트 효과 (토글) */}
      {expanded && card.setEffects.length > 0 && (
        <SetEffectList effects={card.setEffects} />
      )}
    </div>
  )
}
