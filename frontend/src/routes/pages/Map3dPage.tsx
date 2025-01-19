import { useState } from "react";

import DetailedDataHeader from "@/components/charts/DetailedDataHeader";
import Map3D from "@/components/map3d/Map3D";
import { Operation,Robot } from "@/types/selectOptionsTypes";



export default function Map3dPage(){
  const [selectedDrone, setSelectedDrone] = useState<Robot | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(
      null,
  );
  
  return (
    <div>
      <div className="fixed z-10 w-screen">
        <DetailedDataHeader
          isMapPage={true}
          selectedDrone={selectedDrone}
          setSelectedDrone={setSelectedDrone}
          selectedOperation={selectedOperation}
          setSelectedOperation={setSelectedOperation}
        />
      </div>
      <Map3D />
    </div>
  );
}