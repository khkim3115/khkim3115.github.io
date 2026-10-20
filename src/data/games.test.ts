// 게임 목록 단일 진실원본(games.ts)의 무결성 테스트.
// 새 게임을 한 줄 추가했을 때 흔한 실수(id 중복·http 링크·오타 난 태그·아이콘 누락)를 여기서 잡는다.
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import { GAMES, GAME_STATUSES, GAME_TAGS } from './games';

const PUBLIC_DIR = fileURLToPath(new URL('../../public/', import.meta.url));
// existsSync 는 Windows 에서 대소문자를 무시한다 — Pages(리눅스)와 같게 실제 파일 이름 목록과 비교한다.
const ICON_FILES = readdirSync(PUBLIC_DIR + 'games');

/** https://github.com/<owner>/<repo> 의 <repo>. */
const repoName = (repoUrl: string) => new URL(repoUrl).pathname.split('/')[2];

const live = GAMES.filter((g) => g.status === 'live');
const soon = GAMES.filter((g) => g.status === 'soon');

describe('GAMES 무결성', () => {
  it('비어있지 않다', () => {
    expect(GAMES.length).toBeGreaterThan(0);
  });

  it('id 는 유일하다(React key 안정성)', () => {
    const ids = GAMES.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('name 은 유일하다(항목을 복사해 추가하고 이름을 안 바꾼 실수 방지)', () => {
    const names = GAMES.map((g) => g.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('repoUrl 은 (비어있지 않으면) 게임끼리 겹치지 않는다', () => {
    const repos = GAMES.map((g) => g.repoUrl).filter((u) => u !== '');
    expect(new Set(repos).size).toBe(repos.length);
  });

  it('id 는 kebab-case 다(아이콘 파일명으로도 쓰임)', () => {
    for (const g of GAMES) {
      expect(g.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it('필수 문자열 필드(id·name·summary·iconPath)가 비어있지 않다', () => {
    for (const g of GAMES) {
      for (const field of ['id', 'name', 'summary', 'iconPath'] as const) {
        expect(typeof g[field], `${g.id}.${field}`).toBe('string');
        expect(g[field].trim().length, `${g.id}.${field}`).toBeGreaterThan(0);
      }
    }
  });

  it('summary 는 한 줄이다(줄바꿈 없음)', () => {
    for (const g of GAMES) {
      expect(g.summary, g.id).not.toMatch(/\n/);
    }
  });

  it('status 는 GAME_STATUSES 중 하나다', () => {
    for (const g of GAMES) {
      expect(GAME_STATUSES).toContain(g.status);
    }
  });

  it('태그는 GAME_TAGS 에 있는 값이고 한 카드 안에서 중복되지 않는다', () => {
    for (const g of GAMES) {
      for (const tag of g.tags) {
        expect(GAME_TAGS, `${g.id}: ${tag}`).toContain(tag);
      }
      expect(new Set(g.tags).size, g.id).toBe(g.tags.length);
    }
  });

  it('아이콘은 public/games/<id>.svg 이고 파일이 실제로 있다(핫링크 금지, 대소문자까지 일치)', () => {
    for (const g of GAMES) {
      expect(g.iconPath).toBe(`games/${g.id}.svg`);
      expect(ICON_FILES, `${g.iconPath} 없음`).toContain(`${g.id}.svg`);
    }
  });

  it('아이콘 파일 내용이 SVG 다(복사 실패로 저장된 오류 응답 방지)', () => {
    for (const g of GAMES) {
      const svg = readFileSync(PUBLIC_DIR + g.iconPath, 'utf8');
      expect(svg, g.iconPath).toMatch(/^\s*(<\?xml[^>]*>\s*)?<svg[\s>]/);
      expect(svg, g.iconPath).toMatch(/<\/svg>\s*$/);
    }
  });
});

describe('출시(live) 게임', () => {
  it('하나 이상 있다', () => {
    expect(live.length).toBeGreaterThan(0);
  });

  it('liveUrl 은 https 이고 올바른 URL 이다', () => {
    for (const g of live) {
      expect(g.liveUrl, g.id).toMatch(/^https:\/\//);
      expect(() => new URL(g.liveUrl), g.id).not.toThrow();
    }
  });

  it('liveUrl 은 게임끼리 겹치지 않는다(복사·붙여넣기 실수 방지)', () => {
    const urls = live.map((g) => g.liveUrl);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('repoUrl 은 https://github.com/ 레포 주소다', () => {
    for (const g of live) {
      expect(g.repoUrl, g.id).toMatch(/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/);
    }
  });

  it('GitHub Pages 의 liveUrl 경로는 레포 이름과 대소문자까지 같다(Pages 경로는 대소문자 구분)', () => {
    for (const g of live) {
      const url = new URL(g.liveUrl);
      if (!url.host.endsWith('.github.io')) continue;
      expect(url.pathname, g.id).toBe(`/${repoName(g.repoUrl)}/`);
    }
  });

  it('태그가 1개 이상 있다', () => {
    for (const g of live) {
      expect(g.tags.length, g.id).toBeGreaterThan(0);
    }
  });
});

describe('준비 중(soon) 게임', () => {
  it('liveUrl 이 비어 있다 — 플레이 버튼이 비활성인 것과 일치', () => {
    for (const g of soon) {
      expect(g.liveUrl, g.id).toBe('');
    }
  });

  it('repoUrl 은 비어 있거나 https://github.com/ 레포 주소다', () => {
    for (const g of soon) {
      if (g.repoUrl === '') continue;
      expect(g.repoUrl, g.id).toMatch(/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/);
    }
  });
});
