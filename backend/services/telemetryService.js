const mongoose = require('mongoose');
const Telemetry = require('../models/telemetryModel');
const Operation = require('../models/operationModel');
const Robot = require('../models/robotModel');

/**
 * 로봇 이름과 오퍼레이션 이름을 기준으로 Telemetry 데이터를 필터링합니다.
 * @async
 * @function getTelemetriesByRobotAndOperation
 * @param {string} robotName - 로봇의 이름
 * @param {string} operationName - 오퍼레이션의 이름
 * @returns {Promise<Array>} - 필터링된 Telemetry 데이터
 * @throws {Error} - 서버 에러 발생 시 에러 메시지 반환
 */
const getTelemetriesByRobotAndOperation = async (robotName, operationName) => {
    try {
        let robot;
        // robotName이 ObjectId 형식인지 체크하여, ObjectId라면 _id로 검색
        if (mongoose.Types.ObjectId.isValid(robotName)) {
            robot = await Robot.findById(robotName);
        } else {
            robot = await Robot.findOne({ name: robotName });
        }
        if (!robot) {
            throw new Error(`Robot with name ${robotName} not found.`);
        }

        let operation;
        // operationName이 ObjectId인 경우 처리
        if (mongoose.Types.ObjectId.isValid(operationName)) {
            operation = await Operation.findById(operationName);
        } else {
            operation = await Operation.findOne({ name: operationName, robot: robot._id });
        }
        // 로봇과 오퍼레이션을 기준으로 Telemetry 데이터를 필터링
        const telemetries = await Telemetry.find({ robot: robot._id, operation: operation._id });

        return telemetries;
    } catch (error) {
        console.error('Error in getTelemetriesByRobotAndOperation:', error);
        throw new Error(`Error fetching telemetries for robot ${robotName} and operation ${operationName}: ${error.message}`);
    }
};

module.exports = { getTelemetriesByRobotAndOperation };
