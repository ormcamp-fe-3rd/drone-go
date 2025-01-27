const express = require("express");
const router = express.Router();
const { getTelemetriesByRobotAndOperation } = require('../controllers/telemetryController');

/**
 * Telemetry 데이터를 가져옵니다.
 * - robot과 operation을 기반으로 필터링
 * @route GET /telemetries
 * @param {string} robotId - 쿼리 파라미터로 전달된 로봇 ID
 * @param {string} operationId - 쿼리 파라미터로 전달된 operation ID
 * @param {string} fields - 필드 필터링을 위한 쿼리 파라미터 (예: lat, lon, alt)
 * @returns {Promise<void>} - JSON 형식으로 Telemetries 데이터를 응답
 * @throws {Error} - 서버 에러 발생 시 500 상태 코드와 에러 메시지 반환
 */
router.get('/', async (req, res) => {
    const { robotId, operationId, fields } = req.query;

    // 필수 쿼리 파라미터 확인
    if (!robotId || !operationId) {
        return res.status(400).json({ message: 'Both robotId and operationId are required' });
    }

    try {
        // getTelemetriesByRobotAndOperation 함수 호출
        const telemetries = await getTelemetriesByRobotAndOperation(req, res);

        // 데이터가 없으면 404 응답
        if (telemetries && telemetries.length === 0) {
            return res.status(404).json({ message: 'No matching telemetries found' });
        }

        // 데이터 반환
        res.json(telemetries);
    } catch (error) {
        console.error('Error in getTelemetriesByRobotAndOperation:', error);
        // 응답을 보내기 전에 에러가 처리됐는지 확인
        if (!res.headersSent) {
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    }
});

module.exports = router;

