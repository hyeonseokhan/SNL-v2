/**
 * @file 캐릭터 프로필 카드
 *
 * 신용카드 세로 비율 (54:86)
 * KLOA 구조 기반:
 * - 배경: #15181d
 * - 이미지: 카드보다 크게, 우측 오프셋 (보라 글로우는 이미지 자체에서)
 * - 좌·우 엣지: 얇은 페이드 그라디언트
 * - 정보: 좌측 절반 오버레이 (마스크로 자연스럽게)
 */

import Image from "next/image";
import type { CharData } from "@/types/character";
import type { CharPalette } from "@/lib/extract-palette";

// ===================================================================
// 아이콘 SVG
// ===================================================================

// 투구 아이콘 (아이템 레벨) — 강철/금속 질감
function HelmetIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="helmSteel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#f4f8ff" />
          <stop offset="35%"  stopColor="#c8d8e8" />
          <stop offset="100%" stopColor="#7a9ab8" />
        </linearGradient>
        <linearGradient id="helmShine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      {/* 본체 */}
      <path
        d="M10 1C5.5 1 2 4.8 2 9.5L2 15L5.5 15L5.5 10.5L7.5 10.5L7.5 16L12.5 16L12.5 10.5L14.5 10.5L14.5 15L18 15L18 9.5C18 4.8 14.5 1 10 1Z"
        fill="url(#helmSteel)"
      />
      {/* 하이라이트 */}
      <path
        d="M10 1C5.5 1 2 4.8 2 9.5L2 15L5.5 15L5.5 10.5L7.5 10.5L7.5 16L12.5 16L12.5 10.5L14.5 10.5L14.5 15L18 15L18 9.5C18 4.8 14.5 1 10 1Z"
        fill="url(#helmShine)"
      />
      {/* 코 가드 */}
      <rect x="9" y="9.5" width="2" height="6.5" rx="1" fill="#7a9ab8" opacity="0.5" />
    </svg>
  )
}

// 전투력 아이콘 — 4방향 마름모 별 (마그마 질감)
function CombatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="magmaMain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ffe066" />
          <stop offset="40%"  stopColor="#ff6a00" />
          <stop offset="100%" stopColor="#c0140a" />
        </linearGradient>
        <linearGradient id="magmaDiag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ffaa33" />
          <stop offset="100%" stopColor="#aa1008" />
        </linearGradient>
      </defs>
      {/* 세로 축 */}
      <path d="M10 1L12 8H8L10 1Z"   fill="url(#magmaMain)" />
      <path d="M10 19L8 12H12L10 19Z" fill="url(#magmaMain)" />
      {/* 가로 축 */}
      <path d="M1 10L8 8V12L1 10Z"    fill="url(#magmaMain)" />
      <path d="M19 10L12 12V8L19 10Z" fill="url(#magmaMain)" />
      {/* 대각선 축 */}
      <path d="M3.5 3.5L8.5 8.5L7.2 9.8L2.2 4.8L3.5 3.5Z"     fill="url(#magmaDiag)" opacity="0.75" />
      <path d="M16.5 3.5L11.5 8.5L12.8 9.8L17.8 4.8L16.5 3.5Z" fill="url(#magmaDiag)" opacity="0.75" />
      <path d="M3.5 16.5L8.5 11.5L7.2 10.2L2.2 15.2L3.5 16.5Z"   fill="url(#magmaDiag)" opacity="0.75" />
      <path d="M16.5 16.5L11.5 11.5L12.8 10.2L17.8 15.2L16.5 16.5Z" fill="url(#magmaDiag)" opacity="0.75" />
    </svg>
  )
}

interface CharacterProfileProps {
  data: CharData;
  palette?: CharPalette;
}

interface TagItem {
  label: string;
  value: string;
  icon?: string;
}

