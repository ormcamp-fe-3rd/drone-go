const mongoose = require('mongoose');
const Telemetry = require('../models/telemetryModel');
const Operation = require('../models/operationModel');
const Robot = require('../models/robotModel');

/**
 * 로봇 ID와 오퍼레이션 ID를 기준으로 Telemetry 데이터를 필터링합니다.
 * @async
 * @function getTelemetriesByRobotAndOperation
 * @param {object} req
 * @param {object} res
 * @returns {Promise<void>}
 */
const getTelemetriesByRobotAndOperation = async (req, res) => {
    try {
        const { robotId, operationId, fields } = req.query;

        if (!robotId || !operationId) {
            return res.status(400).json({ message: 'robotId and operationId are required' });
        }

        const robot = await Robot.findById(robotId);
        if (!robot) {
            return res.status(404).json({ message: `Robot with ID ${robotId} not found.` });
        }

        const operation = await Operation.findById(operationId);
        if (!operation) {
            return res.status(404).json({ message: `Operation with ID ${operationId} not found.` });
        }

        const telemetries = await Telemetry.find({ robot: robot._id, operation: operation._id });

        if (telemetries.length === 0) {
            return res.status(404).json({ message: 'No matching telemetries found.' });
        }

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

        return res.json(telemetries);
    } catch (error) {
        console.error('Error in getTelemetriesByRobotAndOperation:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = { getTelemetriesByRobotAndOperation };
