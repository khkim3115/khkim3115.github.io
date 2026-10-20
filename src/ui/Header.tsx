// 상단 바: 허브 제목 + 테마 전환. 아이콘 규칙은 게임들의 Header 와 같다(다크일 때 ☀️ = 라이트로).
import type { Theme } from '../lib/theme';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  const nextLabel = theme === 'dark' ? '라이트 모드로' : '다크 모드로';
  return (
    <header className="topbar">
      <div className="brand">
        <h1>🎲 보드게임 모음</h1>
        <p className="sub">설치 없이 브라우저에서 바로 플레이</p>
      </div>
      <button className="theme-btn" type="button" onClick={onToggleTheme} aria-label={nextLabel} title={nextLabel}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </header>
  );
}
