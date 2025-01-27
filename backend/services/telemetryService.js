const mongoose = require('mongoose');
const Telemetry = require('../models/telemetryModel');
const Operation = require('../models/operationModel');
const Robot = require('../models/robotModel');

/**
 * 로봇 ID와 오퍼레이션 ID를 기준으로 Telemetry 데이터를 필터링합니다.
 * @async
 * @function getTelemetriesByRobotAndOperation
 * @param {object} req - Express 요청 객체
 * @param {object} res - Express 응답 객체
 * @returns {Promise<void>} - Telemetries 데이터를 JSON 형식으로 응답
 */
const getTelemetriesByRobotAndOperation = async (req, res) => {
    try {
        const { robotId, operationId, fields } = req.query;

        // robotId와 operationId가 없으면 400 오류를 반환
        if (!robotId || !operationId) {
            return res.status(400).json({ message: 'robotId and operationId are required' });
        }

        // robotId가 ObjectId 형식인지 확인하고 해당 로봇 객체를 찾기
        const robot = await Robot.findById(robotId);
        if (!robot) {
            return res.status(404).json({ message: `Robot with ID ${robotId} not found.` });
        }

        // operationId가 ObjectId 형식인지 확인하고 해당 오퍼레이션 객체를 찾기
        const operation = await Operation.findById(operationId);
        if (!operation) {
            return res.status(404).json({ message: `Operation with ID ${operationId} not found.` });
        }

        // 로봇과 오퍼레이션을 기준으로 Telemetry 데이터를 필터링
        const telemetries = await Telemetry.find({ robot: robot._id, operation: operation._id });

        // 텔레메트리가 없으면 404 오류 반환
        if (telemetries.length === 0) {
            return res.status(404).json({ message: 'No matching telemetries found.' });
        }

        // 필드 필터링 (fields가 제공되면 해당 필드만 반환)
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
            return res.json(filteredTelemetries);
        }

        // 필터링된 데이터 반환
        return res.json(telemetries);
    } catch (error) {
        console.error('Error in getTelemetriesByRobotAndOperation:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = { getTelemetriesByRobotAndOperation };
