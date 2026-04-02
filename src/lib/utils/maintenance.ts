/**
 * @file 로스트아크 정기 서버 점검 유틸리티
 *
 * 정기 점검: 매주 수요일 KST 06:00 ~ 10:00
 * 서버/클라이언트 모두에서 사용 가능
 */

export interface MaintenanceInfo {
  isMaintenance: boolean
  /** 점검 종료 시각 문자열 (예: "오전 10시") */
  endsAt: string
}

/**
 * 현재 시각이 정기 점검 시간인지 확인
 * @param now 기준 시각 (기본값: 현재 시각, KST 자동 변환)
 */
export function getMaintenanceInfo(now = new Date()): MaintenanceInfo {
  // KST = UTC+9
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  const day  = kst.getUTCDay()   // 0=일, 3=수
  const hour = kst.getUTCHours()

  const isMaintenance = day === 3 && hour >= 6 && hour < 10

  return { isMaintenance, endsAt: '오전 10시' }
}
