const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

router.post('/login', async (req, res, next) => {
  const { id, password } = req.body
  // 테스트 아이디 로그인 로직
  if (id === 'test' && password === '1234') {
    // 토큰 발급
    const token = jwt.sign({ id }, 'my-secret-key', { expiresIn: '24h' })
    res.json(token)
  } else {
    next(Error('Invalid id or password'))
  }
})

module.exports = router