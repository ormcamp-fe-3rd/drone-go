const express = require("express")
const router = express.Router()

const Operation = require("../models/operationModel")
const { getAllOperations, getOperationsByRobotId } = require('../controllers/operationController');


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

// // 특정 로봇에 대한 오퍼레이션 가져오기
router.get('/filter', async (req, res) => {
  try {
    const { robot } = req.query;

    // If robot ID is provided, filter by it
    if (robot) {
      const filteredOperations = await Operation.find({
        robot: robot  // Exact match with the robot ID
      });
      return res.json(filteredOperations);
    }

    // If no robot ID provided, return all operations
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