const express = require('express')
const cors = require('cors');  // CORS 패키지 가져오기
const app = express()
const { swaggerUi, swaggerDocs, swaggerSpec } = require('./swagger'); // swagger.js 불러오기

app.use(cors());  // CORS 미들웨어 추가

const run = require('./db')
run()

// Swagger UI 연결 (API 문서화)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// /swagger.json 경로로 Swagger JSON을 반환
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec); // swaggerSpec을 /swagger.json 경로에서 반환
});

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
  res.json({ success: true })
})

app.use(require("./routes"))

app.use((req, res) => {
  res.json({ message: '잘못된 경로로 요청되었음' })
})

app.listen(3000, () => {
  console.log('server listening on port 3000')
  console.log('Swagger docs available at http://localhost:3000/api-docs')
})