"use client";

/**
 * @file 장비 마우스 호버 툴팁
 *
 * 로스트아크 공식 전투정보실과 동일한 구조로
 * 장비 아이콘 호버 시 상세 정보를 표시합니다.
 */

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { parseTooltipJson } from "@/lib/parser/tooltip-parser";
import type { ParsedTooltip, TooltipLine, TooltipSegment } from "@/lib/parser/tooltip-parser";

// ===================================================================
// 아이콘 헬퍼 (character-equipment와 동일한 3레이어 구조)
// ===================================================================

const CDN =
  "https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/game";
const ARMOR_TYPES = new Set(["투구", "어깨", "상의", "하의", "장갑", "무기"]);

function gradeBackground(grade: string): string {
  switch (grade) {
    case "고대":
      return "linear-gradient(135deg, rgb(61,51,37), rgb(220,201,153))";
    case "유물":
      return "linear-gradient(135deg, rgb(52,26,9), rgb(162,64,6))";
    case "전설":
      return "linear-gradient(135deg, rgb(40,32,0), rgb(168,138,0))";
    case "영웅":
      return "linear-gradient(135deg, rgb(26,8,36), rgb(118,44,188))";
    case "희귀":
      return "linear-gradient(135deg, rgb(8,18,40), rgb(28,82,178))";
    default:
      return "linear-gradient(135deg, rgb(18,20,26), rgb(45,48,58))";
  }
}

/** gradeType 문자열("고대 우산" 등)에서 등급 추출 */
function extractGrade(gradeType: string): string {
  for (const g of ["고대", "유물", "전설", "영웅", "희귀"]) {
    if (gradeType.includes(g)) return g;
  }
  return "";
}

// ===================================================================
// 헬퍼
// ===================================================================

const LINE_COLOR: Record<string, string> = {
  orange: "text-[#C47200] dark:text-[#FE9600]",
  purple: "text-[#9B2FD4] dark:text-[#CE43FC]",
  blue: "text-[#007AB8] dark:text-[#00B5FF]",
  lightblue: "text-[#3A6E9E] dark:text-[#A9D0F5]",
  ancient: "text-[#7A5C1E] dark:text-[#E3C7A1]",
  relic: "text-[#C44A00] dark:text-[#FA5D00]",
  legendary: "text-[#9A7A00] dark:text-[#FFD200]",
  red: "text-[#C24B46]",
  teal: "text-[#2BA8BF] dark:text-[#5FD3F1]",
  green: "text-[#4CAF50] dark:text-[#73DC04]",
  buff: "text-[#B8960A] dark:text-[#FFFFAC]",
  yellow: "text-[#B8A800] dark:text-[#FFFF99]",
  lightgreen: "text-[#2E8B57] dark:text-[#99FF99]",
  white: "text-black/80 dark:text-white/80",
  gray: "text-black/45 dark:text-white/40",
};

const GRADE_NAME_COLOR: Record<string, string> = {
  고대: "text-[#7A5C1E] dark:text-[#E3C7A1]",
  유물: "text-[#C44A00] dark:text-[#FA5D00]",
  전설: "text-[#9A7A00] dark:text-[#FFD200]",
  영웅: "text-purple-700 dark:text-purple-400",
  희귀: "text-blue-700 dark:text-blue-400",
};

function gradeNameColor(gradeType: string): string {
  for (const [grade, cls] of Object.entries(GRADE_NAME_COLOR)) {
    if (gradeType.includes(grade)) return cls;
  }
  return "text-black/80 dark:text-white/80";
}

function qualityBarColor(q: number): string {
  if (q >= 100) return "bg-amber-400";
  if (q >= 75) return "bg-blue-500";
  if (q >= 25) return "bg-yellow-500";
  return "bg-red-600";
}

// ===================================================================
// 서브 컴포넌트
// ===================================================================

