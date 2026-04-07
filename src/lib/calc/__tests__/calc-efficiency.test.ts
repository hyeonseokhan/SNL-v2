/**
 * @file 효율 분석 계산 엔진 테스트
 *
 * LOPEC (lopec.kr) 실제 값과 비교하여 검증합니다.
 *
 * 실행: npm test
 * 감시: npm run test:watch
 */

import { describe, it, expect } from 'vitest'
import { calculateEfficiency, critStatToRate, hasteStatToSpeed } from '../calc-efficiency'
import type { CharData } from '@/types/character'
import type { EfficiencyMetrics } from '../calc-efficiency'

// ===================================================================
// 테스트 픽스처 — 리얼본좌강림 (기상술사/질풍노도)
// ===================================================================

function createFixture(): CharData {
  return {
    profile: {
      class: '기상술사',
      secondClass: '질풍노도',
      itemLevel: 1762.5,
      characterName: '리얼본좌강림',
      serverName: '아브렐슈드',
      characterLevel: 70,
      guildName: '샛별이와아이들',
      title: '죽음의 현신',
      titleIcon: '',
      characterImage: null,
      expeditionLevel: 328,
      pvpGrade: '-',
      townLevel: 70,
      townName: '알짜배기땅',
    },
    stats: {
      critical: 890,
      haste: 1620,
      special: 75,
      suppress: 79,
      patience: 71,
      expert: 75,
      combatPower: 5452,
      attack: 198886,
      maxHp: 350212,
    },
    engraving: [
      { name: '돌격대장', level: 4, grade: '유물', stoneLevel: 2, description: '', icon: '' },
      { name: '아드레날린', level: 4, grade: '유물', stoneLevel: 3, description: '', icon: '' },
      { name: '원한', level: 3, grade: '유물', stoneLevel: 0, description: '', icon: '' },
      { name: '타격의 대가', level: 4, grade: '유물', stoneLevel: 0, description: '', icon: '' },
      { name: '질량 증가', level: 4, grade: '유물', stoneLevel: 0, description: '', icon: '' },
    ],
    armory: {
      equipList: [],
      equipment: {
        weapon: { name: '', refine: 0, quality: 0, itemLevel: 0, icon: '', grade: '', tier: 0, tooltipRaw: '' },
      },
      accessory: {
        necklace: { name: '', icon: '', grade: '', quality: 94, tier: 4, enlightenment: 0, option: ['추가 피해 +1.60%', '공격력 +80', '적에게 주는 피해 +1.20%'], tooltipRaw: '' },
        earing1: { name: '', icon: '', grade: '', quality: 88, tier: 4, enlightenment: 0, option: ['공격력 +1.55%', '무기 공격력 +0.80%', '최대 생명력 +3250'], tooltipRaw: '' },
        earing2: { name: '', icon: '', grade: '', quality: 91, tier: 4, enlightenment: 0, option: ['공격력 +1.55%', '무기 공격력 +0.80%', '상태이상 공격 지속시간 +1.00%'], tooltipRaw: '' },
        ring1: { name: '', icon: '', grade: '', quality: 91, tier: 4, enlightenment: 0, option: ['치명타 적중률 +1.55%', '치명타 피해 +1.10%', '무기 공격력 +195'], tooltipRaw: '' },
        ring2: { name: '', icon: '', grade: '', quality: 95, tier: 4, enlightenment: 0, option: ['치명타 적중률 +1.55%', '치명타 피해 +1.10%', '무기 공격력 +195'], tooltipRaw: '' },
        bangle: { name: '', icon: '', grade: '', quality: 0, tier: 4, enlightenment: 0, option: ['신속 +83', '치명 +117', '추가 피해가 3.5% 증가한다. 악마 및 대악마 계열 피해량이 2.5% 증가한다.', '치명타 적중률이 4.2% 증가한다. 공격이 치명타로 적중 시 적에게 주는 피해가 1.5% 증가한다.'], tooltipRaw: '' },
        stone: { name: '', icon: '', grade: '', tooltipRaw: '', option: [], engravings: [], levelBonus: '' },
        compass: { name: '', icon: '', grade: '', tooltipRaw: '' },
        charm: { name: '', icon: '', grade: '', tooltipRaw: '' },
        orb: { name: '', icon: '', grade: '', tooltipRaw: '', paradisePower: 0 },
      },
    },
    arkPassive: {
      evolution: {
        points: 140, karmaRank: 6, karmaLevel: 25,
        nodes: [
          { name: '치명', level: 14, tier: 1, icon: '', tooltip: '' },
          { name: '신속', level: 26, tier: 1, icon: '', tooltip: '' },
          { name: '예리한 감각', level: 1, tier: 2, icon: '', tooltip: '' },
          { name: '한계 돌파', level: 2, tier: 2, icon: '', tooltip: '' },
          { name: '무한한 마력', level: 1, tier: 3, icon: '', tooltip: '' },
          { name: '혼신의 강타', level: 1, tier: 3, icon: '', tooltip: '' },
          { name: '회심', level: 1, tier: 4, icon: '', tooltip: '' },
          { name: '분쇄', level: 1, tier: 4, icon: '', tooltip: '' },
          { name: '음속 돌파', level: 2, tier: 5, icon: '', tooltip: '' },
        ],
      },
      enlightenment: {
        points: 101, karmaRank: 6, karmaLevel: 27,
        nodes: [
          { name: '질풍노도', level: 1, tier: 1, icon: '', tooltip: '' },
          { name: '환기', level: 3, tier: 2, icon: '', tooltip: '' },
          { name: '기민함', level: 3, tier: 3, icon: '', tooltip: '' },
          { name: '바람의 길', level: 2, tier: 4, icon: '', tooltip: '' },
          { name: '공간 가르기', level: 3, tier: 4, icon: '', tooltip: '' },
        ],
      },
      leap: {
        points: 70, karmaRank: 6, karmaLevel: 26,
        nodes: [
          { name: '풀려난 힘', level: 5, tier: 1, icon: '', tooltip: '' },
          { name: '잠재력 해방', level: 4, tier: 1, icon: '', tooltip: '' },
          { name: '즉각적인 주문', level: 2, tier: 1, icon: '', tooltip: '' },
          { name: '단련된 가르기', level: 3, tier: 2, icon: '', tooltip: '' },
        ],
      },
    },
    gem: [],
    card: { cards: [], setName: '', setSummary: '', setEffects: [] },
    arkGrid: { slots: [], effects: [] },
    skills: [],
    uniqueKey: '리얼본좌강림',
  }
}

