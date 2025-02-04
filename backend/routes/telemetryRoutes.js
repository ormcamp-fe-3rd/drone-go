const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()

const Telemetry = require("../models/telemetryModel")
const { getTelemetriesByRobotAndOperation } = require('../services/telemetryService');
const authorizer = require("../middleware/authorizer");

const { getDistinctDates } = require('../controllers/telemetryController');

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

        res.json(telemetries);
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
