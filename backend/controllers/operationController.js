const mongoose = require('mongoose');

const Operation = require('../models/operationModel');
const Robot = require('../models/robotModel');

// 모든 오퍼레이션 가져오기
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

// 특정 로봇에 대한 오퍼레이션 가져오기
const getOperationsByRobotId = async (robotId) => {

    try {
        // robotId가 ObjectId인지 확인
        const query = mongoose.Types.ObjectId.isValid(robotId)
            ? { robot: robotId }
            : { robot: robotId };

        const operations = await Operation.find(query);
        return operations;
    } catch (error) {
        console.error(`Error fetching operations for robot ${robotId}:`, error);
        throw error;
    }
};


module.exports = { getAllOperations, getOperationsByRobotId };