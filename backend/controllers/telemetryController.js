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

        // 데이터 후처리 (모든 필드의 undefined → null 변환)
        const processUndefinedToNull = (obj) => {
            return Object.fromEntries(
                Object.entries(obj).map(([key, value]) => [
                    key,
                    value !== undefined
                        ? typeof value === 'object' && value !== null
                            ? processUndefinedToNull(value) // 재귀적으로 처리
                            : value
                        : null
                ])
            );
        };

        const processedTelemetries = telemetries.map((telemetry) =>
            processUndefinedToNull(telemetry.toObject())
        );

        res.json(processedTelemetries);
    } catch (error) {
        console.error('Error in getAllTelemetries:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * 특정 robot ID와 operation ID에 해당하는 distinctDates를 가져옵니다.
 * @async
 * @function getDistinctDates
 * @param {object} req - Express 요청 객체
 * @param {object} res - Express 응답 객체
 * @returns {Promise<void>} - 성공 시 distinctDates 데이터를 JSON 형식으로 응답
 * @throws {Error} - 서버 에러 발생 시 500 상태 코드와 에러 메시지 반환
 */
const getDistinctDates = async (req, res) => {
    try {
        const { robot, operations } = req.query;
        // robot 또는 operations가 없으면 400 에러 반환
        if (!robot) {
            return res.status(400).json({ message: 'Robot parameter is required' });
        }
        if (!operations) {
            return res.status(400).json({ message: 'Operations parameter is required' });
        }
        // operations가 빈 문자열이거나 undefined일 경우 에러 처리
        if (!operations || operations.trim() === '') {
            return res.status(400).json({ message: 'Operations must be a non-empty string' });
        }
        // operations 값이 존재하면 split을 사용해 배열로 변환
        const operationIds = operations.split(',');

        // `robot`과 `operationIds` 값을 ObjectId로 변환
        const robotObjectId = new mongoose.Types.ObjectId(robot); // 문자열로 변환
        const operationObjectIds = operationIds.map(id => new mongoose.Types.ObjectId(id)); // 배열의 각 항목을 ObjectId로 변환

        // MongoDB에서 distinctDates를 가져오기 위한 집계
        const result = await Telemetry.aggregate([
            {
                $match: {
                    robot: robotObjectId,
                    operation: { $in: operationObjectIds }
                }
            },
            {
                $addFields: {
                    formattedDate: { $toDate: "$timestamp" } // 확실한 변환
                }
            },
            {
                $project: {
                    _id: 0,
                    operation: 1,
                    timestamp: 1,
                    timestampAsString: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$formattedDate",
                            timezone: "Asia/Seoul"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: {
                        operation: "$operation",
                        date: "$timestampAsString"
                    },
                    timestamp: { $first: "$timestamp" }
                }
            },
            {
                $group: {
                    _id: "$_id.operation",
                    dates: { $push: "$_id.date" }
                }
            },
            {
                $project: {
                    _id: 0,
                    operation: "$_id",
                    dates: 1
                }
            }
        ]);

        //결과를 operationId를 키로 하는 객체로 변환
        const formattedResult = result.reduce((acc, item) => {
            // operation을 문자열로 변환
            const operationId = item.operation.toString();

            if (operationId === undefined) {
                console.error("Error: Undefined operation ID found", item);
            } else {
                acc[operationId] = item.dates.map(date => {

                    const validDate = date instanceof Date ? date : new Date(date);

                    if (validDate instanceof Date && !isNaN(validDate)) {
                        return validDate.toISOString();
                    } else {
                        console.error("Invalid date:", date);
                        return null;
                    }
                });
            }
            return acc;
        }, {});


        res.json(formattedResult);
    } catch (error) {
        console.error('Error in getDistinctDates:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};


module.exports = { getAllTelemetries, getDistinctDates };