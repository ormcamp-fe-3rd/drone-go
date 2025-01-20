export interface ProcessedTelemetryTextData {
  msgId: number;
  timestamp: Date; // Date 객체로 처리
  payload: {
    text: string;
  };
}
