import { createContext, useState } from "react";

interface PhaseContextProps {
  phase: number;
  setPhase: React.Dispatch<React.SetStateAction<number>>;
}

export const PhaseContext = createContext<PhaseContextProps>({
  phase: 0,
  setPhase: () => {},
});

const PhaseContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [phase, setPhase] = useState<number>(0);

  return (
    <PhaseContext.Provider value={{ phase, setPhase }}>
      {children}
    </PhaseContext.Provider>
  );
};

export default PhaseContextProvider;