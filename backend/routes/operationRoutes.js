const express = require("express");
const router = express.Router();
const { getAllOperations, getOperationsByRobotId } = require('../controllers/operationController');

// 모든 오퍼레이션 가져오기
router.get('/operations', async (req, res) => {
  try {
    const operations = await getAllOperations();
    if (!operations || operations.length === 0) {
      return res.status(404).json({ message: 'No operations found' });
    }
    res.json(operations);
  } catch (error) {
    console.error('Error fetching operations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 특정 로봇에 대한 오퍼레이션 가져오기
router.get('/operations/filter', async (req, res) => {
  try {
    const { robotId } = req.query;
    
    if (!robotId) {
      return res.status(400).json({ message: 'robotId query parameter is required' });
    }

    console.log(`Received robotId from query: ${robotId}`);

    const operations = await getOperationsByRobotId(robotId);

    if (!operations || operations.length === 0) {
      return res.status(404).json({ message: 'No operations found for the specified robot' });
    }

    res.json(operations);
  } catch (error) {
    console.error('Error fetching operations for robot:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;