// ===================================================================
// 헬퍼
// ===================================================================

function printMetrics(label: string, metrics: EfficiencyMetrics) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`  ${label}`)
  console.log('='.repeat(60))

  const sections = [
    { label: '치명타 적중률', data: metrics.critRate, unit: '%' },
    { label: '치명타 피해량', data: metrics.critDamage, unit: '%' },
    { label: '공격 속도', data: metrics.attackSpeed, unit: '%' },
    { label: '이동 속도', data: metrics.moveSpeed, unit: '%' },
    { label: '팔찌 효율', data: metrics.braceletEfficiency, unit: '%' },
    { label: '각인 효율', data: metrics.engravingEfficiency, unit: '%' },
    { label: '메인노드 효율', data: metrics.mainNodeEfficiency, unit: '%' },
  ]

  for (const { label, data, unit } of sections) {
    console.log(`\n── ${label}: ${data.total.toFixed(2)}${unit} ──`)
    for (const b of data.breakdown) {
      console.log(`   ${b.source.padEnd(30)} ${b.value > 0 ? '+' : ''}${b.value.toFixed(2)}${unit}`)
    }
  }
  console.log('\n' + '='.repeat(60))
}

// ===================================================================
// 테스트
// ===================================================================

describe('변환 함수', () => {
  it('치명 스탯 → 치적% (LOPEC: floor(890/0.2794)/100)', () => {
    // LOPEC: floor(890 / 0.2794) / 100 = floor(3185.39) / 100 = 31.85
    expect(critStatToRate(890)).toBe(31.85)
  })

  it('신속 스탯 → 속도% (LOPEC: floor(1620/0.5821)/100)', () => {
    // LOPEC: floor(1620 / 0.5821) / 100 = floor(2783.02) / 100 = 27.83
    expect(hasteStatToSpeed(1620)).toBe(27.83)
  })
})

