# Typography Guide

이 문서는 SNL v2 프로젝트의 폰트 사용 규칙을 정의합니다.
컴포넌트를 작성하거나 수정할 때 반드시 이 지침을 따릅니다.

---

## 1. 폰트 패밀리

| 용도 | CSS 변수 | 폰트 |
|------|----------|------|
| 본문 | `--font-sans` | Pretendard Variable + 시스템 폴백 |
| 코드 | `--font-mono` | Geist Mono |

- `font-feature-settings: 'ss01'` 활성화 (Pretendard Stylistic Set)
- 전역 `zoom: 1.2` 적용 — `getBoundingClientRect()` 등 좌표 계산 시 보정 필요

---

## 2. 텍스트 색상 토큰

**반드시 `text-tx-*` 토큰을 사용합니다. `text-black/*`, `text-white/*` 직접 지정을 금지합니다.**

| 토큰 | Tailwind 클래스 | Light (oklch) | Dark (oklch) | 용도 |
|------|----------------|---------------|--------------|------|
| title | `text-tx-title` | 0.10 0 0 | 1 0 0 / 0.95 | 핵심 수치, 제목 |
| body | `text-tx-body` | 0.20 0 0 | 1 0 0 / 0.80 | 일반 텍스트, 라벨 |
| label | `text-tx-label` | 0.40 0 0 | 1 0 0 / 0.60 | 보조 라벨, 부가 설명 |
| caption | `text-tx-caption` | 0.55 0 0 | 1 0 0 / 0.45 | 캡션, 합계 등 부가 정보 |
| muted | `text-tx-muted` | 0.65 0 0 | 1 0 0 / 0.30 | 비활성, 비주요 수치 |

### 예외

- 등급 색상 (`유물`, `전설`, `영웅` 등) — 게임 고유 색상 사용
- 증감 표시 — 증가: `text-emerald-*`, 감소: `text-red-*`
- 브랜드/액센트 — `text-primary` 사용

---

## 3. 폰트 크기 스케일

**Tailwind 기본 클래스(`text-xs`, `text-sm` 등) 또는 아래 arbitrary 값만 사용합니다.**

| 크기 | 클래스 | 용도 | 예시 |
|------|--------|------|------|
| 9px | `text-[9px]` | 배지 숫자 (보석 레벨, 티어) | 보석 Lv 배지 |
| 10px | `text-[10px]` | 캡션, 부가 정보 | 추가 효과 라벨, 스톤 Lv |
| 11px | `text-[11px]` | 소형 라벨, 보조 텍스트 | 합계, 보석 그룹 라벨 |
| 12px | `text-[12px]` / `text-xs` | 기본 라벨, 각인명 | 전투 특성 라벨, 각인 |
| 13px | `text-[13px]` | 중형 라벨 | 기본 특성 항목명 |
| 14px | `text-sm` | 기본 본문 | 일반 텍스트 |
| 15px | `text-[15px]` | 강조 수치 | 전투 특성 값 |
| 16px | `text-base` / `text-[16px]` | 대형 수치 | 공격력, 생명력 값 |

### 원칙

- 한 컴포넌트 내에서 **3단계 이내**로 크기를 사용 (예: 10px + 12px + 15px)
- 라벨보다 수치가 항상 더 크거나 같아야 함
- `text-[8px]` 이하, `text-[17px]` 이상은 사용하지 않음 (배지/히어로 제외)

---

## 4. 폰트 굵기

| 클래스 | 용도 |
|--------|------|
| `font-bold` | 핵심 수치 (공격력, 전투 특성 값), 섹션 배지 |
| `font-semibold` | 중요 텍스트 (장비명, 추가 효과 수치) |
| `font-medium` | 일반 라벨 (항목명, 각인명) |
| (기본 400) | 보조 텍스트, 캡션 |

### 원칙

- 수치(숫자)는 `font-bold` + `tabular-nums` 조합
- 라벨(텍스트)은 `font-medium` 이하
- `font-extrabold`, `font-black`은 사용하지 않음

---

## 5. 수치 표시

- 숫자에는 반드시 `tabular-nums` 적용 (고정폭 숫자로 정렬)
- 1,000 이상은 `toLocaleString()`으로 천 단위 구분자 표시
- 퍼센트는 소수점 2자리 (`toFixed(2)`)

---

## 6. 조합 레시피

자주 사용하는 클래스 조합을 정리합니다.

```
핵심 수치:    text-[16px] font-bold  tabular-nums text-tx-title
강조 수치:    text-[15px] font-bold  tabular-nums text-tx-title
일반 라벨:    text-[13px] font-medium              text-tx-body
보조 라벨:    text-[12px] font-medium              text-tx-label
캡션:        text-[10px]                           text-tx-caption
비활성 수치:  text-[15px] font-bold  tabular-nums  text-tx-muted
배지 숫자:    text-[9px]  font-bold                text-white
```
