const mongoose = require('mongoose');
const Telemetry = require('../models/telemetryModel');
const telemetryFilterConfig = require("../config/telemetryFilterConfig");

/**
 * 로봇과 오퍼레이션 ID를 기준으로 필터링된 Telemetry 데이터를 가져옵니다.
 * @async
 * @function getFilteredTelemetries
 * @param {string} robotId - 로봇의 ID
 * @param {string} operationId - 오퍼레이션의 ID
 * @param {string} pageKey - 필터링을 적용할 페이지 키
 * @returns {Promise<Array>} - 필터링된 Telemetry 데이터
 * @throws {Error} - 서버 에러 발생 시 에러 메시지 반환
 */
const getFilteredTelemetries = async (robotId, operationId, pageKey) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(robotId) || !mongoose.Types.ObjectId.isValid(operationId)) {
            throw new Error("Invalid robotId or operationId format.");
        }

        const pageKeyConfig = telemetryFilterConfig[pageKey];
        if (!pageKeyConfig) {
            throw new Error(`Invalid pageKey: ${pageKey}`);
        }
        
        const allowedMsgIds = Object.keys(pageKeyConfig).map(Number);

        // MongoDB에서 ID 기반으로 필터링된 데이터 가져오기
        const telemetries = await Telemetry.find({
            robot: robotId,
            operation: operationId,
            msgId: { $in: allowedMsgIds }
        });

        // 필터링 로직 적용
        return telemetries.map(entry => ({
            timestamp: new Date(entry.timestamp),
            msgId: entry.msgId,
            payload: Object.fromEntries(
                (pageKeyConfig[entry.msgId] ?? []).map(key => [key, entry.payload[key]])
            ),
        }));
    } catch (error) {
        console.error('Error in getFilteredTelemetries:', error);
        throw new Error(`Error fetching filtered telemetries: ${error.message}`);
    }
};

module.exports = { getFilteredTelemetries };