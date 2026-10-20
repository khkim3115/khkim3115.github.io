// 테마(다크/라이트) 규칙의 단일 진실원본. 순수 모듈 — React/DOM 의존 없음.
// index.html 의 페인트 전 스크립트도 같은 규칙(키·기본값·색)을 따른다(theme.test.ts 가 어긋남을 잡는다).

export type Theme = 'dark' | 'light';

/** 같은 출처(khkim3115.github.io)의 게임들이 쓰는 nmm_·yd_ 키와 겹치지 않게 hub_ 접두어. */
export const THEME_KEY = 'hub_theme';

/** 모바일 주소창 색(<meta name="theme-color">). index.css 의 --bg 와 같다. */
export const THEME_COLORS: Record<Theme, string> = {
  dark: '#0d1117',
  light: '#f5f6f8',
};

/** 저장된 선택 → 시스템 설정(prefers-color-scheme) → 다크 순으로 정한다. */
export function resolveTheme(stored: string | null, prefersLight: boolean): Theme {
  if (stored === 'dark' || stored === 'light') return stored;
  return prefersLight ? 'light' : 'dark';
}

export function toggledTheme(theme: Theme): Theme {
  return theme === 'dark' ? 'light' : 'dark';
}