describe('리얼본좌강림 (기상술사) — LOPEC/로스트빌드 값 검증', () => {
  const fixture = createFixture()

  // LOPEC 효율표 기준 (도핑 없음)
  const metrics = calculateEfficiency(fixture)

  it('전체 결과 출력 (도핑 없음)', () => {
    printMetrics('리얼본좌강림 — 도핑 없음', metrics)
  })

  it('공격 속도 = 43.83%', () => {
    // 기본14 + 신속27.83 + 질풍노도12 - 질량증가10 = 43.83
    expect(metrics.attackSpeed.total).toBeCloseTo(43.83, 1)
  })

  it('이동 속도 = 53.83%', () => {
    // 기본14 + 신속27.83 + 질풍노도12 = 53.83
    expect(metrics.moveSpeed.total).toBeCloseTo(53.83, 1)
  })

  it('치명타 적중률 = 97.15%', () => {
    // LOPEC breakdown:
    // 스탯31.85 + 악세3.10 + 팔찌4.20 + 진화16.00 + 직업22.00 + 아드레날린20.00 = 97.15
    // 질풍노도 22% = 10% 기본 + floor(0.3 × min(53.83, 40)) = 10 + 12 = 22
    // 기민함 12%는 LOPEC에서 "직업 기본 22%"에 포함되지 않고 별도?
    // → 실제: 31.85 + 3.10 + 4.20 + 16.00 + 22.00 + 20.00 = 97.15
    // → 기민함은 LOPEC breakdown에 포함되지 않음 (질풍노도 속도보너스가 기민함 역할)
    expect(metrics.critRate.total).toBeCloseTo(97.15, 0)
  })

  it('치명타 피해량 = 250.20%', () => {
    // 기본200 + 악세2.20 + 기민함(치피)48.00 = 250.20
    expect(metrics.critDamage.total).toBeCloseTo(250.20, 0)
  })

  it('메인노드 효율: 음속 돌파 Lv.2 = 21.29%', () => {
    expect(metrics.mainNodeEfficiency.total).toBeCloseTo(21.29, 1)
  })

  it('시뮬레이션: 아드레날린 → 예리한 둔기 교체', () => {
    const modified: CharData = {
      ...fixture,
      engraving: fixture.engraving.map(e =>
        e.name === '아드레날린'
          ? { ...e, name: '예리한 둔기', level: 4, stoneLevel: 0 }
          : e
      ),
    }
    const before = metrics
    const after = calculateEfficiency(modified)

    printMetrics('시뮬레이션: 아드레날린 → 예리한 둔기', after)

    console.log('\n── 변화량 ──')
    console.log(`   치적: ${before.critRate.total.toFixed(2)}% → ${after.critRate.total.toFixed(2)}% (${(after.critRate.total - before.critRate.total).toFixed(2)}%)`)
    console.log(`   치피: ${before.critDamage.total.toFixed(2)}% → ${after.critDamage.total.toFixed(2)}% (${(after.critDamage.total - before.critDamage.total).toFixed(2)}%)`)

    // 아드레날린 제거 → 치적 -20%
    expect(after.critRate.total).toBeCloseTo(before.critRate.total - 20, 0)
    // 예리한 둔기 추가 → 치피 +50%
    expect(after.critDamage.total).toBeCloseTo(before.critDamage.total + 50, 0)
  })
})

// ===================================================================
// 리얼막내강림 (발키리/빛의기사) — 치명 빌드
// ===================================================================

