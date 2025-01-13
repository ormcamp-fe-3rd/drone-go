const { Schema, model } = require('mongoose')

const telemetrySchema = new Schema({
  operation: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Operation',
  },
  robot: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Robot',
  },
  msgId: {
    type: Number,
    required: true,
  },
  payload: {
    timeBootMs: {
      type: Number,
      required: true,
    },
    roll: {
      type: Number,
      required: true,
    },
    pitch: {
      type: Number,
      required: true,
    },
    yaw: {
      type: Number,
      required: true,
    },
  },
  timestamp: {
    type: Date,
    required: true
  }
})

module.exports = model('Telemetry', telemetrySchema)
