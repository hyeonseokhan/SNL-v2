/**
 * @file 효율 분석 계산 엔진 테스트
 *
 * 실제 API 데이터를 파싱하여 6가지 효율 지표를 계산하고
 * 콘솔에 상세 breakdown을 출력합니다.
 *
 * 실행: npm test
 * 감시: npm run test:watch
 */

import { describe, it, expect } from 'vitest'
import { calculateEfficiency, critStatToRate, hasteStatToSpeed } from '../calc-efficiency'
import type { CharData } from '@/types/character'
import type { EfficiencyMetrics } from '../calc-efficiency'

// ===================================================================
// 테스트 픽스처 — 리얼본좌강림 (기상술사)
// ===================================================================

/**
 * 실제 캐릭터 데이터 기반 최소 픽스처
 *
 * 치명: 890, 신속: 1620, 특화: 75
 * 각인: 돌격대장x4, 아드레날린x4, 원한x3, 타격의대가x4, 질량증가x4
 * 클래스: 기상술사 (질풍노도 +12% 공이속)
 */
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
        bangle: { name: '', icon: '', grade: '', quality: 0, tier: 4, enlightenment: 0, option: ['신속 +83', '치명 +117'], tooltipRaw: '' },
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

/** 효율 지표를 콘솔에 예쁘게 출력 */
function printMetrics(metrics: EfficiencyMetrics) {
  console.log('\n' + '='.repeat(60))
  console.log('  효율 분석 결과')
  console.log('='.repeat(60))

  const sections = [
    { label: '치명타 적중률', data: metrics.critRate, unit: '%' },
    { label: '치명타 피해량', data: metrics.critDamage, unit: '%' },
    { label: '공격 속도', data: metrics.attackSpeed, unit: '%' },
    { label: '이동 속도', data: metrics.moveSpeed, unit: '%' },
    { label: '팔찌 효율', data: metrics.braceletEfficiency, unit: '' },
    { label: '각인 효율', data: metrics.engravingEfficiency, unit: '' },
  ]

  for (const { label, data, unit } of sections) {
    console.log(`\n── ${label}: ${data.total.toFixed(2)}${unit} ──`)
    for (const b of data.breakdown) {
      console.log(`   ${b.source.padEnd(25)} ${b.value > 0 ? '+' : ''}${b.value.toFixed(2)}${unit}`)
    }
  }
  console.log('\n' + '='.repeat(60))
}

// ===================================================================
// 테스트
// ===================================================================

describe('변환 함수', () => {
  it('치명 스탯 → 치적% 변환', () => {
    expect(critStatToRate(890)).toBeCloseTo(31.85, 1)
  })

  it('신속 스탯 → 속도% 변환', () => {
    expect(hasteStatToSpeed(1620)).toBeCloseTo(27.82, 1)
  })
})

describe('리얼본좌강림 (기상술사) 효율 분석', () => {
  const fixture = createFixture()

  it('버프 없이 계산', () => {
    const metrics = calculateEfficiency(fixture)
    printMetrics(metrics)

    // 치적: 스탯 + 악세 + 노드 + 아드레날린 > 50%
    expect(metrics.critRate.total).toBeGreaterThan(50)

    // 치피: 기본 200% + 악세 + 기민함 > 200%
    expect(metrics.critDamage.total).toBeGreaterThan(200)

    // 공속: 신속 + 클래스버프 - 질량증가 > 0
    expect(metrics.attackSpeed.total).toBeGreaterThan(0)
    // 질량 증가 페널티 적용 확인
    expect(metrics.attackSpeed.total).toBeLessThan(metrics.moveSpeed.total)
  })

  it('만찬 + 전투축복 적용', () => {
    const metrics = calculateEfficiency(fixture, { feast: true, blessing3: true })
    printMetrics(metrics)

    // 버프 적용 시 속도 추가 +14%
    const noBuff = calculateEfficiency(fixture)
    expect(metrics.attackSpeed.total - noBuff.attackSpeed.total).toBeCloseTo(14, 0)
    expect(metrics.moveSpeed.total - noBuff.moveSpeed.total).toBeCloseTo(14, 0)
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
    const before = calculateEfficiency(fixture)
    const after = calculateEfficiency(modified)

    console.log('\n── 시뮬레이션: 아드레날린 → 예리한 둔기 ──')
    console.log(`   치적: ${before.critRate.total.toFixed(2)}% → ${after.critRate.total.toFixed(2)}% (${(after.critRate.total - before.critRate.total).toFixed(2)}%)`)
    console.log(`   치피: ${before.critDamage.total.toFixed(2)}% → ${after.critDamage.total.toFixed(2)}% (${(after.critDamage.total - before.critDamage.total).toFixed(2)}%)`)

    // 아드레날린 제거 → 치적 감소
    expect(after.critRate.total).toBeLessThan(before.critRate.total)
    // 예리한 둔기 추가 → 치피 증가
    expect(after.critDamage.total).toBeGreaterThan(before.critDamage.total)
  })
})