function createValkyrieFixture(): CharData {
  return {
    profile: { class: '발키리', secondClass: '빛의 기사', itemLevel: 1720, characterName: '리얼막내강림', serverName: '아브렐슈드', characterLevel: 70, guildName: '', title: '', titleIcon: '', characterImage: null, expeditionLevel: 0, pvpGrade: '', townLevel: 0, townName: '' },
    stats: { critical: 1762, haste: 627, special: 75, suppress: 0, patience: 0, expert: 0, combatPower: 0, attack: 0, maxHp: 0 },
    engraving: [
      { name: '원한', level: 3, grade: '유물', stoneLevel: 3, description: '', icon: '' },
      { name: '예리한 둔기', level: 0, grade: '유물', stoneLevel: 0, description: '', icon: '' },
      { name: '아드레날린', level: 4, grade: '유물', stoneLevel: 2, description: '', icon: '' },
      { name: '돌격대장', level: 4, grade: '유물', stoneLevel: 0, description: '', icon: '' },
      { name: '타격의 대가', level: 4, grade: '유물', stoneLevel: 0, description: '', icon: '' },
    ],
    armory: { equipList: [], equipment: { weapon: { name:'',refine:0,quality:0,itemLevel:0,icon:'',grade:'',tier:0,tooltipRaw:'' } }, accessory: { necklace:{name:'',icon:'',grade:'',quality:0,tier:4,enlightenment:0,option:[],tooltipRaw:''}, earing1:{name:'',icon:'',grade:'',quality:0,tier:4,enlightenment:0,option:[],tooltipRaw:''}, earing2:{name:'',icon:'',grade:'',quality:0,tier:4,enlightenment:0,option:[],tooltipRaw:''}, ring1:{name:'',icon:'',grade:'',quality:0,tier:4,enlightenment:0,option:[],tooltipRaw:''}, ring2:{name:'',icon:'',grade:'',quality:0,tier:4,enlightenment:0,option:[],tooltipRaw:''}, bangle:{name:'',icon:'',grade:'',quality:0,tier:4,enlightenment:0,option:[],tooltipRaw:''}, stone:{name:'',icon:'',grade:'',tooltipRaw:'',option:[],engravings:[],levelBonus:''}, compass:{name:'',icon:'',grade:'',tooltipRaw:''}, charm:{name:'',icon:'',grade:'',tooltipRaw:''}, orb:{name:'',icon:'',grade:'',tooltipRaw:'',paradisePower:0} } },
    arkPassive: {
      evolution: { points: 140, karmaRank: 6, karmaLevel: 25, nodes: [
        { name: '입식 타격가', level: 2, tier: 5, icon: '', tooltip: '' },
      ] },
      enlightenment: { points: 101, karmaRank: 6, karmaLevel: 25, nodes: [
        { name: '빛의 기사', level: 3, tier: 1, icon: '', tooltip: '' },
      ] },
      leap: { points: 70, karmaRank: 6, karmaLevel: 25, nodes: [] },
    },
    gem: [], card: { cards: [], setName: '', setSummary: '', setEffects: [] }, arkGrid: { slots: [], effects: [] }, skills: [], uniqueKey: '리얼막내강림',
  }
}

describe('리얼막내강림 (발키리) — LOPEC 비교', () => {
  const fixture = createValkyrieFixture()
  const metrics = calculateEfficiency(fixture)

  it('결과 출력', () => {
    printMetrics('리얼막내강림 (발키리)', metrics)
    console.log('\nLOPEC 비교:')
    console.log('  치적: 우리', metrics.critRate.total.toFixed(2) + '% vs LOPEC 99.96%')
    console.log('  치피: 우리', metrics.critDamage.total.toFixed(2) + '% vs LOPEC 255.60%')
    console.log('  공속: 우리', metrics.attackSpeed.total.toFixed(2) + '% vs LOPEC 24.77%')
    console.log('  이속: 우리', metrics.moveSpeed.total.toFixed(2) + '% vs LOPEC 54.77%')
  })

  it('공속 = 24.77%', () => {
    // 기본14 + 신속10.77 + 빛의기사0 - 질량증가0 = 24.77
    expect(metrics.attackSpeed.total).toBeCloseTo(24.77, 0)
  })

  it('이속 = 54.77%', () => {
    expect(metrics.moveSpeed.total).toBeCloseTo(54.77, 0)
  })

  it('메인노드: 입식 타격가 Lv.2 = 21%', () => {
    // 발키리 입식 타격가는 고정값
    expect(metrics.mainNodeEfficiency.total).toBeCloseTo(21, 1)
  })
})

// ===================================================================
// 9X1214 (아르카나/황제의칙령) — 신속 빌드
// ===================================================================

