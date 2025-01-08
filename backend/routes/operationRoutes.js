const express = require("express")
const router = express.Router()

const Operation = require("../models/operationModel")

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

module.exports = router