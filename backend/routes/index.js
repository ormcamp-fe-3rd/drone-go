const router = require("express").Router()

router.use("/robots", require("./robotRoutes"))
router.use("/operations", require("./operationRoutes"))

module.exports = router