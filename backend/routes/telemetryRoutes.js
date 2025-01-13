const express = require('express');
const router = express.Router();

const { Telemetry } = require('../models/telemetryModel');

// 모든 텔레메트리 데이터를 가져오는 API (msgId에 따른 필터링은 클라이언트에서 처리)
router.get('/', async (req, res) => {
  try {
    const telemetries = await Telemetry.find();  // 모든 데이터를 가져옵니다.

    const result = telemetries.map(item => {
      let payloadData = item.payload;

      // msgId에 따라 다른 데이터 처리
      switch (item.msgId) {
        case 30:
          // msgId가 30일 때는 roll, pitch, yaw 관련 데이터를 처리
          payloadData = {
            timeBootMs: item.payload.timeBootMs,
            roll: item.payload.roll,
            pitch: item.payload.pitch,
            yaw: item.payload.yaw,
          };
          break;
        
        case 147:
          // msgId가 147일 때는 battery 관련 데이터 처리
          payloadData = {
            batteryStatus: {
              voltage: item.payload.voltages[0],
              currentBattery: item.payload.currentBattery,
              batteryRemaining: item.payload.batteryRemaining,
            },
            timeRemaining: item.payload.timeRemaining,
            currentConsumed: item.payload.currentConsumed,
            energyConsumed: item.payload.energyConsumed,
          };
          break;

        // 더 많은 msgId 처리 가능
        default:
          payloadData = item.payload;  // 기본 payload 처리
          break;
      }

      return {
        timeBootMs: item.payload.timeBootMs,
        msgId: item.msgId,
        payload: payloadData,
        operationId: item.operation,
        robotId: item.robot,
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error loading telemetry data', error: err.message });
  }
});

module.exports = router;
