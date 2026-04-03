/**
 * @file 각인 아이콘 매핑
 *
 * 공식 API에는 각인 아이콘이 포함되지 않으므로,
 * 각인명 → 아이콘 경로를 프론트엔드에서 매핑합니다.
 * CDN: https://pica.korlark.com/{path}
 */

/** CDN 베이스 URL */
const CDN = 'https://pica.korlark.com'

// ===================================================================
// 일반 각인 (전투 각인)
// ===================================================================

/**
 * 일반 각인명 → 아이콘 경로 매핑
 *
 * 어빌리티 스톤 감소 각인(공격력/방어력/공격속도/이동속도 감소) 포함.
 */
const COMBAT_ENGRAVING_ICONS: Record<string, string> = {
  '각성': 'EFUI_IconAtlas/buff/buff_113.png',
  '강령술': 'EFUI_IconAtlas/buff/buff_29.png',
  '강화 방패': 'EFUI_IconAtlas/buff/buff_239.png',
  '결투의 대가': 'EFUI_IconAtlas/ability/ability_224.png',
  '구슬동자': 'EFUI_IconAtlas/buff/buff_18.png',
  '굳은 의지': 'EFUI_IconAtlas/buff/buff_44.png',
  '급소 타격': 'EFUI_IconAtlas/buff/buff_168.png',
  '기습의 대가': 'EFUI_IconAtlas/buff/buff_148.png',
  '긴급구조': 'EFUI_IconAtlas/ability/ability_238.png',
  '달인의 저력': 'EFUI_IconAtlas/buff/buff_147.png',
  '돌격대장': 'EFUI_IconAtlas/buff/buff_210.png',
  '마나 효율 증가': 'EFUI_IconAtlas/buff/buff_166.png',
  '마나의 흐름': 'EFUI_IconAtlas/buff/buff_63.png',
  '바리케이드': 'EFUI_IconAtlas/buff/buff_170.png',
  '번개의 분노': 'EFUI_IconAtlas/buff/buff_191.png',
  '부러진 뼈': 'EFUI_IconAtlas/buff/buff_94.png',
  '분쇄의 주먹': 'EFUI_IconAtlas/buff/buff_83.png',
  '불굴': 'EFUI_IconAtlas/buff/buff_66.png',
  '선수필승': 'EFUI_IconAtlas/Achieve/achieve_08_62.png',
  '속전속결': 'EFUI_IconAtlas/ability/ability_236.png',
  '슈퍼 차지': 'EFUI_IconAtlas/Achieve/achieve_06_14.png',
  '승부사': 'EFUI_IconAtlas/buff/buff_136.png',
  '시선 집중': 'EFUI_IconAtlas/ability/ability_234.png',
  '실드 관통': 'EFUI_IconAtlas/buff/buff_89.png',
  '아드레날린': 'EFUI_IconAtlas/ability/ability_235.png',
  '안정된 상태': 'EFUI_IconAtlas/buff/buff_105.png',
  '약자 무시': 'EFUI_IconAtlas/Achieve/achieve_04_30.png',
  '에테르 포식자': 'EFUI_IconAtlas/buff/buff_74.png',
  '여신의 가호': 'EFUI_IconAtlas/buff/buff_229.png',
  '예리한 둔기': 'EFUI_IconAtlas/Achieve/achieve_03_40.png',
  '원한': 'EFUI_IconAtlas/buff/buff_71.png',
  '위기 모면': 'EFUI_IconAtlas/buff/buff_162.png',
  '저주받은 인형': 'EFUI_IconAtlas/buff/buff_237.png',
  '전문의': 'EFUI_IconAtlas/ability/ability_237.png',
  '정기 흡수': 'EFUI_IconAtlas/buff/buff_65.png',
  '정밀 단도': 'EFUI_IconAtlas/ability/ability_239.png',
  '중갑 착용': 'EFUI_IconAtlas/buff/buff_46.png',
  '질량 증가': 'EFUI_IconAtlas/ability/ability_231.png',
  '최대 마나 증가': 'EFUI_IconAtlas/buff/buff_122.png',
  '추진력': 'EFUI_IconAtlas/ability/ability_232.png',
  '타격의 대가': 'EFUI_IconAtlas/ability/ability_233.png',
  '탈출의 명수': 'EFUI_IconAtlas/buff/buff_10.png',
  '폭발물 전문가': 'EFUI_IconAtlas/buff/buff_121.png',
  // 감소 각인 (어빌리티 스톤)
  '공격력 감소': 'EFUI_IconAtlas/ability/ability_218.png',
  '방어력 감소': 'EFUI_IconAtlas/ability/ability_219.png',
  '공격속도 감소': 'EFUI_IconAtlas/ability/ability_220.png',
  '이동속도 감소': 'EFUI_IconAtlas/ability/ability_221.png',
}

