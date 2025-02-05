require('dotenv').config()
const mongoose = require('mongoose')

async function run() {
  try {
    await mongoose.connect(process.env.DB_URI)
    console.log('Successfully connected to MongoDB.')
  } catch (error) {
    console.error('MongoDB connection error:', error)
  }
}

module.exports = run
