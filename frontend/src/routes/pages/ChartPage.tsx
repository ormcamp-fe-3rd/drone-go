import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DropdownSection: React.FC = () => (
  <div className="flex gap-3 mx-3">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-#BBBBBF rounded-[8px] border"
        >
          DronType
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-[8px] bg-white">
        <DropdownMenuItem>1</DropdownMenuItem>
        <DropdownMenuItem>2</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-#BBBBBF rounded-[8px] border"
        >
          DATE / version
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-[8px] bg-white">
        <DropdownMenuItem>2025.01.01 / vo1</DropdownMenuItem>
        <DropdownMenuItem>2025.01.01 / vo1</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

const ChartCard: React.FC<{ title: string }> = ({ title }) => (
  <div className="h-[400px]">
    <h2>{title}</h2>
  </div>
);

const ChartPage: React.FC = () => {
  return (
    <>
      {/* 상단 */}
      <div className="mx-10 my-8 flex flex-row items-center justify-evenly gap-4 rounded-[10px] border px-5 py-4">
        {/* btn클릭 시 list 페이지로 */}
        <Button className="h-20 w-14 min-w-[56px]" variant="ghost">
          {/*드론 리스트 페이지로 이동*/}
          <Link to="/HomePage">
            <img
              src="/icons/ListPage.png"
              alt="Button Icon"
              className="object-contain h-20 w-14"
            />
          </Link>
        </Button>
        {/* text div*/}
        <article className="w-2/3 min-w-[226px]">
          <h1 className="text-3xl font-semibold">Detailed Data</h1>
          <span className="hidden text-sm sm:block">
            Visualize drone data with interactive charts and maps. <br />
            Exploretrends and movement patterns for the selected date.
          </span>
        </article>
        <DropdownSection />
        <Button className="h-16 w-16 min-w-[64px] rounded-[10px]">
          <img
            src="/icons/download.png"
            alt="Button Icon"
            className="object-contain w-16 h-16"
          />
        </Button>
        <Button className="h-16 w-16 min-w-[64px] rounded-[10px]">
          <img
            src="/icons/maps.png"
            alt="Button Icon"
            className="object-contain w-16 h-16"
          />
        </Button>
      </div>
      {/* 차트 및 데이터 값들 */}
      <div className="grid grid-cols-1 gap-3 mx-10 my-8 lg:grid-cols-2">
        <div className="flex h-[400px] gap-3">
          <div className="flex flex-col w-3/5">
            <h2 className="mx-10 my-5 text-2xl font-semibold">
              Name : 드론종류
            </h2>
            <div className="mx-5 h-[300px]">drone img</div>
          </div>
          <div className="flex h-[400px] w-2/5 flex-col gap-3">
            <div className="flex flex-col justify-around gap-1 h-2/5">
              <div className="flex items-center">
                <div className="mx-2 my-2">
                  <img
                    src="/icons/time.png"
                    alt="Button Icon"
                    className="object-contain"
                  />
                </div>
                <h2>Flight time</h2>
              </div>
              <div className="h-[100px]">
                {/* 시간 데이터들 보여지는 부분*/}
              </div>
            </div>
            <div className="flex flex-col justify-around gap-1 h-3/5">
              <div className="flex items-center">
                <div className="mx-2 my-2">
                  <img
                    src="/icons/setting-error.png"
                    alt="Button Icon"
                    className="object-contain"
                  />
                </div>
                <h2>State</h2>
              </div>
              <div className="h-[170px]">
                {/* 상태 데이터들 보여지는 부분*/}
              </div>
            </div>
          </div>
        </div>
        <ChartCard title="chart1" />
        <ChartCard title="chart2" />
        <ChartCard title="chart3" />
      </div>
    </>
  );
};

export default ChartPage;
