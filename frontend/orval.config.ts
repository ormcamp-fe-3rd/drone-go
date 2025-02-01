import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: './public/swagger.json', // OpenAPI 스펙 파일 경로
    output: {
      client: 'axios',  // fetch 기반 API 클라이언트 생성
      target: './src/api/generatedClient.ts', // 생성될 API 클라이언트 경로
      override: {
        "mutator": {
          "path": "./src/api/customAxios.ts",
          "name": "fetcher"
        },
      },
    },
  },
});