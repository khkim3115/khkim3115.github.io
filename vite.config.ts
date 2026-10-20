import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: 유저 사이트(https://khkim3115.github.io/) 루트에 게시하므로 '/'.
// 서비스 워커·PWA 플러그인은 넣지 않는다 — 루트 스코프 SW 는 하위 경로 게임(/YachtDice_Helper/ 등)의
// PWA 캐싱과 충돌할 수 있다.
export default defineConfig({
  base: '/',
  plugins: [react()],
});
