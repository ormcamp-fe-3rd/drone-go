import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AttitudeIndicator } from 'react-typescript-flight-indicators';

interface AttitudeViewerProps {
  robotId: string;
  operationId: string;
}

class Interpolator {
  private x: number[];
  private y: number[];
  private currentIndex: number;

  constructor(x: number[], y: number[]) {
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
    return this.y[Math.max(0, Math.min(this.currentIndex, this.y.length - 1))];
  }
}

const AttitudeViewer: React.FC<AttitudeViewerProps> = ({ robotId, operationId }) => {
  const [roll, setRoll] = useState<number>(0);
  const [pitch, setPitch] = useState<number>(0);
  const [yaw, setYaw] = useState<number>(0);
  const [interpolated, setInterpolated] = useState<Interpolator | null>(null);
  const [time, setTime] = useState<number>(0);

  // 서버에서 데이터를 가져오는 React Query 훅
  const { data: flightData, isLoading, error } = useQuery({
    queryKey: ['flightData', robotId, operationId], // queryKey는 배열로 전달
    queryFn: async () => {
      const response = await fetch(`/api/flightData?robotId=${robotId}&operationId=${operationId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.telemetries; // 'telemetries' 데이터를 반환
    },
    // 추가적인 옵션들 (에러 및 리페치 설정 등) 필요시 여기에 추가 가능
  });

  useEffect(() => {
    if (flightData) {
      let x: number[] = [];
      let y: number[] = [];

      // 'telemetries' 데이터에서 roll, pitch, yaw 값을 추출하여 x, y 배열에 저장
      flightData.forEach((telemetry: any) => {
        // msgId 30인 데이터에서 roll, pitch, yaw 값 추출
        if (telemetry.msgId === 30) {
          const payload = telemetry.payload;
          const timeBootMs = payload.timeBootMs;
          const roll = payload.roll;
          const pitch = payload.pitch;
          const yaw = payload.yaw;

          if (roll !== undefined && pitch !== undefined && yaw !== undefined) {
            // roll, pitch, yaw 값을 y 배열에 저장 (각각 -180에서 180 범위로 변환 가능)
            y.push([roll * 180 / Math.PI, pitch * 180 / Math.PI, yaw * 180 / Math.PI]); // roll, pitch, yaw 값은 라디안 -> 각도로 변환하여 저장
          }

          if (timeBootMs !== undefined) {
            x.push(timeBootMs); // x 배열에 시간 값 저장
          }
        }
      });

      // 보간을 위한 Interpolator 객체 생성
      setInterpolated(new Interpolator(x, y));
    }
  }, [flightData]);

  useEffect(() => {
    if (interpolated) {
      const rp = interpolated.at(time); // 지정된 시간에 해당하는 roll, pitch, yaw 값 계산
      setRoll(rp[0]);
      setPitch(rp[1]);
      setYaw(rp[2]);
    }
  }, [time, interpolated]);

  const handleTimeChange = (newTime: number) => {
    setTime(newTime); // 시간을 변경하여 roll, pitch, yaw 값 갱신
  };

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>; // 에러 처리

  return (
    <div id="attitudeViewer">
      <AttitudeIndicator roll={roll} pitch={pitch} />
    </div>
  );
};

export default AttitudeViewer;
