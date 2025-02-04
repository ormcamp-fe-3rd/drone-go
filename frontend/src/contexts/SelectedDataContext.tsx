import { createContext } from "react";

import { OperationAndDate } from "@/types/operationAndDate";
import { Robot } from "@/types/selectOptionsTypes";


interface SelectedDataContextProps {
  selectedDrone: Robot | null;
  selectedOperationAndDate: OperationAndDate | null;
  setSelectedDrone: React.Dispatch<React.SetStateAction<Robot | null>>;
  setSelectedOperationAndDate: React.Dispatch<React.SetStateAction<OperationAndDate|null>>;
}

const SelectedDataContext = createContext<SelectedDataContextProps>({
  selectedDrone: null,
  selectedOperationAndDate: null,
  setSelectedDrone: () => {},
  setSelectedOperationAndDate: () => {},
});

export default SelectedDataContext;