function QualityBar({ quality }: { quality: number }) {
  if (quality < 0) return null;
  const pct = Math.max(0, Math.min(100, quality));
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="text-black/50 dark:text-white/50">품질</span>
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-black/10 dark:bg-white/15">
        <div
          className={`h-full rounded-full ${qualityBarColor(quality)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className={`tabular-nums font-bold ${qualityBarColor(quality).replace("bg-", "text-")}`}
      >
        {quality}
      </span>
    </div>
  );
}

function SegmentText({ segment }: { segment: TooltipSegment }) {
  const cls = LINE_COLOR[segment.color] ?? "text-black/80 dark:text-white/80";
  return <span className={cls}>{segment.text}</span>;
}

function LineText({ line }: { line: TooltipLine }) {
  const colorClass = LINE_COLOR[line.color] ?? "text-tx-body";
  const isColored = line.color !== "white" && line.color !== "gray";

  // 멀티 색상 세그먼트가 있으면 인라인 렌더링
  if (line.segments && line.segments.length > 0) {
    return (
      <span className="text-[11px] leading-none">
        {line.segments.map((seg, i) => (
          <SegmentText key={i} segment={seg} />
        ))}
      </span>
    );
  }

  // 각인 라인 ("[돌격대장] Lv.2"): 각인명만 색상, 대괄호·Lv는 기본색
  if ((line.color === "buff" || line.color === "red") && line.text.match(/^\[.+\]\s*Lv\.\d+$/)) {
    const match = line.text.match(/^\[(.+)\]\s*(Lv\.\d+)$/);
    if (match) {
      const defaultColor = "text-black/80 dark:text-white/80";
      return (
        <span className="text-[11px] leading-none">
          <span className={defaultColor}>[</span>
          <span className={colorClass}>{match[1]}</span>
          <span className={defaultColor}>] {match[2]}</span>
        </span>
      );
    }
  }

  // 색상이 적용된 라인: 텍스트는 기본색, 수치만 색상 적용
  // "+83", "+117" (정수), "+3.5%", "3.5%" (퍼센트) 모두 매칭
  if (isColored) {
    const parts = line.text.split(/([+-]\d[\d,.]*%?|\d[\d,.]*%)/);
    return (
      <span className="text-[11px] leading-none">
        {parts.map((part, i) =>
          /^[+-]\d[\d,.]*%?$|^\d[\d,.]*%$/.test(part) ? (
            <span key={i} className={colorClass}>{part}</span>
          ) : (
            <span key={i} className="text-black/80 dark:text-white/80">{part}</span>
          )
        )}
      </span>
    );
  }

  return (
    <span className={`text-[11px] leading-none ${colorClass}`}>
      {line.text}
    </span>
  );
}

// ===================================================================
// 메인 툴팁 컨텐츠
// ===================================================================

interface TooltipContentProps {
  parsed: ParsedTooltip;
  icon: string;
  itemType?: string;
}

function TooltipContent({ parsed, icon, itemType = "" }: TooltipContentProps) {
  const {
    name,
    gradeType,
    quality,
    itemLevel,
    tier,
    classRestriction,
    sections,
  } = parsed;
  const grade = extractGrade(gradeType);
  const isArmor = ARMOR_TYPES.has(itemType);

  return (
    <div className="w-[260px] overflow-hidden rounded-lg border border-black/[0.08] bg-white shadow-2xl dark:border-white/10 dark:bg-[#181b23]">
      {/* 헤더: 아이콘 + 이름 */}
      <div className="flex items-start gap-2.5 px-3 py-2.5">
        {icon && (
          <div
            className="relative h-11 w-11 shrink-0 overflow-hidden rounded-sm"
            style={{ background: gradeBackground(grade) }}
          >
            {/* Layer 2: 아이템 PNG */}
            <Image
              src={icon}
              alt={name}
              fill
              className="object-contain"
              sizes="44px"
              unoptimized
            />
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
          <p
            className={`text-[13px] font-semibold leading-tight ${gradeNameColor(gradeType)}`}
          >
            {name}
          </p>
          <p
            className={`text-[11px] leading-tight ${gradeNameColor(gradeType)} opacity-70`}
          >
            {gradeType}
          </p>
          {(itemLevel > 0 || tier > 0) && (
            <p className="text-[10px] leading-tight text-black/50 dark:text-white/50">
              {itemLevel > 0 && `아이템 레벨 ${itemLevel.toLocaleString()}`}
              {tier > 0 && ` (티어 ${tier})`}
            </p>
          )}
        </div>
      </div>

      {/* 품질 바 */}
      {quality >= 0 && (
        <div className="border-t border-black/[0.08] px-3 py-1 dark:border-white/[0.12]">
          <QualityBar quality={quality} />
        </div>
      )}

      {/* 클래스 전용 */}
      {classRestriction && (
        <div className="border-t border-black/[0.08] px-3 py-1 dark:border-white/[0.12]">
          <span className="text-[11px] text-black/50 dark:text-white/50">
            {classRestriction}
          </span>
        </div>
      )}

      {/* 효과 섹션들 */}
      {sections.map((sec, i) => (
        <div
          key={i}
          className="border-t border-black/[0.08] px-3 py-1 dark:border-white/[0.12]"
        >
          <p className="mb-1 text-[11px] font-medium text-[#4A90D9] dark:text-[#A9D0F5]">
            {sec.header}
          </p>
          <div className="flex flex-col">
            {sec.lines.map((line, j) => (
              <span key={j} className="block text-[11px] leading-relaxed">
                <LineText line={line} />
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ===================================================================
// 호버 래퍼
// ===================================================================

interface EquipmentTooltipProps {
  tooltipRaw: string;
  icon: string;
  itemType?: string;
  children: React.ReactNode;
  side?: "right" | "left";
}

export function EquipmentTooltip({
  tooltipRaw,
  icon,
  itemType = "",
  children,
}: EquipmentTooltipProps) {
  const parsed = parseTooltipJson(tooltipRaw);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const handleEnter = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    // children 내부의 아이템 이름(p.truncate) 좌표를 기준으로 툴팁 위치 결정
    const nameEl = wrapper.querySelector("p.truncate") as HTMLElement | null;
    const anchor = nameEl ?? wrapper;
    const rect = anchor.getBoundingClientRect();
    // zoom이 적용된 환경에서 getBoundingClientRect()는 확대된 좌표를 반환하지만
    // fixed 포지셔닝에도 zoom이 적용되므로 zoom factor로 나눠 보정
    const zoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
    setPos({ x: rect.left / zoom, y: rect.top / zoom });
  }, []);

  const handleLeave = useCallback(() => setPos(null), []);

  if (!parsed) return <>{children}</>;

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}

      {/* 툴팁 — fixed 포지셔닝으로 아이템 이름 좌표에서 시작 */}
      {pos && (
        <div
          className="pointer-events-none fixed z-50 animate-in fade-in duration-150"
          style={{ top: pos.y, left: pos.x }}
        >
          <TooltipContent parsed={parsed} icon={icon} itemType={itemType} />
        </div>
      )}
    </div>
  );
}
