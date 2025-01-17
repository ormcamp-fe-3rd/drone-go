const mongoose = require('mongoose');
const Telemetry = require('../models/telemetryModel');


/**
 * 주어진 robot ID와 operation ID에 해당하는 Telemetries 데이터를 가져옵니다.
 * @async
 * @function getAllTelemetries
 * @param {object} req - Express 요청 객체
 * @param {object} res - Express 응답 객체
 * @returns {Promise<void>} - 성공 시 모든 Telemetry 데이터를 JSON 형식으로 응답
 * @throws {Error} - 서버 에러 발생 시 500 상태 코드와 에러 메시지 반환
 */
const getAllTelemetries = async (req, res) => {
    try {
        const { robot, operation } = req.query;

        // 로봇과 operation이 모두 제공되지 않으면 400 에러
        if (!robot || !operation) {
            return res.status(400).json({ message: 'Both robot and operation must be provided' });
        }

        // 쿼리 파라미터로 받은 robot ID와 operation ID가 유효한지 확인
        if (robot && !mongoose.Types.ObjectId.isValid(robot)) {
            return res.status(400).json({ message: 'Invalid robot ID format' });
        }

        if (operation && !mongoose.Types.ObjectId.isValid(operation)) {
            return res.status(400).json({ message: 'Invalid operation ID format' });
        }

        // robot과 operation이 모두 제공되면 필터링
        const filteredTelemetries = await Telemetry.find({ robot, operation });

        if (!filteredTelemetries || filteredTelemetries.length === 0) {
            return res.status(404).json({ message: 'No matching telemetries found' });
        }

        res.json(filteredTelemetries);
    } catch (error) {
        console.error('Error in getAllTelemetries function:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getAllTelemetries };