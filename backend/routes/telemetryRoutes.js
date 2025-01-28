const express = require("express");
const router = express.Router();
const { getTelemetriesByRobotAndOperation } = require('../controllers/telemetryController');

/**
 * Telemetry 데이터를 가져옵니다.
 * - robot과 operation을 기반으로 필터링
 * @route GET /telemetries
 * @param {string} robotId 
 * @param {string} operationId
 * @param {string} fields
 * @returns {Promise<void>}
 * @throws {Error}
 */
router.get('/', async (req, res) => {
    const { robotId, operationId, fields } = req.query;

    if (!robotId || !operationId) {
        return res.status(400).json({ message: 'Both robotId and operationId are required' });
    }

    try {
       
        const telemetries = await getTelemetriesByRobotAndOperation(req, res);

        if (telemetries && telemetries.length === 0) {
            return res.status(404).json({ message: 'No matching telemetries found' });
        }

        res.json(telemetries);
    } catch (error) {
        console.error('Error in getTelemetriesByRobotAndOperation:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    }
});

module.exports = router;

