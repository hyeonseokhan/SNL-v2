# AI 밸런스 패치 적용 가이드

이 문서는 AI가 로스트아크 공식 패치 노트를 분석하여
게임 데이터 상수를 정확히 업데이트할 수 있도록 안내합니다.

---

## 데이터 위치 매핑

| 패치 노트 키워드 | 수정할 파일 | 검색 라벨 |
|-----------------|-----------|----------|
| 직업 각인 효과 (질풍노도, 빛의 기사 등) | `src/config/tables/class-passives.ts` | `@gameKey {각인명}` |
| 5티어 진화 노드 (음속 돌파 등) | `src/config/tables/main-nodes.ts` | `@gameKey {노드명}` |
| 일반 각인 효율 (돌격대장, 원한 등) | `src/config/tables/engravings.ts` | `@gameKey {각인명}` |
| 보석 효과 (멸화/겁화/홍염/작열) | `src/config/tables/gems.ts` | `@category gem` |
| 악세서리 연마 옵션 | `src/config/tables/polish-options.ts` | `@category polish` |
| 팔찌 효과 | `src/config/tables/bracelet-effects.ts` | `@category bracelet` |
| 무기 품질/재련 | `src/config/tables/equipment.ts` | `@category equipment` |
| 아크패시브 포인트 공식 | `src/config/tables/ark-passive.ts` | `@category ark-passive` |
| 도핑/전투축복 | `src/config/tables/buffs.ts` | `@category buff` |
| 스탯 변환 공식 (치명/신속 → %) | `src/config/constants/stat-conversion.ts` | `@category constant` |

---

## 표준 어노테이션

| 라벨 | 의미 | 예시 |
|------|------|------|
| `@category` | 데이터 분류 | `engraving`, `gem`, `main-node` |
| `@domain` | 도메인 영역 | `메인노드`, `직업각인`, `악세연마` |
| `@gameKey` | 게임 내 고유명 | `음속 돌파`, `질풍노도` |
| `@class` | 관련 클래스 | `기상술사`, `발키리` |
| `@tier` | 노드 티어 | `1`, `5` |
| `@source` | 데이터 출처 | `LOPEC JS 역추적`, `공식 API` |
| `@lastVerified` | LOPEC 비교 검증일 (YYYY-MM-DD) | `2026-04-07` |
| `@lastGameUpdate` | 마지막 공식 패치 반영일 (YYYY-MM-DD) | `2026-04-07` |
| `@ai-search-keywords` | AI 검색용 키워드 | `각인, 효율, 돌격대장` |
| `@ai-update-guide` | AI에게 수정 방법 안내 | (다단 설명) |
| `@formula` | 계산식 | `min(speed, 40) × multiplier × level` |

---

## 작업 절차

### 1. 패치 노트 분석
공식 패치 노트에서 다음을 추출:
- 변경된 데이터 종류 (각인 / 노드 / 보석 등)
- 변경된 항목명 (게임 내 고유명)
- 변경 전/후 수치

### 2. 파일 위치 식별
- 위 매핑 표에서 카테고리 확인
- 파일 내 `@gameKey` 또는 `@ai-search-keywords`로 검색

### 3. 데이터 수정
- 수치만 변경 (계산 알고리즘은 절대 수정하지 않음)
- 항목 레벨 어노테이션 갱신:
  - `@lastGameUpdate` → 패치 날짜
  - `@lastVerified` → 빈 상태로 두거나 검증 후 갱신

### 4. 검증
```bash
npm test
```
- 33개 테스트가 모두 통과해야 함
- 실패 시 변경 사항 재검토

### 5. LOPEC 비교
- 동일 캐릭터로 LOPEC 효율표와 결과 비교
- 일치 확인 시 `@lastVerified` 갱신

---

## 알고리즘 vs 데이터 분리 원칙

이 프로젝트는 **알고리즘과 데이터를 명확히 분리**합니다:

```
src/lib/calc/        ← 알고리즘 (수정 금지)
src/config/tables/   ← 게임 데이터 (밸런스 패치 시 수정)
src/config/constants/ ← 게임 변환 공식 (자주 안 바뀜)
```

**AI 작업 원칙**:
1. `src/lib/calc/` 파일은 절대 수정하지 않음
2. `src/config/` 하위만 수정
3. 새 노드/각인 추가 시: 데이터만 추가, 알고리즘은 그대로
4. 새 노드 타입이 필요한 경우: 사용자에게 알려서 알고리즘 추가 요청

---

## 데이터 항목 어노테이션 예시

### 메인노드
```typescript
/**
 * @gameKey 음속 돌파
 * @class 기상술사
 * @category main-node
 * @tier 5
 * @lastVerified 2026-04-07
 * @lastGameUpdate 2026-04-07
 * @formula speed_based: under × min(speed, 40) + over × max(0, speed - 40)
 */
'음속 돌파': {
  type: 'speed_based',
  levels: { ... },
}
```

### 직업 각인 패시브
```typescript
/**
 * @gameKey 질풍노도
 * @class 기상술사
 * @category class-passive
 * @lastVerified 2026-04-07
 * @lastGameUpdate 2026-04-07
 */
'질풍노도': {
  critRate: (ms) => 10 + Math.floor(0.3 * Math.min(ms, 40) * 100) / 100,
  ...
}
```

---

## 효과

1. **AI 패치 자동화**: 패치 노트 → AI → 자동 수정 → 테스트 검증
2. **변경 이력 추적**: `@lastGameUpdate`로 마지막 패치 반영일 확인
3. **검증 상태 가시화**: `@lastVerified`로 LOPEC 일치 여부 확인
4. **알고리즘 안전성**: 데이터만 수정하므로 로직 버그 방지