function createArcanaFixture(): CharData {
  return {
    profile: { class: '아르카나', secondClass: '황제의 칙령', itemLevel: 1770, characterName: '9X1214', serverName: '', characterLevel: 70, guildName: '', title: '', titleIcon: '', characterImage: null, expeditionLevel: 0, pvpGrade: '', townLevel: 0, townName: '' },
    stats: { critical: 678, haste: 1825, special: 75, suppress: 0, patience: 0, expert: 0, combatPower: 0, attack: 0, maxHp: 0 },
    engraving: [
      { name: '원한', level: 1, grade: '유물', stoneLevel: 0, description: '', icon: '' },
      { name: '아드레날린', level: 3, grade: '유물', stoneLevel: 3, description: '', icon: '' },
      { name: '질량 증가', level: 4, grade: '유물', stoneLevel: 0, description: '', icon: '' },
      { name: '저주받은 인형', level: 4, grade: '유물', stoneLevel: 0, description: '', icon: '' },
      { name: '돌격대장', level: 0, grade: '유물', stoneLevel: 2, description: '', icon: '' },
    ],
    armory: { equipList: [], equipment: { weapon: { name:'',refine:0,quality:0,itemLevel:0,icon:'',grade:'',tier:0,tooltipRaw:'' } }, accessory: { necklace:{name:'',icon:'',grade:'',quality:0,tier:4,enlightenment:0,option:[],tooltipRaw:''}, earing1:{name:'',icon:'',grade:'',quality:0,tier:4,enlightenment:0,option:[],tooltipRaw:''}, earing2:{name:'',icon:'',grade:'',quality:0,tier:4,enlightenment:0,option:[],tooltipRaw:''}, ring1:{name:'',icon:'',grade:'',quality:0,tier:4,enlightenment:0,option:[],tooltipRaw:''}, ring2:{name:'',icon:'',grade:'',quality:0,tier:4,enlightenment:0,option:[],tooltipRaw:''}, bangle:{name:'',icon:'',grade:'',quality:0,tier:4,enlightenment:0,option:[],tooltipRaw:''}, stone:{name:'',icon:'',grade:'',tooltipRaw:'',option:[],engravings:[],levelBonus:''}, compass:{name:'',icon:'',grade:'',tooltipRaw:''}, charm:{name:'',icon:'',grade:'',tooltipRaw:''}, orb:{name:'',icon:'',grade:'',tooltipRaw:'',paradisePower:0} } },
    arkPassive: {
      evolution: { points: 140, karmaRank: 6, karmaLevel: 25, nodes: [
        { name: '뭉툭한 가시', level: 2, tier: 5, icon: '', tooltip: '' },
      ] },
      enlightenment: { points: 101, karmaRank: 6, karmaLevel: 26, nodes: [
        { name: '황제의 칙령', level: 3, tier: 1, icon: '', tooltip: '' },
      ] },
      leap: { points: 70, karmaRank: 6, karmaLevel: 25, nodes: [] },
    },
    gem: [], card: { cards: [], setName: '', setSummary: '', setEffects: [] }, arkGrid: { slots: [], effects: [] }, skills: [], uniqueKey: '9X1214',
  }
}

describe('9X1214 (아르카나) — LOPEC 비교', () => {
  const fixture = createArcanaFixture()
  const metrics = calculateEfficiency(fixture)

  it('결과 출력', () => {
    printMetrics('9X1214 (아르카나)', metrics)
    console.log('\nLOPEC 비교:')
    console.log('  치적: 우리', metrics.critRate.total.toFixed(2) + '% vs LOPEC 55.86%')
    console.log('  치피: 우리', metrics.critDamage.total.toFixed(2) + '% vs LOPEC 209.00%')
    console.log('  공속: 우리', metrics.attackSpeed.total.toFixed(2) + '% vs LOPEC 41.35%')
    console.log('  이속: 우리', metrics.moveSpeed.total.toFixed(2) + '% vs LOPEC 51.35%')
  })

  it('공속 검증 (악세/팔찌/노드 데이터 미포함 상태)', () => {
    // 기본14 + 신속31.35 - 질량증가10 = 35.35
    // LOPEC 41.35와 차이 6%: 악세/팔찌/깨달음 노드 속도 보너스 미포함
    expect(metrics.attackSpeed.total).toBeCloseTo(35.35, 0)
  })
})
