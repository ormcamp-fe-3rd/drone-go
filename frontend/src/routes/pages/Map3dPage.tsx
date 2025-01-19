import { useState } from "react";

import DetailedDataHeader from "@/components/charts/DetailedDataHeader";
import ToolbarAttitude from "@/components/map/ToolbarAttitude";
import Map3D from "@/components/map3d/Map3D";
import MapSwitchButton from "@/components/map3d/MapSwitchButton";
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
          backgroundOpacity={60}
          isMapPage={true}
          selectedDrone={selectedDrone}
          setSelectedDrone={setSelectedDrone}
          selectedOperation={selectedOperation}
          setSelectedOperation={setSelectedOperation}
        />
        <MapSwitchButton />
        <ToolbarAttitude />
      </div>
      <Map3D />
    </div>
  );
}