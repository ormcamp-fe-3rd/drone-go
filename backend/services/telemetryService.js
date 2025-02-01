const mongoose = require('mongoose');
const Telemetry = require('../models/telemetryModel');
const Robot = require('../models/robotModel');
const Operation = require('../models/operationModel');

/**
 * 특정 로봇과 오퍼레이션에 대한 Telemetry 데이터를 가져오는 서비스 함수
 * @param {string} robot - 로봇봇
 * @param {string} operation - 오퍼레이션
 * @param {string} [fields] - 선택적으로 가져올 필드 목록 (쉼표로 구분된 문자열)
 * @returns {Promise<Array>} 필터링된 Telemetry 데이터 배열
 * @throws {Error} 유효하지 않은 ID 또는 데이터가 존재하지 않는 경우
 */
const getTelemetriesByRobotAndOperation = async (robot, operation, fields) => {

    if (!mongoose.Types.Object.isValid(robot) || !mongoose.Types.ObjectId.isValid(operation)) {
        throw new Error('Invalid robot or operation format');
    }

    const robot = await Robot.findById(robot);
    if (!robot) throw new Error(`Robot with ID ${robot} not found`);

    const operation = await Operation.findById(operation);
    if (!operation) throw new Error(`Operation with ID ${operation} not found`);

    let telemetries = await Telemetry.find({ robot: robot, operation: operation });

    if (fields) {
        const fieldsArray = fields.split(',');
        telemetries = telemetries.map(telemetry => {
            const filteredTelemetry = {};
            fieldsArray.forEach(field => {
                if (Object.hasOwnProperty.call(telemetry, field)) {
                    filteredTelemetry[field] = telemetry[field];
                }
            });
            return filteredTelemetry;
        });
    }

    return telemetries;
};

module.exports = { getTelemetriesByRobotAndOperation };