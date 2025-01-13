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
    let objectId;
    if (mongoose.Types.ObjectId.isValid(robotId)) {
      objectId = mongoose.Types.ObjectId(robotId);  // robotId를 ObjectId로 변환
    } else {
      // ObjectId로 변환이 안 되면, robots 컬렉션에서 이름으로 찾아서 비교
      const robot = await Robot.findOne({ name: robotId });
      if (!robot) {
        throw new Error(`Robot with name ${robotId} not found`);
      }
      objectId = robot._id;
    }

    // objectId를 기준으로 operations 찾기
    const operations = await Operation.find({ robot: objectId });
    return operations;
  } catch (error) {
    console.error(`Error fetching operations for robot ${robotId}:`, error); // 오류 로그 추가
    throw new Error(`Error fetching operations for robot ${robotId}: ${error.message}`);
  }
};

module.exports = { getAllOperations, getOperationsByRobotId };