// ===================================================================
// 직업 각인
// ===================================================================

/**
 * 직업 각인명 → 아이콘 경로 매핑
 */
const CLASS_ENGRAVING_ICONS: Record<string, string> = {
  // 워로드
  '광기': 'efui_iconatlas/ark_passive_bk/ark_passive_bk_1.png',
  '광전사의 비기': 'efui_iconatlas/ark_passive_bk/ark_passive_bk_2.png',
  // 디스트로이어
  '분노의 망치': 'efui_iconatlas/ark_passive_01/ark_passive_01_1.png',
  '중력 수련': 'efui_iconatlas/ark_passive_01/ark_passive_01_8.png',
  // 건랜서
  '고독한 기사': 'efui_iconatlas/ark_passive_gl/ark_passive_gl_2.png',
  '전투 태세': 'efui_iconatlas/ark_passive_gl/ark_passive_gl_1.png',
  // 홀리나이트
  '심판자': 'efui_iconatlas/ark_passive_hk/ark_passive_hk_3.png',
  '축복의 오라': 'efui_iconatlas/ark_passive_hk/ark_passive_hk_2.png',
  // 슬레이어
  '처단자': 'efui_iconatlas/ark_passive_bkf/ark_passive_bkf_1.png',
  '포식자': 'efui_iconatlas/ark_passive_bkf/ark_passive_bkf_2.png',
  // 브레이커
  '해방자': 'efui_iconatlas/ark_passive_hkf/ark_passive_hkf_5.png',
  '빛의 기사': 'efui_iconatlas/ark_passive_hkf/ark_passive_hkf_1.png',
  // 아르카나
  '황제의 칙령': 'efui_iconatlas/ark_passive_ac/ark_passive_ac_2.png',
  '황후의 은총': 'efui_iconatlas/ark_passive_ac/ark_passive_ac_1.png',
  // 서머너
  '넘치는 교감': 'efui_iconatlas/ark_passive_sm/ark_passive_sm_1.png',
  '상급 소환사': 'efui_iconatlas/ark_passive_sm/ark_passive_sm_2.png',
  // 바드
  '절실한 구원': 'efui_iconatlas/ark_passive_bd/ark_passive_bd_3.png',
  '진실된 용맹': 'efui_iconatlas/ark_passive_bd/ark_passive_bd_2.png',
  // 소서리스
  '점화': 'efui_iconatlas/ark_passive_scs/ark_passive_scs_1.png',
  '환류': 'efui_iconatlas/ark_passive_scs/ark_passive_scs_2.png',
  // 배틀마스터
  '오의 강화': 'efui_iconatlas/ark_passive_bm/ark_passive_bm_3.png',
  '초심': 'efui_iconatlas/ark_passive_bm/ark_passive_bm_1.png',
  // 인파이터
  '극의: 체술': 'efui_iconatlas/ark_passive_if/ark_passive_if_1.png',
  '충격 단련': 'efui_iconatlas/ark_passive_if/ark_passive_if_2.png',
  // 기공사
  '세맥타통': 'efui_iconatlas/ark_passive_so/ark_passive_so_4.png',
  '역천지체': 'efui_iconatlas/ark_passive_so/ark_passive_so_2.png',
  // 창술사
  '절정': 'efui_iconatlas/ark_passive_lm/ark_passive_lm_2.png',
  '절제': 'efui_iconatlas/ark_passive_lm/ark_passive_lm_1.png',
  // 스트라이커
  '오의난무': 'efui_iconatlas/ark_passive_bmm/ark_passive_bmm_1.png',
  '일격필살': 'efui_iconatlas/ark_passive_bmm/ark_passive_bmm_2.png',
  // 브레이커
  '권왕파천무': 'efui_iconatlas/ark_passive_ifm/ark_passive_ifm_1.png',
  '수라의 길': 'efui_iconatlas/ark_passive_ifm/ark_passive_ifm_4.png',
  // 블레이드
  '버스트': 'efui_iconatlas/ark_passive_bl/ark_passive_bl_1.png',
  '잔재된 기운': 'efui_iconatlas/ark_passive_bl/ark_passive_bl_5.png',
  // 데모닉
  '멈출 수 없는 충동': 'efui_iconatlas/ark_passive_dm/ark_passive_dm_1.png',
  '완벽한 억제': 'efui_iconatlas/ark_passive_dm/ark_passive_dm_6.png',
  // 리퍼
  '갈증': 'efui_iconatlas/ark_passive_01/ark_passive_01_16.png',
  '달의 소리': 'efui_iconatlas/ark_passive_rp/ark_passive_rp_1.png',
  // 소울이터
  '만월의 집행자': 'efui_iconatlas/ark_passive_se/ark_passive_se_2.png',
  '그믐의 경계': 'efui_iconatlas/ark_passive_se/ark_passive_se_5.png',
  // 호크아이
  '두 번째 동료': 'efui_iconatlas/ark_passive_he/ark_passive_he_2.png',
  '죽음의 습격': 'efui_iconatlas/ark_passive_he/ark_passive_he_1.png',
  // 데빌헌터
  '전술 탄환': 'efui_iconatlas/ark_passive_dh/ark_passive_dh_17.png',
  '핸드거너': 'efui_iconatlas/ark_passive_dh/ark_passive_dh_4.png',
  // 블래스터
  '포격 강화': 'efui_iconatlas/ark_passive_bs/ark_passive_bs_1.png',
  '화력 강화': 'efui_iconatlas/ark_passive_bs/ark_passive_bs_2.png',
  // 스카우터
  '아르데타인의 기술': 'efui_iconatlas/ark_passive_sc/ark_passive_sc_2.png',
  '진화의 유산': 'efui_iconatlas/ark_passive_sc/ark_passive_sc_1.png',
  // 건슬링어
  '사냥의 시간': 'efui_iconatlas/ark_passive_dhf/ark_passive_dhf_4.png',
  '피스메이커': 'efui_iconatlas/ark_passive_dhf/ark_passive_dhf_1.png',
  // 도화가
  '만개': 'efui_iconatlas/ark_passive_yy/ark_passive_yy_1.png',
  '회귀': 'efui_iconatlas/ark_passive_yy/ark_passive_yy_2.png',
  // 기상술사
  '이슬비': 'efui_iconatlas/ark_passive_01/ark_passive_01_56.png',
  '질풍노도': 'efui_iconatlas/ark_passive_wa/ark_passive_wa_1.png',
  // 브레이서
  '야성': 'efui_iconatlas/ark_passive_dr/ark_passive_dr_1.png',
  '환수 각성': 'efui_iconatlas/dr_skill/dr_skill_01_24.png',
  // 소울워커
  '업화의 계승자': 'efui_iconatlas/ark_passive_ddk/ark_passive_ddk_1.png',
  '드레드 로어': 'efui_iconatlas/ark_passive_ddk/ark_passive_ddk_5.png',
}

// ===================================================================
// 공개 API
// ===================================================================

/**
 * 각인명으로 아이콘 URL을 반환합니다.
 *
 * 일반 각인 → 직업 각인 순으로 조회하며,
 * 매핑에 없는 각인은 빈 문자열을 반환합니다.
 *
 * @param name - 각인명 (예: "돌격대장", "질풍노도")
 * @returns 아이콘 전체 URL 또는 빈 문자열
 *
 * @example
 * getEngravingIconUrl('돌격대장')
 * // → "https://pica.korlark.com/EFUI_IconAtlas/buff/buff_210.png"
 */
export function getEngravingIconUrl(name: string): string {
  const path = COMBAT_ENGRAVING_ICONS[name] ?? CLASS_ENGRAVING_ICONS[name]
  return path ? `${CDN}/${path}` : ''
}

/** 일반 각인(전투 각인) 이름 목록 */
export const COMBAT_ENGRAVING_NAMES = Object.keys(COMBAT_ENGRAVING_ICONS)

/** 직업 각인 이름 목록 */
export const CLASS_ENGRAVING_NAMES = Object.keys(CLASS_ENGRAVING_ICONS)
