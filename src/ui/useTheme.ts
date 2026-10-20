// 테마 상태 훅. 초기값은 index.html 스크립트가 페인트 전에 <html data-theme> 에 심어 둔 값을 이어받는다.
import { useState } from 'react';
import { THEME_COLORS, THEME_KEY, toggledTheme, type Theme } from '../lib/theme';

function readDocumentTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readDocumentTheme);

  // 직접 고른 경우에만 저장한다 — 고르기 전에는 계속 시스템 설정을 따른다.
  const toggleTheme = () => {
    const next = toggledTheme(theme);
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // localStorage 사용 불가(사파리 사생활 모드 등) — 이번 방문에만 적용.
    }
    setTheme(next);
  };

  return { theme, toggleTheme };
}
