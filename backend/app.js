const express = require('express')
const app = express()

const run = require('./db')
run()

app.use(express.json())

app.get('/', (req, res, next) => {
  res.json({ success: true })
})

app.use(require("./routes"))

app.use((req, res) => {
  res.json({ message: '잘못된 경로로 요청되었음' })
})

app.listen(3000, () => {
  console.log('server listening on port 3000')
})
