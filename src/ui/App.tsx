// 허브 페이지 루트: 헤더 · 게임 카드 그리드 · 푸터.
import { GAMES } from '../data/games';
import { Footer } from './Footer';
import { GameGrid } from './GameGrid';
import { Header } from './Header';
import { useTheme } from './useTheme';

export function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="page">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <GameGrid games={GAMES} />
      </main>
      <Footer />
    </div>
  );
}
