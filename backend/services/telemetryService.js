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
    [MSG_ID.GLOBAL_POSITION]: 'payload.lat payload.lon payload.alt',
    [MSG_ID.BATTERY_STATUS]: 'payload.batteryRemaining payload.voltages payload.temperature',
    [MSG_ID.VFR_HUD]: 'payload.alt payload.groundspeed',
    [MSG_ID.STATUSTEXT]: 'payload.text'
};

const interpolate = (prev, next, t) => prev + (next - prev) * t;


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


        // 1. 고도 및 속도 데이터 분리
        const altData = [];
        const speedData = [];

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
                    altData.push({
                        timestamp: baseData.timestamp,
                        alt: telemetry.payload.alt
                    });
                    return {
                        ...baseData,
                        lat: telemetry.payload.lat,
                        lon: telemetry.payload.lon,
                        alt: telemetry.payload.alt
                    };

                case MSG_ID.BATTERY_STATUS:
                    return {
                        ...baseData,
                        batteryRemaining: telemetry.payload.batteryRemaining,
                        voltage: telemetry.payload.voltages?.length ? telemetry.payload.voltages[0] : 0,
                        temperature: telemetry.payload.temperature
                    };
                case MSG_ID.VFR_HUD:
                    speedData.push({
                        timestamp: baseData.timestamp,
                        groundspeed: telemetry.payload.groundspeed
                    });
                    return {
                        ...baseData,
                        heading: telemetry.payload.heading,
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

        // 타임스탬프 기준으로 보간법 적용
        const interpolateData = (timestamp, altData, speedData) => {
            let prevAlt = null, nextAlt = null, prevSpeed = null, nextSpeed = null;

            const targetTime = new Date(timestamp).getTime();

            // 고도 데이터에서 이전/다음 값 찾기
            for (const alt of altData) {
                const altTime = new Date(alt.timestamp).getTime();
                if (altTime <= targetTime) {
                    prevAlt = alt;
                }
                if (altTime >= targetTime && !nextAlt) {
                    nextAlt = alt;
                }
            }

            // 속도 데이터에서 이전/다음 값 찾기
            for (const spd of speedData) {
                const spdTime = new Date(spd.timestamp).getTime();
                if (spdTime <= targetTime) {
                    prevSpeed = spd;
                }
                if (spdTime >= targetTime && !nextSpeed) {
                    nextSpeed = spd;
                }
            }

            if (prevAlt && nextAlt && prevSpeed && nextSpeed) {
                const tAlt = (targetTime - new Date(prevAlt.timestamp).getTime()) /
                    (new Date(nextAlt.timestamp).getTime() - new Date(prevAlt.timestamp).getTime());
                const tSpeed = (targetTime - new Date(prevSpeed.timestamp).getTime()) /
                    (new Date(nextSpeed.timestamp).getTime() - new Date(prevSpeed.timestamp).getTime());

                return {
                    timestamp,
                    alt: interpolate(prevAlt.alt, nextAlt.alt, tAlt),
                    groundspeed: interpolate(prevSpeed.groundspeed, nextSpeed.groundspeed, tSpeed)
                };
            }
            // 보간할 수 없는 경우 가장 가까운 값 사용
            return {
                timestamp,
                alt: prevAlt?.alt || nextAlt?.alt || null,
                groundspeed: prevSpeed?.groundspeed || nextSpeed?.groundspeed || null
            };
        };
        const findClosestSpeed = (timestamp, speedData) => {
            const targetTime = new Date(timestamp).getTime();

            return speedData.reduce((closest, current) => {
                const currentTime = new Date(current.timestamp).getTime();
                const closestTime = closest ? new Date(closest.timestamp).getTime() : null;

                if (!closest) return current;

                return Math.abs(currentTime - targetTime) < Math.abs(closestTime - targetTime)
                    ? current
                    : closest;
            }, null);
        };
        const altAndSpeedData = altData.map(altItem => {
            const matchingSpeed = findClosestSpeed(altItem.timestamp, speedData);
            return matchingSpeed
                ? {
                    timestamp: altItem.timestamp,
                    alt: altItem.alt,
                    groundspeed: matchingSpeed.groundspeed
                }
                : interpolateData(altItem.timestamp, altData, speedData);
        });


        // 4. 타임스탬프 기준 정렬
        const sortedData = processedData.sort((a, b) => b.timestamp - a.timestamp);
        return {
            success: true,
            data: sortedData,
            altAndSpeedData,
            error: null
        };
    } catch (error) {
        console.error('Error in getTelemetriesByRobotAndOperation:', error);
        throw new Error(`Error fetching telemetries for robot ${robotName} and operation ${operationName}: ${error.message}`);
    }
};

/**
 * 로봇 이름과 오퍼레이션 이름을 기준으로 Telemetry 데이터를 필터링합니다.
 * @async
 * @function getTelemetriesByRobotAndOperation
 * @param {string} robotName - 로봇의 이름
 * @param {string} operationName - 오퍼레이션의 이름
 * @returns {Promise<Array>} - 필터링된 Telemetry 데이터
 * @throws {Error} - 서버 에러 발생 시 에러 메시지 반환
 */
const getTelemetriesByRobotAndOperationForMap = async (robotName, operationName) => {
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
        const telemetries = await Telemetry.find({ robot: robot._id, operation: operation._id });

        return telemetries;
    } catch (error) {
        console.error('Error in getTelemetriesByRobotAndOperation:', error);
        throw new Error(`Error fetching telemetries for robot ${robotName} and operation ${operationName}: ${error.message}`);
    }
};

module.exports = { getTelemetriesByRobotAndOperation, getTelemetriesByRobotAndOperationForMap }
