import { MSG_ID } from "@/constants";
import { AltAndSpeedData } from "@/types/altAndspeedDataType";

import { TelemetryData } from "../types/telemetryAllDataTypes";
import { ProcessedTelemetryBatteryData } from "../types/telemetryBatteryDataTypes";
import { ProcessedTelemetrySatellitesData } from "../types/telemetrySatellitesDataTypes";
import { ProcessedTelemetryTextData } from "../types/telemetryTextData";

export const fetchTelemetriesByRobotAndOperation = async (
  robotId: string,
  operationId: string,
): Promise<{
  batteryData: ProcessedTelemetryBatteryData[];
  textData: ProcessedTelemetryTextData[];
  satellitesData: ProcessedTelemetrySatellitesData[];
  altAndSpeedData: AltAndSpeedData[];
}> => {
  if (!robotId || !operationId) {
    throw new Error("Both robotId and operationId are required");
  }

  const url = `http://localhost:3000/telemetries?robot=${encodeURIComponent(robotId)}&operation=${encodeURIComponent(operationId)}`;

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      if (response.status === 401) {
        // 로그인 토큰이 유효하지 않음
        localStorage.removeItem("token");
        alert("Your session has expired. Please log in again.");
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
        throw new Error("Unauthorized user");
      }
      const errorBody = await response.text();
      console.log("Error Body:", errorBody);
      throw new Error(`Failed to fetch telemetries: ${response.statusText}`);
    }
    const data = await response.json();

    // 데이터가 객체 형태로 반환되므로, 각 프로퍼티를 배열로 처리
    const batteryData = data.batteryData || [];
    const textData = data.textData || [];
    const satellitesData = data.satellitesData || [];
    const altAndSpeedData = data.altAndSpeedData || [];

    // 배열이 아니라면 빈 배열로 처리
    if (
      !Array.isArray(batteryData) ||
      !Array.isArray(textData) ||
      !Array.isArray(satellitesData) ||
      !Array.isArray(altAndSpeedData)
    ) {
      throw new Error("The data fetched is not an array");
    }

    return {
      batteryData,
      textData,
      satellitesData,
      altAndSpeedData,
    };
  } catch (error) {
    console.error("Error fetching telemetries:", error);
    throw error;
  }
};
