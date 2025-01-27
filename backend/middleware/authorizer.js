const jwt = require('jsonwebtoken')

const authorizer = (req, res, next) => {
  // Header의 authentication 필드 접근
  const authorization = req.headers['authorization']
  if (!authorization) {
    // 토큰이 없으면 실패
    next(Error('missing authorization token'))
  }

  // 예) Bearer eyJhbGciOiJIUzI1N...
  const [, token] = authorization.split(' ')
  const isVerified = jwt.verify(token, 'my-secret-key')
  console.log(isVerified)
  if (isVerified) {
    next()
  } else {
    // 토큰 검증에 실패
    next(Error('invalid authorization token'))
  }
}

module.exports = authorizer
