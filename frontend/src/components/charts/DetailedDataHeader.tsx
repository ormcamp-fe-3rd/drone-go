import { ReactNode, useContext } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import SelectedDataContext from "@/contexts/SelectedDataContext";

import DropdownSection from "./DropdownSection";

interface Props {
  backgroundOpacity: number;
  children: ReactNode;
}

const DetailedDataHeader: React.FC<Props> = ({
  backgroundOpacity,
  children,
}) => {
  const {
    selectedDrone,
    selectedOperationAndDate,
    setSelectedDrone,
    setSelectedOperationAndDate,
  } = useContext(SelectedDataContext);


  return (
    <div
      className={`mx-10 my-5 flex flex-wrap items-center justify-evenly gap-1 rounded-[10px] border bg-white px-5 py-4 sm:justify-between md:flex-nowrap md:justify-evenly md:gap-4 md:px-5 bg-opacity-${backgroundOpacity}`}
    >
      <Button className="h-20 w-14 min-w-[56px]" variant="ghost">
        <Link to="/">
          <img
            src="/icons/Vector.svg"
            alt="Button Icon"
            className="h-20 w-14 object-contain"
          />
        </Link>
      </Button>
      <article className="min-w-[226px] md:w-2/3">
        <h1 className="text-2xl font-semibold md:text-3xl">Detailed Data</h1>
        <span className="hidden text-xs lg:block md:text-sm">
          Visualize drone data with interactive charts and maps. <br />
          Explore trends and movement patterns for the selected date.
        </span>
      </article>
      <div className="order-last mt-4 flex w-full justify-center md:order-none md:mt-0 md:w-auto">
        <DropdownSection
          selectedDrone={selectedDrone} // 상태 전달
          setSelectedDrone={setSelectedDrone} // 상태 전달
          selectedOperationAndDate={selectedOperationAndDate} // 상태 전달
          setSelectedOperationAndDate={setSelectedOperationAndDate} // 상태 전달
          className="flex-1"
        />
      </div>
      <div className="flex gap-4">
        {children}
      </div>
    </div>
  );
};

export default DetailedDataHeader;
