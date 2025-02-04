import { useContext, useEffect, useRef, useState } from "react";
import { PhaseContext } from "@/contexts/PhaseContext";
import { useCurrentTime } from "@/contexts/CurrentTimeContext";
import { formatTime } from "@/utils/formatTime";

interface Prop {
  flightStartTime: number;
  duration: number;
}

const PlayHead = ({ flightStartTime, duration }: Prop) => {
  const isDraggingRef = useRef(false);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const { phase, setPhase } = useContext(PhaseContext);
  const { setCurrentTime } = useCurrentTime(); // 추가된 부분
  const [timeStamp, setTimeStamp] = useState("");

  useEffect(() => {
    const phaseTime = phase * duration * 1000;
    const totalTimeStamp = phaseTime + flightStartTime;
    setTimeStamp(formatTime(new Date(totalTimeStamp))); // HH:mm:ss

    // 현재 재생 시간을 Context에 업데이트
    setCurrentTime(totalTimeStamp);
  }, [phase, duration, flightStartTime, setCurrentTime]);

  useEffect(() => {
    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [setPhase]);

  useEffect(() => {
    if (!progressBarRef.current) return;
    const progressBarWidth =
      progressBarRef.current.getBoundingClientRect().width;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !progressBarRef.current) return;
      let movedX =
        e.clientX - progressBarRef.current.getBoundingClientRect().left;
      movedX = Math.max(0, Math.min(movedX, progressBarWidth));

      const newX = movedX / progressBarWidth;
      setPhase(Math.min(1, Math.max(0, newX)));
    };
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDraggingRef, setPhase]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    e.preventDefault();
  };

  return (
    <div className="h-full w-full" ref={progressBarRef}>
      <div className="" style={{ transform: `translateX(${phase * 100}%)` }}>
        <div className="absolute bottom-[20px] h-[33px] w-[100px] -translate-x-1/2 transform rounded-[10px] bg-white bg-opacity-50 text-center text-[14px] leading-[33px] text-[#28282C]">
          {timeStamp}
        </div>
        <div
          className="absolute h-8 w-8 -translate-x-1/2 -translate-y-[12px] hover:scale-110"
          onMouseDown={handleMouseDown}
        >
          <img src="/icons/playHead.svg" className="h-full w-full" />
        </div>
      </div>
    </div>
  );
};

export default PlayHead;