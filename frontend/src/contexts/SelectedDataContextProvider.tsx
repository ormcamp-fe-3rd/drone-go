import { useState } from "react";

import { OperationAndDate } from "@/types/operationAndDate";
import { Robot } from "@/types/selectOptionsTypes";

import SelectedDataContext from "./SelectedDataContext";

const SelectedDataContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedDrone, setSelectedDrone] = useState<Robot | null>(null);
  const [selectedOperationAndDate, setSelectedOperationAndDate] =
    useState<OperationAndDate | null>(null);

  return (
    <SelectedDataContext.Provider
      value={{
        selectedDrone,
        selectedOperationAndDate,
        setSelectedDrone,
        setSelectedOperationAndDate,
      }}
    >
      {children}
    </SelectedDataContext.Provider>
  );
};

export default SelectedDataContextProvider;
