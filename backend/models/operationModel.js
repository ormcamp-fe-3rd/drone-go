const { Schema, model } = require('mongoose')

const operationSchema = new Schema({
  robot: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Robot"
  },
})

module.exports = model('Operation', operationSchema)
