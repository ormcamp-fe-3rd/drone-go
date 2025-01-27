const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Telemetry:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the telemetry data
 *         operation:
 *           type: string
 *           description: Reference to the Operation model
 *         robot:
 *           type: string
 *           description: Reference to the Robot model
 *         __v:
 *           type: Number
 *           description: Version key for Mongoose documents
 *         msgId:
 *           type: Number
 *           description: Message ID
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the telemetry was recorded
 *         payload:
 *           type: object
 *           properties:
 *             airspeed:
 *               type: Number
 *               description: Airspeed of the robot
 *             groundspeed:
 *               type: Number
 *               description: Groundspeed of the robot
 *             alt:
 *               type: Number
 *               description: Altitude
 *             pitch:
 *               type: Number
 *               description: Pitch angle
 *             pitchspeed:
 *               type: Number
 *               description: Pitch speed
 *             roll:
 *               type: Number
 *               description: Roll angle
 *             rollspeed:
 *               type: Number
 *               description: Roll speed
 *             yaw:
 *               type: Number
 *               description: Yaw angle
 *             yawspeed:
 *               type: Number
 *               description: Yaw speed
 *             climb:
 *               type: Number
 *               description: Climb rate
 *             altEllipsoid:
 *               type: Number
 *               description: Ellipsoid altitude
 *             batteryFunction:
 *               type: Number
 *               description: Battery function status
 *             batteryRemaining:
 *               type: Number
 *               description: Remaining battery percentage
 *             chargeState:
 *               type: Number
 *               description: Charge state of the battery
 *             currentBattery:
 *               type: Number
 *               description: Current battery level
 *             fixType:
 *               type: Number
 *               description: GPS fix type
 *             hdg:
 *               type: Number
 *               description: Heading
 *             lat:
 *               type: Number
 *               description: Latitude of the telemetry data
 *             lon:
 *               type: Number
 *               description: Longitude of the telemetry data
 *             voltages:
 *               type: array
 *               items:
 *                 type: Number
 *               description: Battery voltage readings
 *             voltagesExt:
 *               type: array
 *               items:
 *                 type: Number
 *               description: Extended battery voltage readings
 */

const telemetrySchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
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
  __v: {
    type: Number,
    required: true,
  },
  msgId: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true
  },
  payload: {
    type: Object,
    required: true,
    properties: {
      airspeed : {
        type: Number,
        required: true,
      },
      groundspeed : {
        type: Number,
        required: true,
      },
      alt : {
        type: Number,
        required: true,
      },
      pitch : {
        type: Number,
        required: true,
      },
      pitchspeed : {
        type: Number,
        required: true,
      },
      roll : {
        type: Number,
        required: true,
      },
      rollspeed : {
        type: Number,
        required: true,
      },
      yaw : {
        type: Number,
        required: true,
      },
      yawspeed : {
        type: Number,
        required: true,
      },
      climb : {
        type: Number,
        required: true,
      },
      altEllipsoid: {
        type: Number,
        required: true,
      },
      batteryFunction: {
        type: Number,
        required: true,
      },
      batteryRemaining: {
        type: Number,
        required: true,
      },
      chargeState: {
        type: Number,
        required: true,
      },
      cog: {
        type: Number,
        required: true,
      },
      currentBattery: {
        type: Number,
        required: true,
      },
      currentConsumed: {
        type: Number,
        required: true,
      },
      energyConsumed: {
        type: Number,
        required: true,
      },
      eph: {
        type: Number,
        required: true,
      },
      epv: {
        type: Number,
        required: true,
      },
      faultBitmask: {
        type: Number,
        required: true,
      },
      fixType: {
        type: Number,
        required: true,
      },
      hAcc: {
        type: Number,
        required: true,
      },
      hdg: {
        type: Number,
        required: true,
      },
      hdgAcc: {
        type: Number,
        required: true,
      },
      heading: {
        type: Number,
        required: true,
      },
      id: {
        type: Number,
        required: true,
      },
      lat: {
        type: Number,
        required: true,
      },
      lon: {
        type: Number,
        required: true,
      },
      mode: {
        type: Number,
        required: true,
      },
      relativeAlt: {
        type: Number,
        required: true,
      },
      satellitesVisible: {
        type: Number,
        required: true,
      },
      temperature: {
        type: Number,
        required: true,
      },
      throttle: {
        type: Number,
        required: true,
      },
      timeBootMs: {
        type: Number,
        required: true,
      },
      timeRemaining: {
        type: Number,
        required: true,
      },
      timeUsec: {
        type: Number,
        required: true,
      },
      vAcc: {
        type: Number,
        required: true,
      },
      vel: {
        type: Number,
        required: true,
      },
      velAcc: {
        type: Number,
        required: true,
      },
      vx: {
        type: Number,
        required: true,
      },
      vy: {
        type: Number,
        required: true,
      },
      vz: {
        type: Number,
        required: true,
      },
      vx: {
        type: Number,
        required: true,
      },
      voltages: {
        type: [Number],
        required: true,
      },
      voltagesExt: {
        type: [Number],
        required: true,
      },
    },
  },
});

module.exports = model('Telemetry', telemetrySchema);

