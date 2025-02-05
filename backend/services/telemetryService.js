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
        // 페이지별 필터링 설정 가져오기
        const pageKeyConfig = telemetryFilterConfig[pageKey];
        if (!pageKeyConfig) {
            throw new Error(`Invalid pageKey: ${pageKey}`);
        }

        // 페이지별 설정에 따라 각 필드를 동적으로 쿼리
        const allowedMsgIds = Object.keys(pageKeyConfig).map(Number);

        // 병렬 쿼리 처리
        const queryPromises = allowedMsgIds.map(msgId => {
            const fieldsToSelect = pageKeyConfig[msgId];
            return Telemetry.find({
                robot: robotId,
                operation: operationId,
                msgId: msgId
            })
            .select(`msgId timestamp payload.${fieldsToSelect.join(' payload.')}`) // 필요한 필드만 동적으로 선택
            .lean(); // 성능 향상 위해 lean() 사용
        });

        // 병렬로 실행하여 모든 데이터를 가져오기
        const results = await Promise.all(queryPromises);

        // 결과 병합 후 필터링 및 가공
        const mergedData = results.flat().map(entry => {
            const baseData = {
                timestamp: new Date(entry.timestamp),
                msgId: entry.msgId,
            };

            const payloadFields = pageKeyConfig[entry.msgId] ?? [];
            const payload = Object.fromEntries(
                payloadFields.map(key => [key, entry.payload[key]])
            );

            return {
                ...baseData,
                payload,
            };
        }).sort((a, b) => b.timestamp - a.timestamp);  // 타임스탬프 기준으로 정렬

        return mergedData;
    } catch (error) {
        console.error('Error in getFilteredTelemetries:', error);
        throw new Error(`Error fetching filtered telemetries: ${error.message}`);
    }
};

module.exports = { getFilteredTelemetries };