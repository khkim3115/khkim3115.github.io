// 게임 카드 그리드. 모바일 1열 → 넓은 화면 2열(index.css).
import type { Game } from '../data/games';
import { GameCard } from './GameCard';

export function GameGrid({ games }: { games: Game[] }) {
  return (
    <ul className="game-grid" aria-label="게임 목록">
      {games.map((game) => (
        <li key={game.id}>
          <GameCard game={game} />
        </li>
      ))}
    </ul>
  );
}
