import React, { useState, useEffect } from 'react';
import { AttitudeIndicator } from 'react-typescript-flight-indicators';
import { TelemetryAttitudeData } from '@/types/telemetryAttitudeDataTypes';

interface AttitudeViewerProps {
  robotId: string;
  operationId: string;
  attitudeData: TelemetryAttitudeData[];
}

// Interpolator 클래스: 특정 시간에 맞는 roll, pitch 값을 보간
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
    // 변환식: 라디안에서 각도로 변환
    const roll = this.y[this.currentIndex][0] * 180 / Math.PI;
    const pitch = this.y[this.currentIndex][1] * 180 / Math.PI;

    return [roll, pitch];
  }
}

const AttitudeViewer: React.FC<AttitudeViewerProps> = ({ attitudeData }) => {
  const [roll, setRoll] = useState<number>(0);
  const [pitch, setPitch] = useState<number>(0);
  const [interpolated, setInterpolated] = useState<Interpolator | null>(null);
  const [time, _setTime] = useState<number>(0);

  // 보간 및 각도 계산을 위한 데이터 처리
  useEffect(() => {
    if (attitudeData.length > 0) {
      let x: number[] = [];
      let y: number[][] = [];

      // attitudeData에서 roll, pitch, timeBootMs 추출
      attitudeData.forEach((telemetry: TelemetryAttitudeData) => {
        const { roll, pitch, timeBootMs } = telemetry.payload;

        if (roll !== undefined && pitch !== undefined && timeBootMs !== undefined) {
          y.push([roll, pitch]);
          x.push(timeBootMs);
        }
      });

      if (x.length > 0 && y.length > 0) {
        setInterpolated(new Interpolator(x, y));
      }
    }
  }, [attitudeData]);

  // 시간에 따른 roll, pitch 값 계산
  useEffect(() => {
    if (interpolated && time >= 0) {
      const rp = interpolated.at(time);
      setRoll(rp[0]);
      setPitch(rp[1]);
    }
  }, [time, interpolated]);

  // // 시간이 업데이트 될 때마다 roll, pitch 값을 재계산
  // const handleTimeChange = (newTime: number) => {
  //   setTime(newTime);
  // };

  return (
    <div className="relative w-[80px] h-[80px] p-2 shadow-md">
        
        {attitudeData.length > 0 ? (
          <AttitudeIndicator
            roll={roll}
            pitch={pitch}
            showBox={false}
          />
        ) : (
          <div>No attitude data available</div>
        )}
      
    </div>
  );
};

export default AttitudeViewer;


