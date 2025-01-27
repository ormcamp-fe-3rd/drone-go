const { Schema, model } = require('mongoose')

/**
 * @swagger
 * components:
 *   schemas:
 *     Operation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the operation
 *         robot:
 *           type: string
 *           description: Reference to the Robot model
 */

const operationSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  robot: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Robot"
  },
})

module.exports = model('Operation', operationSchema)
