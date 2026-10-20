import { defineConfig } from 'vitest/config';

// 테스트는 순수 TS 로직 대상이라 플러그인 불필요(node 환경).
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // 첫 테스트는 #2(games.ts 검증)에서 들어온다. 그때 이 옵션을 지운다.
    passWithNoTests: true,
  },
});
