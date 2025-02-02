const mongoose = require('mongoose');
const Telemetry = require('../models/telemetryModel');

/**
 * 특정 robot ID와 operation ID에 해당하는 Telemetry 데이터를 가져오고 후처리하여 반환합니다.
 * @async
 * @function getAllTelemetries
 * @param {object} req - Express 요청 객체
 * @param {object} res - Express 응답 객체
 * @returns {Promise<void>} - 성공 시 가공된 Telemetry 데이터를 JSON 형식으로 응답
 * @throws {Error} - 서버 에러 발생 시 500 상태 코드와 에러 메시지 반환
 */

const getAllTelemetries = async (req, res) => {
    try {
        const { robot, operation } = req.query;

        // robot과 operation이 제공되지 않으면 400 에러
        if (!robot || !operation) {
            return res.status(400).json({ message: 'Both robot and operation must be provided' });
        }

        // ID 유효성 검사
        if (![robot, operation].every(mongoose.Types.ObjectId.isValid)) {
            return res.status(400).json({ message: 'Invalid robot or operation ID format' });
        }

        // MongoDB에서 해당 로봇과 오퍼레이션의 텔레메트리 데이터 검색
        const telemetries = await Telemetry.find({ robot, operation });

        if (!telemetries.length) {
            return res.status(404).json({ message: 'No matching telemetries found' });
        }

        // 데이터 후처리 (undefined → null 변환 및 기본값 처리)
        const processedTelemetries = telemetries.map((telemetry) => ({
            ...telemetry.toObject(),
            payload: Object.fromEntries(
                Object.entries(telemetry.payload || {}).map(([key, value]) => [
                    key,
                    value !== undefined ? value : null,
                ])
            ),
        }));

        // ✅ 응답 보내기 전에 콘솔 로그 찍기
        console.log("📡 API Response Data:", JSON.stringify(processedData, null, 2));

        res.json(processedTelemetries);
    } catch (error) {
        console.error('Error in getAllTelemetries:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getAllTelemetries };