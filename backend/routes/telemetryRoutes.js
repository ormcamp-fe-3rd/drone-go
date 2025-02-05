const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()

const Telemetry = require("../models/telemetryModel")
const { getTelemetriesByRobotAndOperation } = require('../services/telemetryService');
const authorizer = require("../middleware/authorizer");

const { getDistinctDates } = require('../controllers/telemetryController');
const MSG_ID = {
    GPS_RAW_INT: 24, //연결된 위성수
    ATTITUDE: 30, //드론 자세 정보(roll, pitch, yaw)
    GLOBAL_POSITION: 33, //위도, 경도, 고도
    VFR_HUD: 74, //헤딩, 속도
    BATTERY_STATUS: 147, //배터리 온도, 전압, 잔량
    STATUSTEXT: 253 //텍스트 상태 메세지
};
/**
 * Telemetry 데이터를 가져옵니다.
 * - robot과 operation을 기반으로 필터링
 * @async
 * @route GET /telemetries
 * @param {string} [robot] - 쿼리 파라미터로 전달된 로봇 ID
 * @param {string} [operation] - 쿼리 파라미터로 전달된 operation ID
 * @returns {Promise<void>} - JSON 형식으로 Telemetries 데이터를 응답
 * @throws {Error} - 서버 에러 발생 시 500 상태 코드와 에러 메시지 반환
 */
router.get('/', authorizer, async (req, res) => {
    try {
        const { robot, operation } = req.query;
        // 로봇과 operation이 모두 제공되지 않으면 400 에러
        if (!robot || !operation) {
            return res.status(400).json({ message: 'Both robot and operation must be provided' });
        }

        // 쿼리 파라미터로 받은 robot ID와 operation ID가 유효한지 확인
        if (robot && !mongoose.Types.ObjectId.isValid(robot)) {
            return res.status(400).json({ message: 'Invalid robot ID format' });
        }

        if (operation && !mongoose.Types.ObjectId.isValid(operation)) {
            return res.status(400).json({ message: 'Invalid operation ID format' });
        }

        const telemetries = await getTelemetriesByRobotAndOperation(robot, operation);

        if (!telemetries || telemetries.length === 0) {
            return res.status(404).json({ message: 'No matching telemetries found' });
        }

        // 각 데이터를 배열 형태로 응답
        const batteryData = telemetries.data.filter(item => item.msgId === MSG_ID.BATTERY_STATUS);
        const textData = telemetries.data.filter(item => item.msgId === MSG_ID.STATUSTEXT);
        const satellitesData = telemetries.data.filter(item => item.msgId === MSG_ID.GPS_RAW_INT);
        const altAndSpeedData = telemetries.data.filter(item => item.msgId === MSG_ID.VFR_HUD);

        // 각 데이터를 배열 형태로 응답
        res.json({
            batteryData,
            textData,
            satellitesData,
            altAndSpeedData,
        });
    } catch (error) {
        console.error('Error in telemetries route:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
});

// distinctDates 데이터 가져오기
router.get('/distinctDates', getDistinctDates);

module.exports = router
