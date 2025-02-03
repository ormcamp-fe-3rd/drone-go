const { Schema, model} = require('mongoose')

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