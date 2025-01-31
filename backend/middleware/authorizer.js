const jwt = require('jsonwebtoken')

const authorizer = (req, res, next) => {
  // Header의 authentication 필드 접근
  const authorization = req.headers['authorization']
  if (!authorization) {
    // 토큰이 없으면 실패
    return res.status(401).json({error: "Missing authorization token"})
  }

  // 예) Bearer eyJhbGciOiJIUzI1N...
  const [, token] = authorization.split(' ')
  try{
    const isVerified = jwt.verify(token, 'my-secret-key')
    next()
  }catch (error){
    // 토큰 검증에 실패
    return res.status(401).json({error: "Invalid authorization token"})
  }
}

module.exports = authorizer
