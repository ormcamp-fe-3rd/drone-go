import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ChartPage: React.FC = () => {
  return (
    <>
      {/* 상단 */}
      <div className="flex flex-row items-center gap-4 px-5 py-4 mx-10 my-8 border border-black justify-evenly">
        {/* btn클릭 시 list 페이지로 */}
        <Button variant="outline" className="w-12 h-16">
          list
        </Button>
        {/* text div*/}
        <div className="w-2/3 min-w-[226px]">
          <h1 className="text-3xl font-semibold">Detailed Data</h1>
          <span className="text-sm">
            Visualize drone data with interactive charts and maps. <br />
            Exploretrends and movement patterns for the selected date.
          </span>
        </div>
        {/* dropbox div*/}
        <div className="flex gap-3 mx-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">DronType</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>1</DropdownMenuItem>
              <DropdownMenuItem>2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">DATE / version</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>2025.01.01 / vo1</DropdownMenuItem>
              <DropdownMenuItem>2025.01.01 / vo1</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button variant="outline" className="w-16 h-16">
          down
        </Button>
        <Button variant="outline" className="w-16 h-16">
          map
        </Button>
      </div>
      {/* 차트 및 데이터 값들 */}
      <div className="grid grid-cols-1 gap-3 mx-10 my-8 border border-black lg:grid-cols-2">
        <div className="flex h-[400px] gap-3 border border-black">
          <div className="flex flex-col w-3/5 border-2 border-amber-600">
            <h2 className="mx-10 my-5 text-2xl font-semibold">
              Name : 드론종류
            </h2>
            <img className="mx-5 h-[300px] border-2 border-teal-300"></img>
          </div>
          <div className="flex h-[400px] w-2/5 flex-col gap-3 border-4 border-lime-600">
            <div className="flex flex-col gap-2 border-2 h-2/5 border-amber-600">
              <div className="flex items-center">
                <div className="mx-2 my-2 border border-emerald-600">icon</div>
                <h2>Flight time</h2>
              </div>
              <div className="h-[90px] border-2 border-blue-400">
                {/* 시간 데이터들 보여지는 부분*/}
              </div>
            </div>
            <div className="flex flex-col gap-2 border-2 h-3/5 border-amber-600">
              <div className="flex items-center">
                <div className="mx-2 my-2 border border-emerald-600">icon</div>
                <h2>State</h2>
              </div>
              <div className="h-[160px] border-2 border-blue-400">
                {/* 상태 데이터들 보여지는 부분*/}
              </div>
            </div>
          </div>
        </div>
        <div className="h-[400px] border border-black">
          <h2>chart1</h2>
        </div>
        <div className="h-[400px] border border-black">
          <h2>chart2</h2>
        </div>
        <div className="h-[400px] border border-black">
          <h2>chart3</h2>
        </div>
      </div>
    </>
  );
};

export default ChartPage;
