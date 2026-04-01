# 팔찌 효율 분석 (LOPEC 기반)

## 개요

LOPEC (lopec.kr)의 팔찌 효율 계산 로직을 기존 PoC 프로젝트에서 분석한 결과입니다.
리얼본좌강림 기준 **종합 팔찌 효율: 14.05%**

## 1. 팔찌 옵션 구조

팔찌는 크게 **2종류의 옵션**으로 구성됩니다:

### 1-1. 스탯/퍼센트 옵션 (stattype)
API 응답에서 파싱된 `bangle.option` 배열의 개별 문자열:
- `"신속 +83"` → 전투 특성 고정 수치
- `"치명 +117"` → 전투 특성 고정 수치
- `"추가 피해 +3.5%"` → 퍼센트 옵션
- `"치명타 적중률이 4.2% 증가한다. 공격이 치명타로 적중 시 적에게 주는 피해가 1.5% 증가한다."` → 복합 옵션

### 1-2. 특수 효과 (addontype)
쐐기, 망치, 순환, 약점노출 등 전투 시 발동되는 특수 효과.
텍스트 전체를 키로 사용하여 상수 테이블에서 매칭합니다.

## 2. 효율 계산 공식

### 핵심 원리
LOPEC은 모든 장비 요소를 **전투력 승수(multiplier)** 로 변환합니다.
팔찌 효율(%) = `(팔찌_전투력_승수 - 1) × 100`

### 2-1. 스탯 옵션 (신속 +83, 치명 +117)
전투 특성은 `calc-efficiency.ts`의 공식을 사용:
- **치명**: `치명_스탯 / 27.94` = 치명타 적중률(%)
- **신속**: `신속_스탯 / 58.23` = 공격/이동 속도(%)

리얼본좌강림 기준:
- 신속 +83 → `83 / 58.23 ≈ 1.426%` 속도 → **효율 2.83%** (LOPEC 표기)
- 치명 +117 → `117 / 27.94 ≈ 4.19%` 적중률 → **효율 3.25%** (LOPEC 표기)

> 참고: LOPEC의 효율%는 단순 스탯 환산이 아니라 전투력 승수 기반이므로
> 캐릭터의 전체 스펙(클래스, 각인, 아크패시브 등)에 따라 달라집니다.

### 2-2. 퍼센트 옵션 (추가 피해, 치명타 적중률 등)
`constants.json`의 `bracelet_stattype` 테이블 사용:

```json
{
  "bracelet_stattype": {
    "추가 피해 +\\+([0-9.]+)%$": 7692,   // 추가 피해 1% = 0.7692% 효율
    "치명타 적중률 +\\+([0-9.]+)%$": 7000, // 치적 1% = 0.7% 효율  
    "치명타 피해 +\\+([0-9.]+)%$": 3333    // 치피 1% = 0.3333% 효율
  }
}
```

### 2-3. 특수 효과 (addontype)
`constants.json`의 `bracelet_addontype_attack` 테이블에서 텍스트 매칭:
- 각 특수 효과 텍스트(공백 제거) → 고정 포인트 값
- 포인트 / 10000 + 1 = 승수

### 2-4. 복합 옵션 (치적 + 치명타 주는 피해)
`bracelet_addontype_attack`에서 전체 텍스트로 매칭:

```json
{
  "치명타적중률이4.2%증가한다.공격이치명타로적중시적에게주는피해가1.5%증가한다.": 400
}
```

→ `400 / 10000 + 1 = 1.04` → **효율 4.00%**
(LOPEC 표기 4.78%는 스킬 딜 비중 가중 반영)

## 3. 종합 효율 계산

LOPEC의 `j()` 함수 (팔찌 전투력):

```javascript
function j() {
  let bangle = e.armory.accessory.bangle;
  let table = constants.attack.bracelet_addontype_attack;
  return bangle.option.reduce((acc, opt) => {
    if (table[opt]) {
      acc *= table[opt] / 10000 + 1;
    }
    return acc;
  }, 1);
}
```

**계산 흐름:**
1. 각 팔찌 옵션을 상수 테이블에서 조회
2. 포인트 / 10000 + 1 = 개별 승수
3. 모든 승수를 곱셈 → 종합 승수
4. `(종합_승수 - 1) × 100` = 종합 효율(%)

## 4. 리얼본좌강림 검증

| 옵션 | LOPEC 효율 | 비고 |
|------|-----------|------|
| 신속 +83 | 2.83% | 전투 특성 → 속도 환산 |
| 치명 +117 | 3.25% | 전투 특성 → 치적률 환산 |
| 추피 +3.5% \| 악마&대악마 피해량 +2.5% | 2.60% | 복합 옵션 포인트 |
| 치적 +4.2% \| 치명타 주는 피해 +1.5% | 4.78% | 복합 옵션 포인트 |
| **종합** | **14.05%** | 각 승수의 곱 |

## 5. 구현 시 고려사항

### 데이터 소스
- 팔찌 옵션: `armory.accessory.bangle.option` (문자열 배열)
- 효율 상수: `constants.json`의 `bracelet_stattype` + `bracelet_addontype_attack`

### 주의사항
1. **역할별 상수 테이블**: 클래스별이 아닌 **딜러(attack) vs 서포터(defense)** 2가지로 구분
   - 딜러: 추가 피해, 치명타 적중률, 치명타 피해 + 쐐기/망치/순환/습격/정밀 등
   - 서포터: 아군 공격력 강화, 아군 피해량 강화 + 비수/약점노출 등
