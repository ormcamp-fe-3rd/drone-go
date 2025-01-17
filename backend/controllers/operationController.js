const mongoose = require('mongoose');
const Operation = require('../models/operationModel');
const Robot = require('../models/robotModel');


/**
 * 모든 Operation 데이터를 가져옵니다.
 * @async
 * @function getAllOperations
 * @param {object} req - Express 요청 객체
 * @param {object} res - Express 응답 객체
 * @returns {Promise<void>} - 성공 시 모든 Operation 데이터를 JSON 형식으로 응답
 * @throws {Error} - 서버 에러 발생 시 500 상태 코드와 에러 메시지 반환
 */
const getAllOperations = async (req, res) => {
    try {
        const operations = await Operation.find();
        if (!operations || operations.length === 0) {
            return res.status(404).json({ message: 'No operations found' });
        }
        res.json(operations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * 특정 로봇에 대한 Operation 데이터를 가져옵니다.
 * @async
 * @function getOperationsByRobotId
 * @param {string} robotId - 로봇의 ID
 * @returns {Promise<Array>} - 로봇 ID에 해당하는 Operation 배열 반환
 * @throws {Error} - 로봇 데이터 가져오기 실패 시 에러 발생
 */
const getOperationsByRobotId = async (robotId) => {
    try {
        // robotId가 ObjectId인지 확인
        const query = mongoose.Types.ObjectId.isValid(robotId)
            ? { robot: robotId }
            : { robot: robotId }; // ObjectId가 유효하면 해당 robotId로 검색

        const operations = await Operation.find(query);
        return operations;
    } catch (error) {
        console.error(`Error fetching operations for robot ${robotId}:`, error);
        throw error;
    }
};


module.exports = { getAllOperations, getOperationsByRobotId };
