import * as XLSX from "xlsx";

const formatTimestamp = (timestamp: Date) => {
  return new Date(timestamp).toISOString().replace("T", " ").split(".")[0]; // YYYY-MM-DD HH:mm:ss 형식으로 변환
};

const exportToExcel = (
  batteryData: any[],
  textData: any[],
  satellitesData: any[],
  altAndSpeedData: any[],
  selectedDroneName: string | null,
  selectedOperationName: string | null,
) => {
  const batteryDataFormatted = batteryData.map((data) => ({
    timestamp: formatTimestamp(data.timestamp),
    temperature: data.payload.temperature,
    batteryRemaining: data.payload.batteryRemaining,
    voltage: data.payload.voltage, // voltage 값 설정
  }));

  const stateDataFormatted = textData.map((data) => ({
    timestamp: formatTimestamp(data.timestamp),
    message: data.payload.text,
  }));

  const satellitesDataFormatted = satellitesData.map((data) => ({
    timestamp: formatTimestamp(data.timestamp),
    satellitesVisible: data.payload.satellitesVisible,
  }));

  const altAndSpeedDataFormatted = altAndSpeedData.map((data) => ({
    timestamp: formatTimestamp(data.timestamp),
    altitude: data.payload.alt,
    speed: data.payload.groundspeed,
  }));

  // 엑셀로 내보낼 데이터를 구성
  const data = [
    { title: "Battery Data", values: batteryDataFormatted },
    { title: "State Data", values: stateDataFormatted },
    { title: "Satellites Data", values: satellitesDataFormatted },
    { title: "Alt and Speed Data", values: altAndSpeedDataFormatted },
  ];

  // 워크북 생성
  const wb = XLSX.utils.book_new();

  // 각 데이터 항목에 대해 시트를 추가
  data.forEach((item) => {
    const ws = XLSX.utils.json_to_sheet(item.values);
    XLSX.utils.book_append_sheet(wb, ws, item.title);
  });

  const filename = `${(selectedDroneName ?? "unknown").replace(/\s+/g, "")}-${(selectedOperationName ?? "unknown").replace(/\s+/g, "")}.xlsx`;

  XLSX.writeFile(wb, filename);
};

export default exportToExcel;