const express = require('express')
const cors = require('cors');  // CORS 패키지 가져오기
const app = express()
const cors = require('cors');  // CORS 미들웨어 불러오기

app.use(cors());  // CORS 미들웨어 추가

const run = require('./db')
run()

// 모델 및 라우터 불러오기
const operationRoutes = require('./routes/operationRoutes');
const robotRoutes = require('./routes/robotRoutes');
const telemetryRoutes = require('./routes/telemetryRoutes');

// 특정 도메인만 허용 (배포 환경에서는 보안을 위해 추천)
app.use(cors({
  origin: 'http://localhost:5173'  // 프론트엔드 도메인만 허용
}));

app.use(express.json())

app.get('/', (req, res, next) => {
  res.json({ success: true })
})

// 라우터 연결
app.use('/api', operationRoutes);
app.use('/api', robotRoutes);
app.use('/api', telemetryRoutes);

app.use((req, res) => {
  res.json({ message: '잘못된 경로로 요청되었음' })
})

app.listen(3000, () => {
  console.log('server listening on port 3000')
})
