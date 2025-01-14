const express = require("express")
const router = express.Router()

const Operation = require("../models/operationModel")
const { getAllOperations, getOperationsByRobotId } = require('../controllers/operationController');

/**
 * 모든 Operation 데이터를 가져옵니다.
 * @async
 * @route GET /operations
 * @returns {Promise<void>} - 성공 시 모든 Operation 데이터를 JSON 형식으로 응답
 * @throws {Error} - 서버 에러 발생 시 500 상태 코드와 에러 메시지 반환
 */
router.get('/', async (req, res) => {
  try {
    const operations = await Operation.find() // 모든 로봇 가져오기
    if (!operations || operations.length === 0) {
      return res.status(404).json({ message: 'No robots found' })
    }
    res.json(operations)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

/**
 * 특정 로봇에 대한 Operation 데이터를 필터링하여 가져옵니다.
 * @async
 * @route GET /operations/filter
 * @param {string} robot - 쿼리 파라미터로 전달된 로봇 ID
 * @returns {Promise<void>} - 필터링된 Operation 데이터를 JSON 형식으로 응답
 * @throws {Error} - 서버 에러 발생 시 500 상태 코드와 에러 메시지 반환
 * @throws {Error} - 유효하지 않은 로봇 ID 형식일 경우 400 상태 코드와 오류 메시지 반환
 */
router.get('/filter', async (req, res) => {
  try {
    const { robot } = req.query;

    if (robot) {
      if (!mongoose.Types.ObjectId.isValid(robot)) {
        return res.status(400).json({ message: 'Invalid robot ID format' });
      }
      const filteredOperations = await Operation.find({
        robot: robot
      });
      return res.json(filteredOperations);
    }

    const allOperations = await Operation.find();
    res.json(allOperations);

  } catch (error) {
    console.error('Error in operations route:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router