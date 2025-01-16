const router = require("express").Router()

router.use("/robots", require("./robotRoutes"))
router.use("/operations", require("./operationRoutes"))
router.use("/telemetries", require("./telemetryRoutes"))

module.exports = router