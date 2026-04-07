/**
 * @file API → 파서 → 계산 엔진 통합 파이프라인 테스트
 *
 * 실제 로스트아크 API를 호출하여 CharData를 생성하고,
 * 계산 엔진의 결과를 LOPEC 효율표 값과 비교합니다.
 *
 * 실행: npm test
 *
 * 주의:
 * - LOA_API_TOKEN 환경변수 필요
 * - 캐릭터 세팅 변경 시 LOPEC 비교값도 갱신 필요
 */

import { describe, it, expect, beforeAll } from 'vitest'
import * as fs from 'fs'
import { parseApiResponse } from '@/lib/parser/api-parser'
import { calculateEfficiency } from '../calc-efficiency'
import type { CharData } from '@/types/character'
import type { EfficiencyMetrics } from '../calc-efficiency'

// ===================================================================
// API 호출 헬퍼
// ===================================================================

/** LOA_API_TOKEN을 .env.local에서 로드 */
function loadToken(): string | null {
  try {
    const env = fs.readFileSync('.env.local', 'utf8')
    const m = env.match(/LOA_API_TOKEN=(.+)/)
    return m ? m[1].split(',')[0].trim() : null
  } catch {
    return null
  }
}

/** 로스트아크 공식 API 호출 → CharData 파싱 */
async function fetchCharData(name: string, token: string): Promise<CharData> {
  const url = `https://developer-lostark.game.onstove.com/armories/characters/${encodeURIComponent(name)}`
  const res = await fetch(url, {
    headers: { Authorization: `bearer ${token}`, Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`API ${res.status}: ${name}`)
  const raw = await res.json()
  return parseApiResponse(raw)
}

// ===================================================================
// 검증할 캐릭터 + LOPEC 기준값
// ===================================================================

interface LopecRef {
  critRate: number
  critDmg: number
  atkSpeed: number
  moveSpeed: number
  bracelet: number
  engraving: number
  mainNode: number
}

const CHARS: { name: string; class: string; lopec: LopecRef }[] = [
  {
    name: '리얼본좌강림',
    class: '기상술사 (질풍노도)',
    lopec: {
      critRate: 97.15, critDmg: 250.20,
      atkSpeed: 43.83, moveSpeed: 53.83,
      bracelet: 14.05, engraving: 158.54,
      mainNode: 21.29,
    },
  },
  {
    name: '리얼막내강림',
    class: '발키리 (빛의 기사)',
    lopec: {
      critRate: 99.96, critDmg: 255.60,
      atkSpeed: 24.77, moveSpeed: 54.77,
      bracelet: 11.35, engraving: 159.72,
      mainNode: 21.00,
    },
  },
  {
    name: '토이코드',
    class: '브레이커 (?)',
    lopec: {
      critRate: 112.82, critDmg: 257.20,
      atkSpeed: 38.90, moveSpeed: 38.90,
      bracelet: 10.78, engraving: 156.20,
      mainNode: 64.22,
    },
  },
]

// ===================================================================
// 비교 출력 헬퍼
// ===================================================================

function printComparison(name: string, className: string, ours: EfficiencyMetrics, lopec: LopecRef) {
  console.log(`\n${'='.repeat(70)}`)
  console.log(`  ${name} (${className})`)
  console.log('='.repeat(70))
  console.log(`  지표              우리        LOPEC       차이`)
  console.log(`  ${'─'.repeat(60)}`)
  const rows = [
    { label: '치명타 적중률', ours: ours.critRate.total, lopec: lopec.critRate },
    { label: '치명타 피해량', ours: ours.critDamage.total, lopec: lopec.critDmg },
    { label: '공격 속도   ', ours: ours.attackSpeed.total, lopec: lopec.atkSpeed },
    { label: '이동 속도   ', ours: ours.moveSpeed.total, lopec: lopec.moveSpeed },
    { label: '팔찌 효율   ', ours: ours.braceletEfficiency.total, lopec: lopec.bracelet },
    { label: '각인 효율   ', ours: ours.engravingEfficiency.total, lopec: lopec.engraving },
    { label: '메인노드 효율', ours: ours.mainNodeEfficiency.total, lopec: lopec.mainNode },
  ]
  for (const r of rows) {
    const diff = r.ours - r.lopec
    const diffStr = diff >= 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)
    const mark = Math.abs(diff) < 0.5 ? '✓' : Math.abs(diff) < 5 ? '~' : '✗'
    console.log(`  ${r.label}    ${r.ours.toFixed(2).padStart(7)}%    ${r.lopec.toFixed(2).padStart(7)}%    ${diffStr.padStart(7)}  ${mark}`)
  }
}

// ===================================================================
// 테스트
// ===================================================================

const token = loadToken()

describe('API 파이프라인 검증 (실제 API 호출)', () => {
  if (!token) {
    it.skip('LOA_API_TOKEN이 없어 스킵', () => {})
    return
  }

  // 모든 캐릭터 데이터를 한 번에 fetch
  const dataMap: Record<string, CharData> = {}

  beforeAll(async () => {
    for (const c of CHARS) {
      try {
        dataMap[c.name] = await fetchCharData(c.name, token)
      } catch (e) {
        console.error(`Failed to fetch ${c.name}:`, e)
      }
    }
  }, 30000)

  for (const char of CHARS) {
    describe(`${char.name} (${char.class})`, () => {
      it('LOPEC 비교 출력', () => {
        const data = dataMap[char.name]
        if (!data) {
          console.log(`  ⚠️ ${char.name} 데이터 fetch 실패`)
          return
        }
        const metrics = calculateEfficiency(data)
        printComparison(char.name, char.class, metrics, char.lopec)
      })

      it('치명타 적중률 ±0.5% 이내', () => {
        const data = dataMap[char.name]
        if (!data) return
        const m = calculateEfficiency(data)
        expect(Math.abs(m.critRate.total - char.lopec.critRate)).toBeLessThan(0.5)
      })

      it('치명타 피해량 ±5% 이내', () => {
        const data = dataMap[char.name]
        if (!data) return
        const m = calculateEfficiency(data)
        expect(Math.abs(m.critDamage.total - char.lopec.critDmg)).toBeLessThan(5)
      })

      it('공격 속도 ±0.5% 이내', () => {
        const data = dataMap[char.name]
        if (!data) return
        const m = calculateEfficiency(data)
        expect(Math.abs(m.attackSpeed.total - char.lopec.atkSpeed)).toBeLessThan(0.5)
      })

      it('이동 속도 ±0.5% 이내', () => {
        const data = dataMap[char.name]
        if (!data) return
        const m = calculateEfficiency(data)
        expect(Math.abs(m.moveSpeed.total - char.lopec.moveSpeed)).toBeLessThan(0.5)
      })

      it('메인노드 효율 ±0.5% 이내', () => {
        const data = dataMap[char.name]
        if (!data) return
        const m = calculateEfficiency(data)
        expect(Math.abs(m.mainNodeEfficiency.total - char.lopec.mainNode)).toBeLessThan(0.5)
      })
    })
  }
})
