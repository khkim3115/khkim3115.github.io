// 테마 결정 규칙 + index.html 페인트 전 스크립트와의 일치 테스트.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { describe, it, expect } from 'vitest';
import { THEME_COLORS, THEME_KEY, resolveTheme, toggledTheme } from './theme';

describe('resolveTheme', () => {
  it('저장된 선택이 있으면 시스템 설정보다 우선한다', () => {
    expect(resolveTheme('dark', true)).toBe('dark');
    expect(resolveTheme('light', false)).toBe('light');
  });
  it('저장값이 없으면 시스템 설정을 따른다', () => {
    expect(resolveTheme(null, true)).toBe('light');
    expect(resolveTheme(null, false)).toBe('dark');
  });
  it('알 수 없는 저장값은 무시한다', () => {
    expect(resolveTheme('sepia', false)).toBe('dark');
    expect(resolveTheme('', true)).toBe('light');
  });
});

describe('toggledTheme', () => {
  it('다크 ↔ 라이트를 오간다', () => {
    expect(toggledTheme('dark')).toBe('light');
    expect(toggledTheme('light')).toBe('dark');
  });
});

describe('index.html 페인트 전 스크립트', () => {
  const html = readFileSync(fileURLToPath(new URL('../../index.html', import.meta.url)), 'utf8');
  // 속성 없는 <script> = 인라인 테마 스크립트(앱 번들은 type="module").
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1] ?? '';

  /** 스텁 브라우저에서 스크립트를 실제로 돌려 심어진 테마·주소창 색을 돌려준다. */
  function run(opts: { stored: string | null; storageThrows: boolean; prefersLight: boolean | 'no-matchMedia' }) {
    const dataset: Record<string, string> = {};
    const meta = { content: THEME_COLORS.dark, setAttribute(name: string, value: string) {
      if (name === 'content') this.content = value;
    } };
    const window =
      opts.prefersLight === 'no-matchMedia'
        ? {}
        : { matchMedia: (q: string) => ({ matches: q === '(prefers-color-scheme: light)' && opts.prefersLight === true }) };
    const localStorage = {
      getItem(key: string) {
        if (opts.storageThrows) throw new Error('SecurityError');
        return key === THEME_KEY ? opts.stored : null;
      },
    };
    const document = {
      documentElement: { dataset },
      querySelector: (sel: string) => (sel === 'meta[name="theme-color"]' ? meta : null),
    };
    runInNewContext(script, { window, localStorage, document });
    return { theme: dataset.theme, meta: meta.content };
  }

  it('인라인 스크립트가 있다', () => {
    expect(script.trim().length).toBeGreaterThan(0);
  });

  it('모든 입력에서 resolveTheme·THEME_COLORS 와 같은 결과를 낸다', () => {
    for (const stored of [null, 'dark', 'light', 'sepia', '']) {
      for (const storageThrows of [false, true]) {
        for (const prefersLight of [true, false, 'no-matchMedia'] as const) {
          const got = run({ stored, storageThrows, prefersLight });
          const expected = resolveTheme(storageThrows ? null : stored, prefersLight === true);
          const label = JSON.stringify({ stored, storageThrows, prefersLight });
          expect(got.theme, label).toBe(expected);
          expect(got.meta, label).toBe(THEME_COLORS[expected]);
        }
      }
    }
  });
});
