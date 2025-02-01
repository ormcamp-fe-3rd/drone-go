const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Telemetry = require("../models/telemetryModel");

/**
 * 특정 로봇 및 오퍼레이션의 텔레메트리 데이터를 조회합니다.
 * - 특정 로봇과 오퍼레이션 ID에 해당하는 데이터 필터링
 * - 선택적으로 특정 필드만 반환 가능
 * @async
 * @route GET /telemetries
 * @param {string} robot - 쿼리 파라미터로 전달된 로봇 ID (필수)
 * @param {string} operation - 쿼리 파라미터로 전달된 오퍼레이션 ID (필수)
 * @param {string} [fields] - 선택적으로 가져올 필드 목록 (쉼표로 구분된 문자열)
 * @returns {Promise<void>} - JSON 형식의 Telemetry 데이터 응답
 * @throws {Error} - 서버 에러 발생 시 500 상태 코드와 에러 메시지 반환
 */
router.get("/", async (req, res) => {
  try {
    const { robot, operation, fields } = req.query;

    if (!robot || !operation) {
      return res.status(400).json({ message: "Both 'robot' and 'operation' parameters are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(robot) || !mongoose.Types.ObjectId.isValid(operation)) {
      return res.status(400).json({ message: "Invalid 'robot' or 'operation' ID format" });
    }

    const fieldSelection = fields ? fields.split(",").join(" ") : "";

    const telemetries = await Telemetry.find({ robot, operation }).select(fieldSelection);

    if (!telemetries.length) {
      return res.status(404).json({ message: "No matching telemetry data found" });
    }

    res.json(telemetries);
  } catch (error) {
    console.error("Error fetching telemetry data:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;