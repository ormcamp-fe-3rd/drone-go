const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Telemetry:
 *       type: object
 *       required:
 *         - _id
 *         - operation
 *         - robot
 *         - __v
 *         - msgId
 *         - timestamp
 *         - payload
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
 *           type: number
 *           description: Version key for Mongoose documents
 *         msgId:
 *           type: number
 *           description: Message ID
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the telemetry was recorded
 *         payload:
 *           type: object
 *           properties:
 *             airspeed:
 *               type: number
 *             groundspeed:
 *               type: number
 *             alt:
 *               type: number
 *             pitch:
 *               type: number
 *             pitchspeed:
 *               type: number
 *             roll:
 *               type: number
 *             rollspeed:
 *               type: number
 *             yaw:
 *               type: number
 *             yawspeed:
 *               type: number
 *             climb:
 *               type: number
 *             altEllipsoid:
 *               type: number
 *             batteryFunction:
 *               type: number
 *             batteryRemaining:
 *               type: number
 *             chargeState:
 *               type: number
 *             cog:
 *               type: number
 *             currentBattery:
 *               type: number
 *             currentConsumed:
 *               type: number
 *             energyConsumed:
 *               type: number
 *             eph:
 *               type: number
 *             epv:
 *               type: number
 *             faultBitmask:
 *               type: number
 *             fixType:
 *               type: number
 *             hAcc:
 *               type: number
 *             hdg:
 *               type: number
 *             hdgAcc:
 *               type: number
 *             heading:
 *               type: number
 *             id:
 *               type: number
 *             lat:
 *               type: number
 *             lon:
 *               type: number
 *             mode:
 *               type: number
 *             relativeAlt:
 *               type: number
 *             satellitesVisible:
 *               type: number
 *             temperature:
 *               type: number
 *             text:
 *               type: string
 *             throttle:
 *               type: number
 *             timeBootMs:
 *               type: number
 *             timeRemaining:
 *               type: number
 *             timeUsec:
 *               type: number
 *             vAcc:
 *               type: number
 *             vel:
 *               type: number
 *             velAcc:
 *               type: number
 *             vx:
 *               type: number
 *             vy:
 *               type: number
 *             vz:
 *               type: number
 *             voltages:
 *               type: array
 *               items:
 *                 type: number
 *             voltagesExt:
 *               type: array
 *               items:
 *                 type: number
 */

const telemetrySchema = new Schema({
  _id: Schema.Types.ObjectId,
  operation: { type: Schema.Types.ObjectId, ref: 'Operation', required: true },
  robot: { type: Schema.Types.ObjectId, ref: 'Robot', required: true },
  __v: Number,
  msgId: { type: Number, required: true },
  timestamp: { type: Date, required: true },
  payload: {
    airspeed: Number,
    groundspeed: Number,
    alt: Number,
    pitch: Number,
    pitchspeed: Number,
    roll: Number,
    rollspeed: Number,
    yaw: Number,
    yawspeed: Number,
    climb: Number,
    altEllipsoid: Number,
    batteryFunction: Number,
    batteryRemaining: Number,
    chargeState: Number,
    cog: Number,
    currentBattery: Number,
    currentConsumed: Number,
    energyConsumed: Number,
    eph: Number,
    epv: Number,
    faultBitmask: Number,
    fixType: Number,
    hAcc: Number,
    hdg: Number,
    hdgAcc: Number,
    heading: Number,
    id: Number,
    lat: Number,
    lon: Number,
    mode: Number,
    relativeAlt: Number,
    satellitesVisible: Number,
    temperature: Number,
    text: String,
    throttle: Number,
    timeBootMs: Number,
    timeRemaining: Number,
    timeUsec: Number,
    vAcc: Number,
    vel: Number,
    velAcc: Number,
    vx: Number,
    vy: Number,
    vz: Number,
    voltages: [Number],
    voltagesExt: [Number],
  },
});

module.exports = model('Telemetry', telemetrySchema);