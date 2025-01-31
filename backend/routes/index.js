const router = require("express").Router()

router.use("/robots", require("./robotRoutes"))
router.use("/operations", require("./operationRoutes"))
router.use("/telemetries", require("./telemetryRoutes"))
router.use('/users', require('./userRoutes'))

module.exports = router