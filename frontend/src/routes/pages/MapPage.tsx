import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Robot, Operation } from "../../types/selectOptionsTypes";
import { WidgetData } from "@/types/widgetDataTypes";
import toolbarWidgetData from "../../data/toolbarWidgetData.json"

/** 컴포넌트 */
import DetailedDataHeader from '@/components/charts/DetailedDataHeader';
import ToolbarWidget from "@/components/map/ToolbarWidget";
import ToolbarAttitude from "@/components/map/ToolbarAttitude";
import ProgressBar from "@/components/map/ProgressBar";
import MapSwitchButton from "@/components/map3d/MapSwitchButton";

const MapPage: React.FC = () => {
  
  const [widgetData, _setWidgetData] = useState<WidgetData[]>(toolbarWidgetData);

  const location = useLocation();
  // 현재 URL이 "/map"인지 확인
  const isMapPage = location.pathname === "/map";

  const [selectedDrone, setSelectedDrone] = useState<Robot | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(
    null,
  );
  
  return (
    <div className="m-0 box-border h-full w-full bg-lime-600">
      <DetailedDataHeader
        backgroundOpacity={60}
        isMapPage={isMapPage}
        selectedDrone={selectedDrone}
        setSelectedDrone={setSelectedDrone}
        selectedOperation={selectedOperation}
        setSelectedOperation={setSelectedOperation}
      />
      <section className="toolbar m-4 grid justify-start gap-4">
        <ToolbarAttitude />
        <div className="toolbar-variation flex w-full flex-col space-y-4">
          {widgetData.map((widget, index) => (
            <ToolbarWidget
              key={index}
              icon={widget.icon}
              title={widget.title}
              dataValues={widget.dataValues}
              stateValues={widget.stateValues}
            />
          ))}
        </div>
        <div className="fixed right-10">
          <MapSwitchButton />
        </div>
      </section>

      <ProgressBar />
    </div>
  );
};

export default MapPage;






















