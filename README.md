# 🎲 보드게임 모음

khkim3115 가 만든 보드게임 웹 앱을 한곳에서 고르는 허브 페이지입니다.

🔗 **<https://khkim3115.github.io/>**

게임 목록은 [`src/data/games.ts`](src/data/games.ts) 한 곳에서만 관리합니다(이 README 에는 목록을 따로 적지 않습니다).

GitHub 유저 사이트라 루트(`/`)가 이 허브이고, 각 게임은 자기 레포의 프로젝트 사이트(`/YachtDice_Helper/` 등)로
**따로 배포**됩니다. 허브가 생겨도 기존 게임 링크와 설치된 PWA 는 그대로입니다.

React 19 + Vite + TypeScript. 백엔드 없는 정적 페이지이며 GitHub Pages 로 배포합니다.

## 실행

```bash
npm install
npm run dev        # http://localhost:5173
```

빌드 / 미리보기 / 테스트:

```bash
npm run build      # 타입체크 + vite build → dist/
npm run preview    # 빌드 결과를 로컬에서 확인
npm test           # vitest — 게임 목록 무결성 + 테마 규칙
npm run typecheck
```

## ➕ 새 게임 추가

**`src/data/games.ts` 의 `GAMES` 에 항목 한 줄 + 아이콘 파일 1개**면 끝입니다. 카드·링크·태그 칩은 자동으로 그려집니다.

1. 게임 레포의 아이콘을 `public/games/<id>.svg` 로 **복사**합니다(라이브 사이트 핫링크 금지).
2. `GAMES` 배열의 원하는 위치(= 카드 순서)에 항목을 추가합니다.

   ```ts
   {
     id: 'my-game',                                   // kebab-case, 아이콘 파일명과 같게
     name: '내 게임',
     summary: '한 줄 소개',
     tags: ['솔로 AI', '온라인 멀티'],                 // GAME_TAGS 에 있는 값만
     liveUrl: 'https://khkim3115.github.io/MyGame/',  // https 필수
     repoUrl: 'https://github.com/khkim3115/MyGame',
     iconPath: 'games/my-game.svg',
     status: 'live',                                  // 아직이면 'soon' + liveUrl: ''
   },
   ```

3. 새 태그가 필요하면 같은 파일의 `GAME_TAGS` 에 먼저 추가합니다.
4. `npm test` — id·이름·URL 중복, http 링크, Pages 경로와 레포 이름의 대소문자 불일치(Pages 는 구분함),
   없는 태그, 아이콘 누락(파일명 대소문자 포함)·SVG 가 아닌 아이콘, 잘못된 status 를 잡아 줍니다.

> **준비 중** 게임은 `status: 'soon'`, `liveUrl: ''` 로 넣으면 플레이 버튼이 비활성화된 카드로 보입니다.
> 레포가 아직 없으면 `repoUrl: ''`(코드 링크 숨김), 출시하면 URL 을 채우고 `status: 'live'` 로 바꿉니다.
> 비공개 레포는 넣지 않습니다.

## 제약

- **서비스 워커·PWA 를 등록하지 않습니다.** 루트(`/`) 스코프 서비스 워커는 하위 경로 게임들의 PWA 캐싱과
  충돌할 수 있습니다. `vite-plugin-pwa`·manifest 도 넣지 않습니다.
- **백엔드 없음** — Supabase·로그인·공용 상태를 쓰지 않는, 링크만 모으는 정적 페이지입니다.
- **같은 출처 공유** — 게임들과 `khkim3115.github.io` 출처(localStorage)를 공유하므로 허브의 키는 `hub_` 접두어를
  씁니다(현재 `hub_theme` 하나). 게임들은 `nmm_`·`yd_` 접두어를 씁니다.
- Vite `base` 는 유저 사이트 루트에 맞춘 `'/'` 입니다.

## 테마

헤더 우측 **🌙/☀️** 로 다크/라이트를 전환합니다. 직접 고른 값은 브라우저에 저장되고(`hub_theme`),
고르기 전에는 시스템 설정을 따릅니다. 깜빡임을 막으려고 `index.html` 의 인라인 스크립트가 페인트 전에
테마를 적용하며, 규칙은 [`src/lib/theme.ts`](src/lib/theme.ts) 와 같습니다. `theme.test.ts` 가 그 스크립트를
`node:vm` 으로 실제 실행해 같은 결과를 내는지 검사하므로, 한쪽만 고치면 테스트가 실패합니다.

색은 나인 멘스 모리스 팔레트를 그대로 쓰되, 대비(WCAG AA)가 모자란 곳만 조정했습니다 — 다크의 primary 버튼
글자색(`--on-accent`), 라이트의 `--hint`, 라이트 primary 버튼 hover.

## 배포

`main` 에 머지되면 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) 이 `npm test` → `npm run build`
후 `dist/` 를 GitHub Pages 로 게시합니다.
레포 **Settings → Pages → Source** 는 **GitHub Actions** 로 설정돼 있어야 합니다(최초 1회, 수동).

> 유저 사이트 레포(`<user>.github.io`)는 처음 push 할 때 GitHub 가 Pages 를 **브랜치 배포(main / root)** 로 자동
> 활성화합니다. 그 상태에서는 빌드 결과(`dist/`)가 아니라 소스 `index.html` 이 그대로 게시돼 빈 화면이 나오므로,
> Source 를 GitHub Actions 로 바꾼 뒤 워크플로를 다시 실행해야 합니다(Actions 탭 → Deploy to GitHub Pages → Run workflow).

## 구조

```
src/
  data/
    games.ts        게임 목록 단일 진실원본 (순수 데이터)
    games.test.ts   목록 무결성 테스트
  lib/
    theme.ts        테마 결정 규칙 (순수 함수)
    theme.test.ts
  ui/
    App.tsx         페이지 레이아웃
    Header.tsx      제목 + 테마 전환
    GameGrid.tsx    카드 그리드 (모바일 1열 → 640px 이상 2열)
    GameCard.tsx    아이콘 · 이름 · 소개 · 태그 칩 · 플레이 / 코드
    Footer.tsx      GitHub 링크
    useTheme.ts     테마 상태 훅
  index.css         전역 스타일 (나인 멘스 모리스 팔레트 + 대비 보정)
public/
  favicon.svg       허브 아이콘
  games/<id>.svg    게임 아이콘 (각 게임 레포에서 복사)
```

기여 규약(브랜치·커밋·PR)은 [`CONTRIBUTING.md`](CONTRIBUTING.md) 를 참고하세요.
