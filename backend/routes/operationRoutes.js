const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const mongoose = require('mongoose');

const Operation = require("../models/operationModel")
const { getAllOperations, getOperationsByRobotId } = require('../controllers/operationController');

/**
 * Operation 데이터를 가져옵니다.
 * - 모든 데이터를 가져오거나 쿼리 파라미터를 사용하여 필터링
 * @async
 * @route GET /operations
 * @param {string} [robot] - 쿼리 파라미터로 전달된 로봇 ID (선택 사항)
 * @returns {Promise<void>} - JSON 형식으로 Operation 데이터를 응답
 * @throws {Error} - 서버 에러 발생 시 500 상태 코드와 에러 메시지 반환
 */
router.get('/', async (req, res) => {
  try {
    const { robot } = req.query;

    if (robot) {
      if (!mongoose.Types.ObjectId.isValid(robot)) {
        return res.status(400).json({ message: 'Invalid robot ID format' });
      }

      const filteredOperations = await Operation.find({ robot });
      return res.json(filteredOperations);
    }

    const allOperations = await Operation.find();
    if (!allOperations || allOperations.length === 0) {
      return res.status(404).json({ message: 'No operations found' });
    }
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