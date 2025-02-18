import { useEffect, useRef, useState } from "react";

import { FormattedTelemetryPositionData } from "@/types/telemetryPositionDataTypes"
import { formatTime } from "@/utils/formatTime";

interface Props {
  positionData: FormattedTelemetryPositionData[] | null;
  onUpdate: (progress: number) => void;
}

export const useAnimationTime = ({positionData, onUpdate}: Props) => {
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [startEndTime, setStartEndTime] = useState<{
    startTime: string;
    endTime: string;
  }>({ startTime: "", endTime: "" });
  const [flightStartTime, setFlightStartTime] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const elapsedTimeRef = useRef<number>(0);  
  const speedRef = useRef(1);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
      lastTimeRef.current = 0;
      elapsedTimeRef.current = 0;
      setIsPlaying(false);
    };
  }, []);
  
  useEffect(() => {
    if (!positionData) return;

    const flightStart = positionData[0].timestamp;
    const flightEnd = positionData[positionData?.length - 1].timestamp;
    setFlightStartTime(flightStart);
    setStartEndTime({
      startTime: formatTime(new Date(flightStart)),
      endTime: formatTime(new Date(flightEnd)),
    });
    setTotalDuration((flightEnd - flightStart) / 1000);
  },[positionData]);

  const animate = (currentTime: number) => {
    if (!totalDuration) return;

    if (!lastTimeRef.current) {
      lastTimeRef.current = currentTime;
    }

    const deltaTime = currentTime - lastTimeRef.current;
    elapsedTimeRef.current += deltaTime * speedRef.current;
    lastTimeRef.current = currentTime;

    const animationDuration = totalDuration * 1000;
    const progress = Math.min(1, elapsedTimeRef.current / animationDuration);
    onUpdate(progress);

    if (progress >= 1) {
      setIsPlaying(false);
      onUpdate(0);
      lastTimeRef.current = 0;
      elapsedTimeRef.current = 0;
      return;
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    lastTimeRef.current = 0;
    animationRef.current = requestAnimationFrame(animate);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      lastTimeRef.current = 0;
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    onUpdate(0);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      lastTimeRef.current = 0;
    }
  };

  const handlePlaySpeed = (value: string) => {
    setSpeed(Number(value));
    speedRef.current = Number(value);
  };

  return {
    isPlaying,
    speed,
    elapsedTimeRef,
    handlePlay,
    handlePause,
    handleStop,
    handlePlaySpeed,
    
    totalDuration,
    startEndTime,
    flightStartTime,
  }
}