# 기여 가이드 — 브랜치 · 커밋 · PR 규약

허브는 `main` 푸시마다 GitHub Pages 로 **자동 배포**된다(연속 배포). 그래서 `main` 은 항상
"배포 가능" 상태여야 하고, 모든 변경은 짧은 브랜치 → PR → squash merge 로만 들어간다(트렁크 기반).

## 브랜치 규약

- 한 이슈 = 한 브랜치, 짧게 유지. 항상 `main` 에서 분기.
- 이름: `<type>/<이슈번호>-<짧은-설명>`
  - 예) `feat/2-games-data`, `fix/12-card-overflow`, `chore/4-pages-deploy`, `docs/5-readme`
- `type` 은 커밋 `type` 과 동일: `feat` / `fix` / `chore` / `docs` / `refactor` / `style` / `test`
- `main` 에 직접 커밋 금지 — 자동배포라 항상 "배포 가능" 상태를 유지한다.

## 커밋 규약 (Conventional Commits, 한국어)

- 형식: `<type>(<scope>): <한국어 설명> (#이슈)`
  - 예) `feat(data): 게임 목록 단일 진실원본 추가 (#2)`
- `scope` 예: `ui`, `data`, `web`, `deploy`, `deps` …

## PR & 머지

- 브랜치 → PR(대상 `main`). 본문에 `Closes #이슈` 를 넣으면 머지 시 이슈가 자동으로 닫힌다.
- **Squash merge** 사용 → `main` 히스토리 = "이슈 1개 = 커밋 1줄 `(#PR)`".
- 머지되면 곧바로 자동 배포된다.

## PR 전 체크

- `npm run typecheck`
- `npm test`
- `npm run build`
- 데이터·로직 변경은 **테스트 먼저**(TDD 권장). 순수 로직은 `src/**/*.test.ts`(node 환경).

## 지켜야 할 제약

- **서비스 워커·PWA 를 등록하지 않는다.** 루트(`/`) 스코프 서비스 워커는 하위 경로 게임
  (`/YachtDice_Helper/` 등)의 PWA 캐싱과 충돌할 수 있다.
- 백엔드(Supabase·로그인·공용 상태)를 쓰지 않는다. 링크만 모으는 정적 페이지다.
- 게임 아이콘은 `public/games/<id>.svg` 로 **복사해서** 쓴다(라이브 사이트 핫링크 금지).
- 비공개 레포는 목록에 넣지 않는다.
- localStorage 키는 `hub_` 접두어를 쓴다 — 같은 출처(`khkim3115.github.io`)의 게임들과 저장소를 공유한다.
