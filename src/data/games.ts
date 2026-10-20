// 허브에 노출할 게임 목록의 단일 진실원본. 순수 데이터 모듈 — React/DOM 의존 없음.
// 새 게임 추가 = 아래 GAMES 에 항목 한 줄 + public/games/<id>.svg 아이콘 1개. 무결성은 games.test.ts 가 검사한다.
// 비공개 레포는 넣지 않는다.

/** 카드에 칩으로 붙는 기능 태그. 새 태그가 필요하면 여기에 먼저 추가한다(오타 방지). */
export const GAME_TAGS = [
  '솔로 AI',
  '솔로 도전',
  '온라인 멀티',
  '로컬 핫시트',
  '최적 EV 헬퍼',
  '리더보드',
  '트레이 앱',
] as const;
export type GameTag = (typeof GAME_TAGS)[number];

/** live = 플레이 가능, soon = 비활성 '준비 중' 카드. */
export const GAME_STATUSES = ['live', 'soon'] as const;
export type GameStatus = (typeof GAME_STATUSES)[number];

export interface Game {
  /** 안정적 식별자(React key). kebab-case, 아이콘 파일명과 같다. */
  id: string;
  /** 카드 제목. */
  name: string;
  /** 한 줄 소개. */
  summary: string;
  /** 기능 태그 칩. */
  tags: GameTag[];
  /** 플레이 URL. 'soon' 이면 빈 문자열(플레이 버튼 비활성). */
  liveUrl: string;
  /** 소스 레포 URL. 레포가 아직 없으면 빈 문자열(코드 링크 미노출). */
  repoUrl: string;
  /** public 기준 상대 경로 — 'games/<id>.svg'. 게임 레포에서 복사해 둔 파일(핫링크 금지). */
  iconPath: string;
  status: GameStatus;
}

/** 카드 노출 순서 그대로. */
export const GAMES: Game[] = [
  {
    id: 'yacht-dice',
    name: '요트다이스',
    summary: '주사위 5개로 12칸을 채우는 요트다이스. 게임 전체를 내다본 최적 기댓값(EV) 헬퍼 내장',
    tags: ['솔로 도전', '온라인 멀티', '최적 EV 헬퍼', '리더보드', '트레이 앱'],
    liveUrl: 'https://khkim3115.github.io/YachtDice_Helper/',
    repoUrl: 'https://github.com/khkim3115/YachtDice_Helper',
    iconPath: 'games/yacht-dice.svg',
    status: 'live',
  },
  {
    id: 'nine-mens-morris',
    name: '나인 멘스 모리스',
    summary: '말 9개로 밀(3목)을 만들어 상대 말을 떼는 고전 보드게임. 난이도별 AI와 1:1 온라인 대전',
    tags: ['솔로 AI', '온라인 멀티', '트레이 앱'],
    liveUrl: 'https://khkim3115.github.io/NineMensMorris/',
    repoUrl: 'https://github.com/khkim3115/NineMensMorris',
    iconPath: 'games/nine-mens-morris.svg',
    status: 'live',
  },
  {
    id: 'splendor',
    name: '스플랜더',
    summary: '보석 토큰으로 카드와 귀족을 모아 명성을 겨루는 보드게임. 원작 룰 그대로, 난이도별 AI와 한 기기 핫시트',
    tags: ['솔로 AI', '로컬 핫시트', '트레이 앱'],
    liveUrl: 'https://khkim3115.github.io/splendor/',
    repoUrl: 'https://github.com/khkim3115/splendor',
    iconPath: 'games/splendor.svg',
    status: 'live',
  },
  {
    id: 'twelve-janggi',
    name: '십이장기',
    summary: '3×4 작은 판에서 왕·장·상·자 네 말로 두는 미니 장기',
    tags: [],
    liveUrl: '',
    repoUrl: '',
    iconPath: 'games/twelve-janggi.svg',
    status: 'soon',
  },
];
