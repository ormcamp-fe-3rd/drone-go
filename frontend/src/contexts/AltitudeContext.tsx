import { createContext, useState } from "react";

interface AltitudeContextProps {
  altitude: number;
  setAltitude: React.Dispatch<React.SetStateAction<number>>;
}

export const AltitudeContext = createContext<AltitudeContextProps>({
  altitude: 0,
  setAltitude: () => {},
});

const AltitudeContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [altitude, setAltitude] = useState<number>(0);

  return (
    <AltitudeContext.Provider value={{ altitude, setAltitude }}>
      {children}
    </AltitudeContext.Provider>
  );
};

export default AltitudeContextProvider;