2. **복합 옵션 매칭**: 텍스트에서 공백을 제거한 후 매칭해야 함
3. **스탯 옵션 효율**: 단순 환산이 아닌 전체 스펙 대비 승수로 계산
4. **표준 딜지분은 입력값이 아닌 출력값**: LOPEC은 별도의 딜지분 테이블을 사용하지 않음. 전체 딜 시뮬레이션을 2번 수행(팔찌 포함 vs 제외)하여 차이를 효율로 계산하며, "표준 딜지분"은 시뮬레이션 결과로 산출된 각 스킬의 딜 기여도임

### 구현 전략

딜 시뮬레이션 엔진 전체를 구현하는 것은 대규모 작업이므로, 단계적으로 접근합니다.

#### Phase 1: 팔찌 UI 개선 (효율 계산 없이)
- 팔찌 옵션을 파싱하여 옵션별로 깔끔하게 표시
- 툴팁에 상세 옵션 정보 렌더링
- 기존 장비 컴포넌트와 디자인 통일

#### Phase 2: 간이 효율 표시 (상수 테이블 기반)
- `constants.json`의 `bracelet_stattype` + `bracelet_addontype_attack` 포인트 활용
- 스탯 옵션: `치명/27.94`, `신속/58.23` 으로 간단 환산
- 퍼센트/특수 옵션: 포인트 / 10000 으로 환산
- LOPEC과 정확히 같지 않지만 근사치 제공 가능

#### Phase 3: 풀 시뮬레이션 (장기 목표)
- LOPEC 방식의 딜 시뮬레이션 엔진 구현
- 클래스별 각인 보너스 테이블 적용
- 팔찌 포함/제외 2회 시뮬레이션으로 정확한 효율 계산
- 기존 PoC의 `calc-efficiency.ts`를 확장

## 6. LOPEC 프론트엔드 리버스 엔지니어링 결과 (2026-04-01)

Chrome DevTools로 LOPEC 번들 JS(`7119-*.js`, `7917-*.js`)를 분석한 결과:

### 6-1. 팔찌 효율 핵심 계산 함수

```javascript
// 7119-e52ea2ee16f92d50.js (deminified)
function calcBraceletEfficiency(charData) {
  // 팔찌 포함 전체 딜 시뮬레이션
  let withBangle = simulateDamage(deepCopy(charData));
  // 팔찌 제거 후 딜 시뮬레이션  
  let withoutBangle = simulateDamage(deepCopy({
    ...charData,
    armory: { ...charData.armory, accessory: { ...charData.armory.accessory, bangle: null } }
  }));
  return {
    withBangle,
    withoutBangle,
    efficiency: withoutBangle > 0
      ? Math.floor((withBangle / withoutBangle - 1) * 10000) / 100 / 1.4
      : null
  };
}
```

**핵심 포인트:**
- 딜지분 테이블은 **없음** — 전체 딜 시뮬레이션을 2회 수행하여 차이를 계산
- `/1.4`는 정규화 상수 (다른 장비 효율과 스케일을 맞추기 위함)
- "표준 딜지분"은 시뮬레이션 **결과물**이지 입력값이 아님

### 6-2. 클래스별 각인 보너스 테이블

번들에서 추출된 클래스 각인 데이터 (일부):

```javascript
const CLASS_ENGRAVING = {
  "고독한 기사": { critRate: 15, critDamage: 45, moveSpeed: 0 },
  "전투 태세":   { critRate: 0,  critDamage: 0,  moveSpeed: 0 },
  "광기":        { critRate: 30, critDamage: 0,  moveSpeed: 15, atkSpeed: 15 },
  "분노의 망치": { critRate: 18, critDamage: 51, moveSpeed: 0 },
  "오의 강화":   { critRate: 30, critDamage: 0,  moveSpeed: 16, atkSpeed: 8 },
  "절제":        { critRate: 20, critDamage: 70, moveSpeed: 0 },
  // ... 전 클래스 각인 포함
};
```

### 6-3. 딜 시뮬레이션 공식 (요약)

```
딜 = (치명확률 × 자치확률 × 치명+자치_피증 
    + 치명확률 × (1-자치확률) × 치명_피증
    + (1-치명확률) × 자치확률 × 자치_피증  
    + (1-치명확률) × (1-자치확률) × 기본_피증) ^ 4.35 × 질서코어 × 125
```

## 7. 참고 파일 경로

| 파일 | 설명 |
|------|------|
| `snl/src/app/tools/character-analyzer/engine/calc-efficiency.ts` | 효율 계산 (치명타, 속도) |
| `snl/src/app/tools/character-analyzer/constants.json` | LOPEC 상수 테이블 |
| `snl/src/app/tools/character-analyzer/engine/api-parser.ts` | API 파싱 + bangOptions |
| `snl/src/app/tools/character-analyzer/_data-reference/리얼본좌강림/15_lopec-계산로직-함수.js` | LOPEC 원본 계산 로직 (minified) |
| `snl/src/app/tools/character-analyzer/_data-reference/리얼본좌강림/12_lopec-효율표-가공데이터.json` | LOPEC 효율표 결과 데이터 |
