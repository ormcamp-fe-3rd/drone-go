import { useState } from "react";
import { WidgetData } from "@/types/widgetDataTypes";
import toolbarWidgetData from "../../data/toolbarWidgetData.json"

/** 컴포넌트 */
import DetailedDataHeader from '@/components/charts/DetailedDataHeader';
import ToolbarWidget from "@/components/map/ToolbarWidget";
import ToolbarAttitude from "@/components/map/ToolbarAttitude";
import ProgressBar from "@/components/map/ProgressBar";

const MapPage: React.FC = () => {
  
  const [widgetData, _setWidgetData] = useState<WidgetData[]>(toolbarWidgetData);
  
  return (
    <div className="w-full h-full m-0 bg-lime-600 box-border">

      <DetailedDataHeader />

      <section className="toolbar grid justify-start m-4 gap-4">
        
        <ToolbarAttitude />

        <div className="toolbar-variation w-full flex flex-col space-y-4">
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
      </section>

      <ProgressBar />

    </div>
  );
};

export default MapPage;






















