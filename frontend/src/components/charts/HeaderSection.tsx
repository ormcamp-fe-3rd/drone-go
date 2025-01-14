import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import DropdownSection from "./DropdownSection";

const HeaderSection = () => {
  const location = useLocation();
  // 현재 URL에 따라 버튼 텍스트 및 아이콘 변경
  const isMapPage = location.pathname === "/map"; // 예시 URL: "/map"

  return (
    <div className="mx-10 my-8 flex flex-row flex-wrap items-center justify-evenly gap-1 rounded-[10px] border bg-white px-5 py-4 sm:justify-between md:flex-nowrap md:justify-evenly md:gap-4 md:px-5">
      <Button className="h-20 w-14 min-w-[56px]" variant="ghost">
        <Link to="/">
          <img
            src="/icons/ListPage.png"
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
        <DropdownSection className="flex-1" />
      </div>
      <div className="flex flex-row gap-4">
        <Button className="h-16 w-16 min-w-[64px] rounded-[10px] bg-white">
          <img
            src="/icons/download.png"
            alt="Button Icon"
            className="object-contain w-16 h-16"
          />
        </Button>
        {isMapPage ? (
          <Link to="/chart">
            <Button className="h-16 w-16 min-w-[64px] rounded-[10px] bg-white">
              <img
                src="/icons/charts.png"
                alt="Charts Icon"
                className="object-contain w-16 h-16"
              />
            </Button>
          </Link>
        ) : (
          <Link to="/map">
            <Button className="h-16 w-16 min-w-[64px] rounded-[10px] bg-white">
              <img
                src="/icons/maps.png"
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

export default HeaderSection;
