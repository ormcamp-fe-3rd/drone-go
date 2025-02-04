const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const { getAllTelemetries, getDistinctDates } = require("../controllers/telemetryController");
const authorizer = require("../middleware/authorizer");

/**
 * @route GET /telemetries
 * @desc 특정 robot ID와 operation ID에 해당하는 필터링된 Telemetry 데이터를 가져옴
 * @query {string} robot - 로봇 ID
 * @query {string} operation - 오퍼레이션 ID
 * @query {string} pageKey - 페이지 키 (필터링용)
 * @access Protected (authorizer 미들웨어 적용)
 */
router.get("/", authorizer, getAllTelemetries);

/**
 * @route GET /telemetries/distinctDates
 * @desc 특정 robot ID와 operation ID에 해당하는 distinctDates를 가져옴
 * @query {string} robot - 로봇 ID
 * @query {string} operations - 쉼표로 구분된 오퍼레이션 ID 목록
 * @access Public
 */
router.get("/distinctDates", getDistinctDates);

module.exports = router;