function TagList({ items }: { items: TagItem[] }) {
  const filled = items.filter((x) => x.value);
  if (!filled.length) return null;

  return (
    <ul className="space-y-[3px]">
      {filled.map(({ label, value, icon }) => (
        <li
          key={label}
          className="flex items-center gap-1.5 text-[12px] leading-tight"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.95)' }}
        >
          <span className="w-[38px] shrink-0 text-white/55">{label}</span>
          <span className="flex items-center gap-[2px]">
            {icon && (
              <Image src={icon} alt="" width={16} height={16} className="shrink-0 object-contain" style={{ width: 16, height: 'auto' }} />
            )}
            <span className="text-white/85">{value}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function CharacterProfile({ data, palette }: CharacterProfileProps) {
  const { profile, stats, arkPassive } = data;

  // 깨달음 1티어 첫 번째 노드 이름 → #태그로 표시
  const enlightenmentTag =
    arkPassive.enlightenment.nodes.find((n) => n.tier === 1)?.name ?? '';

  const iLvFormatted = profile.itemLevel.toLocaleString("ko-KR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const tags: TagItem[] = [
    { label: "서버", value: profile.serverName },
    { label: "원정대", value: profile.expeditionLevel ? `Lv.${profile.expeditionLevel}` : "" },
    { label: "칭호", value: profile.title, icon: profile.titleIcon },
    { label: "길드", value: profile.guildName },
    { label: "PVP", value: profile.pvpGrade || "-" },
    { label: "영지", value: profile.townLevel ? `Lv.${profile.townLevel} ${profile.townName}`.trim() : "" },
  ];

  return (
    /* 신용카드 세로 비율 54:86 */
    <div
      className="relative w-full overflow-hidden rounded-xl bg-[#15181d]"
      style={{ aspectRatio: "54 / 86" }}
    >
      {/* ── 캐릭터 이미지: 카드보다 크게, 우측으로 오프셋 (KLOA 방식) ── */}
      {profile.characterImage && (
        <div
          className="absolute"
          style={{
            width: "153%",
            right: "-45%",
            top: "-18%",
            bottom: "-5%",
          }}
        >
          <Image
            src={profile.characterImage}
            alt=""
            fill
            className="object-cover object-top"
            sizes="600px"
            priority
          />
        </div>
      )}

      {/* ── 팔레트 컬러 오버레이 (이미지 위에 은은한 색감) ── */}
      {palette && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 65% 35%, ${palette.vibrant}14 0%, ${palette.darkVibrant}10 50%, transparent 75%)`,
            mixBlendMode: 'soft-light',
          }}
        />
      )}

      {/* ── 좌측 엣지 페이드 ── */}
      <div
        className="absolute inset-y-0 left-0 w-[62%]"
        style={{
          background: palette
            ? `linear-gradient(to right, ${palette.darkVibrant}3c 0%, ${palette.darkVibrant}26 50%, transparent 100%)`
            : 'linear-gradient(to right, #15181d 0%, #15181dee 50%, transparent 100%)',
        }}
      />

      {/* ── 하단 페이드 ── */}
      <div
        className="absolute inset-x-0 bottom-0 h-[20%]"
        style={{
          background: palette
            ? `linear-gradient(to top, ${palette.darkVibrant}38, transparent)`
            : 'linear-gradient(to top, #15181d, transparent)',
        }}
      />

      {/* ── 정보 레이어 (좌측) ── */}
      <div className="absolute inset-y-0 left-0 flex w-[62%] flex-col px-4 py-5">
        {/* 레벨 · 직업 · 깨달음 태그 (한 줄) */}
        <p
          className="text-[11px] font-medium text-white/90"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.95)' }}
        >
          Lv.{profile.characterLevel}&nbsp;&nbsp;{profile.class}
          {enlightenmentTag && (
            <span className="text-white/65">&nbsp;&nbsp;#{enlightenmentTag}</span>
          )}
        </p>

        {/* 캐릭터명 */}
        <h2
          className="mt-2 break-keep text-[19px] font-bold leading-snug tracking-tight text-white"
          style={{ textShadow: '0 1px 6px rgba(0,0,0,0.95), 0 0 12px rgba(0,0,0,0.6)' }}
        >
          {profile.characterName}
        </h2>

        {/* 구분선 */}
        <div className="my-3 h-px w-8 bg-white/25" />

        {/* 아이템 레벨 */}
        <div
          className="flex items-center gap-2"
          style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.95))' }}
        >
          <HelmetIcon className="size-[16px] shrink-0" />
          <span className="text-[17px] font-bold tabular-nums tracking-tight bg-gradient-to-b from-white to-slate-200 bg-clip-text text-transparent">
            {iLvFormatted}
          </span>
        </div>

        {/* 전투력 */}
        <div
          className="mt-1 flex items-center gap-2"
          style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.95))' }}
        >
          <CombatIcon className="size-[16px] shrink-0" />
          <span className="text-[17px] font-bold tabular-nums tracking-tight bg-gradient-to-b from-white to-slate-200 bg-clip-text text-transparent">
            {stats.combatPower.toLocaleString()}
          </span>
        </div>

      </div>

      {/* ── 태그 목록: 카드 전체 너비 사용, 하단 고정 ── */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
        <TagList items={tags} />
      </div>
    </div>
  );
}
