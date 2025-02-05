require('dotenv').config();  


const express = require('express');
const cors = require('cors');
const fetch = globalThis.fetch;
const app = express();

const NASA_API_KEY = process.env.NASA_API_KEY;


// 미들웨어 설정
app.use(cors());
app.use(express.json());

const run = require('./db');
run();

app.get('/', (req, res) => {
  res.json({ success: true });
});

// NASA API 요청 엔드포인트 수정
app.get('/weather', async (req, res) => {
  try {
    let { latitude, longitude, date } = req.query;

    if (!latitude || !longitude || !date) {
      return res.status(400).json({ error: "latitude, longitude, date 필수" });
    }

    // 날짜 형식 변환 (YYYY-MM-DD → YYYYMMDD)
    date = date.replace(/-/g, "");

    const nasaUrl = `https://power.larc.nasa.gov/api/temporal/daily/point?latitude=${latitude}&longitude=${longitude}&start=${date}&end=${date}&parameters=T2M,WS10M,WD10M&community=RE&format=JSON&api_key=${NASA_API_KEY}`;

    console.log(`🔗 NASA API 요청: ${nasaUrl}`); // 요청 URL 확인용 로그

    const response = await fetch(nasaUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`NASA API 응답 오류: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);  // NASA 데이터를 그대로 프론트에 전달
  } catch (error) {
    console.error("❌ NASA API 요청 실패:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 추가된 라우트 로딩
app.use(require("./routes"));

// 404 처리 미들웨어
app.use((req, res) => {
  res.status(404).json({ message: '잘못된 경로로 요청되었음' });
});

// 서버 실행
const port = process.env.EXPRESS_PORT || 3000;  // 포트 설정
app.listen(port, () => {
  console.log(`✅ 서버 실행 중`);
});
