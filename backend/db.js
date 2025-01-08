require('dotenv').config()
const mongoose = require('mongoose')

async function run() {
  try {
    await mongoose.connect(process.env.DB_URI, {
      dbName: 'flight_review', // 데이터베이스 이름 지정
    })
    console.log('Successfully connected to MongoDB.')
  } catch (error) {
    console.error('MongoDB connection error:', error)
  }
}

module.exports = run
