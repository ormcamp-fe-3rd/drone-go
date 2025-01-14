const Operation = require('../models/Operation');
const Robot = require('../models/Robot');

// 로봇 이름을 기준으로 오퍼레이션을 필터링
const getOperationsByRobotId = async (robotName) => {
    try {
        // robots 컬렉션에서 robotName에 해당하는 robot 찾기
        const robot = await Robot.findOne({ name: robotName });

        if (!robot) {
            throw new Error(`Robot with name ${robotName} not found.`);
        }

        // 찾은 robot의 _id를 사용하여 operations 컬렉션에서 필터링
        const operations = await Operation.find({ robot: robot._id });

        return operations;
    } catch (error) {
        console.error(`Error in getOperationsByRobotId for robot ${robotName}:`, error);
        throw new Error(`Error fetching operations for robot ${robotName}: ${error.message}`);
    }
};

module.exports = { getOperationsByRobotId };