// 📌 CHART 페이지 전용 타입 (필요한 필드만 정의)
export interface TelemetryChartData {
    msgId: number;
    timestamp: Date;
    payload: {
        satellitesVisible: number;
        alt: number;
        groundspeed: number;
        temperature: number;
        batteryRemaining: number;
        voltage: number;
        text: string;
    };
}