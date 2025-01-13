const express = require("express")
const router = express.Router()

const Telemetry = require("../models/telemetryModel")

router.get('/telemetries', async (req, res) => {
  try {
    const telemetries = await Telemetry.find(); // 모든 데이터를 가져오기
    console.log('Telemetries:', telemetries);
    if (!telemetries || telemetries.length === 0) {
      return res.status(404).json({ message: 'No telemetries found' });
    }
    res.json(telemetries);
  } catch (error) {
    console.error('Error loading telemetry data:', error);  // 오류 로그
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router
