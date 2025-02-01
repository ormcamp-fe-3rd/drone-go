const { Schema, model} = require('mongoose')

/**
 * @swagger
 * components:
 *   schemas:
 *     Robot:
 *       type: object
 *       required:
 *         - _id
 *         - name
 *         - robot_id
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the robot
 *         name:
 *           type: string
 *           description: Name of the robot
 *         robot_id:
 *           type: string
 *           description: A unique robot identifier (e.g., serial number)
 */

const robotSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  robot_id: {
    type: String,
    required: true
  },
})

module.exports = model("Robot", robotSchema)