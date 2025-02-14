import { useRef,useState } from "react";

interface AnimationOption{
  duration: number;
  onUpdate: (progress:number) => void;
}

export const useAnimation =({duration, onUpdate}:AnimationOption) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const elapsedTimeRef = useRef<number>(0);  
  const speedRef = useRef(1);

  const animate =(currentTime: number) => {
    if(!duration) return;

    if(!lastTimeRef.current){
      lastTimeRef.current = currentTime;
    }

    const deltaTime = currentTime - lastTimeRef.current;
    elapsedTimeRef.current += deltaTime * speedRef.current;
    lastTimeRef.current = currentTime;

    const animationDuration = duration * 1000;
    const progress = Math.min(1, elapsedTimeRef.current / animationDuration);
    onUpdate(progress);

    if(progress >= 1){
      setIsPlaying(false);
      onUpdate(0);
      lastTimeRef.current = 0;
      elapsedTimeRef.current = 0;
      return;
    }

    animationRef.current = requestAnimationFrame(animate);
  }

  const handlePlay = () => {
    setIsPlaying(true);
    lastTimeRef.current = 0;
    animationRef.current = requestAnimationFrame(animate);
  }

  const handlePause = () => {
    setIsPlaying(false);
    if(animationRef.current){
      cancelAnimationFrame(animationRef.current);
      lastTimeRef.current = 0;
    }
  }

  const handleStop = () => {
    setIsPlaying(false);
    onUpdate(0);
    if(animationRef.current){
      cancelAnimationFrame(animationRef.current);
      lastTimeRef.current = 0;
    }
  }

  const handlePlaySpeed = (value: string) => {
    setSpeed(Number(value));
    speedRef.current = Number(value);
  }

  return{
    isPlaying,
    speed,
    elapsedTimeRef,
    handlePlay,
    handlePause,
    handleStop,
    handlePlaySpeed
  }
}