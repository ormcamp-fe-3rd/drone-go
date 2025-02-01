const express = require('express');
const cors = require('cors');
const app = express();
const { swaggerUi, swaggerDocs } = require('./swagger');

app.use(cors());

const run = require('./db');
run();

// Swagger UI 연결 (API 문서화)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// /swagger.json 경로로 OpenAPI 명세 반환
app.use('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(swaggerDocs);
});

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ success: true });
});

app.use(require("./routes"));

app.use((req, res) => {
  res.status(404).json({ message: '잘못된 경로로 요청되었음' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
  console.log(`📄 Swagger docs available at http://localhost:${PORT}/api-docs`);
  console.log(`📄 Swagger JSON available at http://localhost:${PORT}/swagger.json`);
});
