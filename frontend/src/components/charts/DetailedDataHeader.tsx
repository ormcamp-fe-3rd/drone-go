import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import DropdownSection from "./DropdownSection";
import { Robot } from "../../types/selectOptionsTypes";
interface OperationAndDate {
  operationId: string;
  date: string;
  name: string;
}
interface Props {
  isMapPage: boolean;
  selectedDrone: Robot | null;
  setSelectedDrone: React.Dispatch<React.SetStateAction<Robot | null>>;
  selectedOperationAndDate: OperationAndDate | null;
  setSelectedOperationAndDate: React.Dispatch<
    React.SetStateAction<OperationAndDate | null>
  >;
  backgroundOpacity: number;
}

const DetailedDataHeader: React.FC<Props> = ({
  isMapPage,
  selectedDrone,
  setSelectedDrone,
  selectedOperationAndDate,
  setSelectedOperationAndDate,
  backgroundOpacity,
}) => {
  return (
    <div
      className={`mx-10 my-5 flex flex-wrap items-center justify-evenly gap-1 rounded-[10px] border bg-white px-5 py-4 sm:justify-between md:flex-nowrap md:justify-evenly md:gap-4 md:px-5 bg-opacity-${backgroundOpacity}`}
    >
      <Button className="h-20 w-14 min-w-[56px]" variant="ghost">
        <Link to="/">
          <img
            src="/icons/Vector.svg"
            alt="Button Icon"
            className="object-contain h-20 w-14"
          />
        </Link>
      </Button>
      <article className="min-w-[226px] md:w-2/3">
        <h1 className="text-2xl font-semibold md:text-3xl">Detailed Data</h1>
        <span className="hidden text-xs md:block md:text-sm">
          Visualize drone data with interactive charts and maps. <br />
          Explore trends and movement patterns for the selected date.
        </span>
      </article>
      <div className="flex justify-center order-last w-full mt-4 md:order-none md:mt-0 md:w-auto">
        <DropdownSection
          selectedDrone={selectedDrone} // 상태 전달
          setSelectedDrone={setSelectedDrone} // 상태 전달
          selectedOperationAndDate={selectedOperationAndDate} // 상태 전달
          setSelectedOperationAndDate={setSelectedOperationAndDate} // 상태 전달
          className="flex-1"
        />
      </div>
      <div className="flex gap-4">
        <Button className="h-16 w-16 min-w-[64px] rounded-[10px] bg-white">
          <img
            src="/icons/download.svg"
            alt="Button Icon"
            className="object-contain w-16 h-16"
          />
        </Button>
        {isMapPage ? (
          <Link to="/chart">
            <Button className="h-16 w-16 min-w-[64px] rounded-[10px] bg-white">
              <img
                src="/icons/charts.svg"
                alt="Charts Icon"
                className="object-contain w-16 h-16"
              />
            </Button>
          </Link>
        ) : (
          <Link to="/map">
            <Button className="h-16 w-16 min-w-[64px] rounded-[10px] bg-white">
              <img
                src="/icons/maps.svg"
                alt="Maps Icon"
                className="object-contain w-16 h-16"
              />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default DetailedDataHeader;
