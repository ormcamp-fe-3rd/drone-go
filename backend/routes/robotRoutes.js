const express = require("express")
const router = express.Router()

const Robot = require("../models/robotModel")

router.get('/', async (req, res) => {
  try {
    const robots = await Robot.find() // 모든 로봇 가져오기
    if (!robots || robots.length === 0) {
      return res.status(404).json({ message: 'No robots found' })
    }
    res.json(robots)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router