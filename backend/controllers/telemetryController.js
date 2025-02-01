const { getTelemetriesByRobotAndOperation } = require('../services/telemetryService');

/**
 * 특정 로봇과 오퍼레이션에 대한 Telemetry 데이터를 반환하는 컨트롤러
 * @async
 * @function getTelemetryData
 * @param {object} req - Express 요청 객체
 * @param {object} res - Express 응답 객체
 * @returns {Promise<void>} JSON 형식의 Telemetry 데이터 반환
 */
const getTelemetryData = async (req, res) => {
    try {
        const { robot, operation, fields } = req.query;

        if (!robot || !operation) {
            return res.status(400).json({ message: 'Both robotId and operation are required' });
        }

        const telemetries = await getTelemetriesByRobotAndOperation(robot, operation, fields);

        if (!telemetries.length) {
            return res.status(404).json({ message: 'No matching telemetries found' });
        }

        return res.json(telemetries);
    } catch (error) {
        console.error('Error fetching telemetry data:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = { getTelemetryData };