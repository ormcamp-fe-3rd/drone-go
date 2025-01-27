import { defineConfig } from 'orval';

export default defineConfig({
  // 스키마와 API 클라이언트를 설정하는 방법
  api: {
    input: './public/swagger.json', // OpenAPI 스키마 파일 경로
    output: {
      client: 'fetch',  // 기본으로 fetch를 사용하도록 설정
      target: './src/api/generatedClient.ts', // 생성된 클라이언트 코드 위치
    },
  },
});
