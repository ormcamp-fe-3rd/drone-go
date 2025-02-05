import { createContext, useContext, useState } from "react";

interface CurrentTimeContextType {
  currentTime: number;
  setCurrentTime: (time: number) => void;
}

// 초기값 설정
const CurrentTimeContext = createContext<CurrentTimeContextType | undefined>(
  undefined,
);

// Context Provider 생성
export const CurrentTimeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <CurrentTimeContext.Provider value={{ currentTime, setCurrentTime }}>
      {children}
    </CurrentTimeContext.Provider>
  );
};

// 커스텀 훅
export const useCurrentTime = () => {
  const context = useContext(CurrentTimeContext);
  if (!context) {
    throw new Error("useCurrentTime must be used within a CurrentTimeProvider");
  }
  return context;
};
