import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AttitudeIndicator } from 'react-typescript-flight-indicators';

interface AttitudeViewerProps {
  robotId: string;
  operationId: string;
}

interface TelemetryPayload {
  roll: number;
  pitch: number;
  yaw: number;
  timeBootMs: number;
}

interface Telemetry {
  payload: TelemetryPayload;
}

// Interpolator 클래스: 특정 시간에 맞는 roll, pitch, yaw 값을 보간
class Interpolator {
  private x: number[];
  private y: number[][];
  private currentIndex: number;

  constructor(x: number[], y: number[][]) {
    this.x = x;
    this.y = y;
    this.currentIndex = 0;
  }

  at(point: number): number[] {
    while (this.x[this.currentIndex] < point && this.currentIndex < this.x.length - 2) {
      this.currentIndex += 1;
    }
    while (this.x[this.currentIndex] > point && this.currentIndex > 1) {
      this.currentIndex -= 1;
    }
    // 변환식: 라디안에서 각도로 변환 (만약 필요하다면)
    const roll = this.y[this.currentIndex][0] * 180 / Math.PI;
    const pitch = this.y[this.currentIndex][1] * 180 / Math.PI;

    return [roll, pitch];  // 각도로 변환된 값 반환
  }
}

const AttitudeViewer: React.FC<AttitudeViewerProps> = ({ robotId, operationId }) => {
  const [roll, setRoll] = useState<number>(0);
  const [pitch, setPitch] = useState<number>(0);
  const [interpolated, setInterpolated] = useState<Interpolator | null>(null);
  const [time, _setTime] = useState<number>(0);

  // 서버에서 데이터를 가져오는 React Query 훅
  const { data: flightData, isLoading, error } = useQuery({
    queryKey: ['flightData', robotId, operationId], // queryKey는 배열로 전달
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/api/telemetries');  // 모든 데이터를 불러옴
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data; // 전체 데이터 반환
    },
  });

  // 데이터 로딩 후, 필요한 데이터 필터링
  useEffect(() => {
    if (flightData) {
      let x: number[] = [];
      let y: number[][] = [];

      // robotId와 operationId에 맞는 데이터만 필터링
      const filteredData = flightData.filter((telemetry: any) =>
        telemetry.robotId === robotId && telemetry.operationId === operationId && telemetry.msgId === 30
      );

      // 필터링된 데이터에서 roll, pitch, yaw 값을 추출하여 x, y 배열에 저장
      filteredData.forEach((telemetry: Telemetry) => {
        const { roll, pitch, timeBootMs } = telemetry.payload;

        if (roll !== undefined && pitch !== undefined && timeBootMs !== undefined) {
          y.push([roll * 180 / Math.PI, pitch * 180 / Math.PI]); // 라디안 -> 각도
          x.push(timeBootMs); // 시간 값을 x 배열에 저장
        }
      });

      // 보간을 위한 Interpolator 객체 생성
      setInterpolated(new Interpolator(x, y));
    }
  }, [flightData, robotId, operationId]);

  // 시간에 따른 roll, pitch, yaw 값 계산
  useEffect(() => {
    if (interpolated) {
      const rp = interpolated.at(time); // 지정된 시간에 해당하는 roll, pitch, yaw 값 계산
      setRoll(rp[0]);
      setPitch(rp[1]);
    }
  }, [time, interpolated]);

  // 로딩 중일 때
  if (isLoading) return <div>Loading...</div>;

  // 에러 처리
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  // 렌더링된 자세를 AttitudeIndicator에 전달
  return (
    <div
      id="attitudeViewer"
      className="relative w-[256px] h-[256px] bg-white p-4 rounded-md shadow-md">hello
      <div id="paneContent">
        <button
          className="absolute top-2 right-2 text-xl font-bold cursor-pointer"
          onClick={() => console.log("Close clicked")} // 닫기 기능 추가
        >
          X
        </button>
        <AttitudeIndicator roll={roll} pitch={pitch} />
      </div>
    </div>
  );
};

export default AttitudeViewer;
