import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
   test: {
      // Node, not jsdom: everything under test here is pure logic or data. The
      // parts that genuinely need a browser — MindAR teardown, WebXR entry —
      // need a real device, and a jsdom stub of them would only prove the stub
      // works. Those stay device-verified.
      environment: 'node',
      include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.mjs'],
   },
   resolve: {
      alias: {
         '@': path.resolve(__dirname, './src'),
      },
   },
});
