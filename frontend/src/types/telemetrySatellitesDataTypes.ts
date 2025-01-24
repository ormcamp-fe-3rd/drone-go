export interface ProcessedTelemetrySatellitesData {
  msgId: number;
  timestamp: Date;
  payload: {
    satellitesVisible: number;
  };
}
