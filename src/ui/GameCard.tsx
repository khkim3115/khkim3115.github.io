// 게임 카드 1장: 아이콘 · 이름 · 한 줄 소개 · 태그 칩 · 플레이 / 코드.
// status 'soon' 은 비활성 '준비 중' 카드 — 플레이 버튼은 disabled, 레포가 없으면 코드 링크도 숨긴다.
import type { Game } from '../data/games';

export function GameCard({ game }: { game: Game }) {
  const soon = game.status === 'soon';
  const titleId = `game-${game.id}`;

  return (
    <article className={soon ? 'game-card is-soon' : 'game-card'} aria-labelledby={titleId}>
      <div className="game-head">
        {/* 인라인 SVG 대신 <img> — 아이콘마다 그라디언트 id(bg·glow 등)가 겹쳐도 서로 간섭하지 않는다. */}
        <img className="game-icon" src={import.meta.env.BASE_URL + game.iconPath} alt="" width={56} height={56} />
        <div className="game-title">
          <h2 id={titleId}>{game.name}</h2>
          {soon && <span className="badge-soon">준비 중</span>}
        </div>
      </div>

      <p className="game-summary">{game.summary}</p>

      {game.tags.length > 0 && (
        <ul className="tag-list" aria-label="기능">
          {game.tags.map((tag) => (
            <li key={tag} className="chip">
              {tag}
            </li>
          ))}
        </ul>
      )}

      <div className="game-actions">
        {soon ? (
          <button className="btn-primary" type="button" disabled aria-label={`${game.name} 플레이 (준비 중)`}>
            플레이
          </button>
        ) : (
          // 같은 탭으로 이동 — 허브는 게임을 고르는 입구라 뒤로 가기로 돌아오면 된다.
          <a className="btn-primary" href={game.liveUrl} aria-label={`${game.name} 플레이`}>
            플레이
          </a>
        )}
        {game.repoUrl && (
          <a
            className="btn-ghost"
            href={game.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${game.name} 코드 보기 (GitHub, 새 탭)`}
          >
            코드
          </a>
        )}
      </div>
    </article>
  );
}
