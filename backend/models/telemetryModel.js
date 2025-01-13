const { Schema, model } = require('mongoose');

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
    type: Object,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true
  }
});

module.exports = model('Telemetry', telemetrySchema);

