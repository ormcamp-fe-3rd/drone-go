const express = require("express");
const router = express.Router();
const { getAllOperations, getOperationsByRobotId } = require('../controllers/operationController');

const Operation = require("../models/operationModel")

router.get('/', async (req, res) => {
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
})

module.exports = router