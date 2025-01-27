const mongoose = require('mongoose');
const Telemetry = require('../models/telemetryModel');
const Robot = require('../models/robotModel');
const Operation = require('../models/operationModel');

/**
 * 주어진 robot ID와 operation ID에 해당하는 Telemetry 데이터를 가져옵니다.
 * @async
 * @function getTelemetriesByRobotAndOperation
 * @param {object} req - Express 요청 객체
 * @param {object} res - Express 응답 객체
 * @returns {Promise<void>} - 성공 시 Telemetry 데이터를 JSON 형식으로 응답
 * @throws {Error} - 서버 에러 발생 시 500 상태 코드와 에러 메시지 반환
 */
const getTelemetriesByRobotAndOperation = async (req, res) => {
    try {
        const { robotId, operationId, fields } = req.query;

        // 필수 쿼리 파라미터 확인
        if (!robotId || !operationId) {
            return res.status(400).json({ message: 'Both robotId and operationId are required' });
        }

        // ObjectId 유효성 검사
        if (!mongoose.Types.ObjectId.isValid(robotId)) {
            return res.status(400).json({ message: 'Invalid robotId format' });
        }
        if (!mongoose.Types.ObjectId.isValid(operationId)) {
            return res.status(400).json({ message: 'Invalid operationId format' });
        }

        // 로봇과 오퍼레이션 객체를 DB에서 찾기
        const robot = await Robot.findById(robotId);
        if (!robot) {
            return res.status(404).json({ message: `Robot with ID ${robotId} not found` });
        }

        const operation = await Operation.findById(operationId);
        if (!operation) {
            return res.status(404).json({ message: `Operation with ID ${operationId} not found` });
        }

        // 로봇과 오퍼레이션 ID를 기준으로 Telemetry 데이터를 찾기
        const telemetries = await Telemetry.find({ robot: robotId, operation: operationId });

        if (telemetries.length === 0) {
            return res.status(404).json({ message: 'No matching telemetries found' });
        }

        // 요청한 필드만 반환 (필드 필터링)
        if (fields) {
            const fieldsArray = fields.split(',');
            const filteredTelemetries = telemetries.map(telemetry => {
                const filteredTelemetry = {};
                fieldsArray.forEach(field => {
                    if (telemetry[field]) {
                        filteredTelemetry[field] = telemetry[field];
                    }
                });
                return filteredTelemetry;
            });
            return res.json(filteredTelemetries); // 필드 필터링 후 응답
        }

        // 필드 필터링이 없으면 전체 데이터를 반환
        return res.json(telemetries); // 전체 데이터 응답
    } catch (error) {
        console.error('Error in getTelemetriesByRobotAndOperation:', error);
        // 에러 발생 시 응답 전에 이미 응답이 갔는지 확인
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    }
};

module.exports = { getTelemetriesByRobotAndOperation };


