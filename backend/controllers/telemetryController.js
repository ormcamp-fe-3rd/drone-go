const { getFilteredTelemetries } = require("../services/telemetryService");
const mongoose = require('mongoose');
const Telemetry = require('../models/telemetryModel');

/**
 * 특정 robot ID와 operation ID에 해당하는 필터링된 Telemetry 데이터를 가져오고 후처리하여 반환합니다.
 * @async
 * @function getAllTelemetries
 * @param {object} req - Express 요청 객체
 * @param {object} res - Express 응답 객체
 * @returns {Promise<void>} - 성공 시 가공된 Telemetry 데이터를 JSON 형식으로 응답
 * @throws {Error} - 서버 에러 발생 시 500 상태 코드와 에러 메시지 반환
 */
const getAllTelemetries = async (req, res) => {
    try {
        const { robot, operation, pageKey } = req.query;

        // 필수 파라미터 체크
        if (!robot || !operation || !pageKey) {
            return res.status(400).json({ message: "Both robot, operation, and pageKey must be provided." });
        }

        // ID 형식 검증
        if (!mongoose.Types.ObjectId.isValid(robot) || !mongoose.Types.ObjectId.isValid(operation)) {
            return res.status(400).json({ message: "Invalid robot or operation ID format." });
        }

        // 병렬로 필터링된 데이터 가져오기
        const filteredData = await getFilteredTelemetries(robot, operation, pageKey);

        // 데이터가 없으면 404 처리
        if (!filteredData || filteredData.length === 0) {
            return res.status(404).json({ message: "No matching telemetry data found." });
        }

        // 필터링된 데이터 반환
        res.json(filteredData);
    } catch (error) {
        console.error("Error in getAllTelemetries:", error);
        res.status(500).json({ message: "Server error", error: error.message });
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
        
        // 필수 파라미터 체크
        if (!robot) {
            return res.status(400).json({ message: 'Robot parameter is required' });
        }
        if (!operations) {
            return res.status(400).json({ message: 'Operations parameter is required' });
        }
        
        if (!operations || operations.trim() === '') {
            return res.status(400).json({ message: 'Operations must be a non-empty string' });
        }

        // operationIds 배열로 변환
        const operationIds = operations.split(',');
        
        const robotObjectId = new mongoose.Types.ObjectId(robot); 
        const operationObjectIds = operationIds.map(id => new mongoose.Types.ObjectId(id)); 

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
                    formattedDate: {
                        $cond: {
                            if: { $eq: [{ $type: "$timestamp" }, "string"] },
                            then: { $toDate: "$timestamp" }, 
                            else: "$timestamp"
                        }
                    }
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
                            date: "$formattedDate"
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

        // 결과를 operationId를 키로 하는 객체로 변환
        const formattedResult = result.reduce((acc, item) => {
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

        // 결과 반환
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
