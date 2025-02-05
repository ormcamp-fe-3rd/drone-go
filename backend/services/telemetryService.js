const mongoose = require('mongoose');
const Telemetry = require('../models/telemetryModel');
const Operation = require('../models/operationModel');
const Robot = require('../models/robotModel');

/**
 * 로봇 이름과 오퍼레이션 이름을 기준으로 Telemetry 데이터를 필터링합니다.
 * @async
 * @function getTelemetriesByRobotAndOperation
 * @param {string} robotName - 로봇의 이름
 * @param {string} operationName - 오퍼레이션의 이름
 * @returns {Promise<Array>} - 필터링된 Telemetry 데이터
 * @throws {Error} - 서버 에러 발생 시 에러 메시지 반환
 */
const MSG_ID = {
    GPS_RAW_INT: 24, //연결된 위성수
    ATTITUDE: 30, //드론 자세 정보(roll, pitch, yaw)
    GLOBAL_POSITION: 33, //위도, 경도, 고도
    VFR_HUD: 74, //헤딩, 속도
    BATTERY_STATUS: 147, //배터리 온도, 전압, 잔량
    STATUSTEXT: 253 //텍스트 상태 메세지
};

const FIELD_MAPPINGS = {
    [MSG_ID.GPS_RAW_INT]: 'payload.satellitesVisible',
    [MSG_ID.ATTITUDE]: 'payload.roll payload.pitch payload.yaw',
    [MSG_ID.GLOBAL_POSITION]: 'payload.latitude payload.longitude payload.altitude',
    [MSG_ID.BATTERY_STATUS]: 'payload.batteryRemaining payload.voltages payload.temperature',
    [MSG_ID.VFR_HUD]: 'payload.alt payload.groundspeed',
    [MSG_ID.STATUSTEXT]: 'payload.text'
};
const getTelemetriesByRobotAndOperation = async (robotName, operationName) => {
    try {
        let robot;
        // robotName이 ObjectId 형식인지 체크하여, ObjectId라면 _id로 검색
        if (mongoose.Types.ObjectId.isValid(robotName)) {
            robot = await Robot.findById(robotName);
        } else {
            robot = await Robot.findOne({ name: robotName });
        }
        if (!robot) {
            throw new Error(`Robot with name ${robotName} not found.`);
        }

        let operation;
        // operationName이 ObjectId인 경우 처리
        if (mongoose.Types.ObjectId.isValid(operationName)) {
            operation = await Operation.findById(operationName);
        } else {
            operation = await Operation.findOne({ name: operationName, robot: robot._id });
        }
        // 로봇과 오퍼레이션을 기준으로 Telemetry 데이터를 필터링
        const queries = Object.entries(MSG_ID).map(([type, id]) => {
            return Telemetry.find({
                robot: robot._id,
                operation: operation._id,
                msgId: id
            })
                .select(`msgId timestamp ${FIELD_MAPPINGS[id]}`)  // 필요한 필드만 선택
                .lean()  // JSON 객체로 바로 변환
                .exec();
        });

        const results = await Promise.all(queries);

        // 3. 데이터 처리 및 변환
        const processedData = results.flat().map(telemetry => {
            const baseData = {
                msgId: telemetry.msgId,
                timestamp: new Date(telemetry.timestamp)
            };

            switch (telemetry.msgId) {
                case MSG_ID.GPS_RAW_INT:
                    return {
                        ...baseData,
                        satellitesVisible: telemetry.payload.satellitesVisible
                    };
                case MSG_ID.ATTITUDE:
                    return {
                        ...baseData,
                        roll: telemetry.payload.roll,
                        pitch: telemetry.payload.pitch,
                        yaw: telemetry.payload.yaw
                    };
                case MSG_ID.GLOBAL_POSITION:
                    return {
                        ...baseData,
                        latitude: telemetry.payload.latitude,
                        longitude: telemetry.payload.longitude,
                        altitude: telemetry.payload.altitude
                    };
                case MSG_ID.BATTERY_STATUS:
                    return {
                        ...baseData,
                        batteryRemaining: telemetry.payload.batteryRemaining,
                        voltage: telemetry.payload.voltages?.length ? telemetry.payload.voltages[0] : 0,
                        temperature: telemetry.payload.temperature
                    };
                case MSG_ID.VFR_HUD:
                    return {
                        ...baseData,
                        alt: telemetry.payload.alt,
                        groundspeed: telemetry.payload.groundspeed
                    };
                case MSG_ID.STATUSTEXT:
                    return {
                        ...baseData,
                        text: telemetry.payload.text
                    };
                default:
                    return baseData;
            }
        });

        // 4. 타임스탬프 기준 정렬
        const sortedData = processedData.sort((a, b) => b.timestamp - a.timestamp);
        return {
            success: true,
            data: sortedData,
            error: null
        };
    } catch (error) {
        console.error('Error in getTelemetriesByRobotAndOperation:', error);
        throw new Error(`Error fetching telemetries for robot ${robotName} and operation ${operationName}: ${error.message}`);
    }
};

module.exports = { getTelemetriesByRobotAndOperation };
