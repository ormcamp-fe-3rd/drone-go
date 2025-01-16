import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import DetailedDataHeader from "../../components/charts/DetailedDataHeader";
import { Robot, Operation } from "../../types/selectOptionsTypes";

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="h-[400px] rounded-[10px] border border-[#B2B2B7] bg-white">
    <h2>{title}</h2>
    {children}
  </div>
);

const ChartPage: React.FC = () => {
  const location = useLocation();
  // 현재 URL이 "/map"인지 확인
  const isMapPage = location.pathname === "/map";

  const [selectedDrone, setSelectedDrone] = useState<Robot | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-[#F3F2F9]">
      <DetailedDataHeader
        isMapPage={isMapPage}
        selectedDrone={selectedDrone}
        setSelectedDrone={setSelectedDrone}
      />
      <div className="grid grid-cols-1 gap-3 mx-10 mb-10 lg:grid-cols-2">
        <div className="flex h-[400px] gap-3">
          <div className="flex w-3/5 flex-col rounded-[10px] border border-[#B2B2B7] bg-white">
            <h2 className="mx-10 my-5 text-2xl font-semibold">
              Name : {selectedDrone ? selectedDrone.name : "Drone Name"}
            </h2>
            <div className="mx-5 h-[300px]">drone img</div>
          </div>
          <div className="flex h-[400px] w-2/5 flex-col gap-3">
            <div className="flex h-2/5 flex-col justify-around gap-1 rounded-[10px] border border-[#B2B2B7] bg-white">
              <div className="flex items-center">
                <div className="mx-2 my-2">
                  <img
                    src="/icons/time.svg"
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
            <div className="flex h-3/5 flex-col justify-around gap-1 rounded-[10px] border border-[#B2B2B7] bg-white">
              <div className="flex items-center">
                <div className="mx-2 my-2">
                  <img
                    src="/icons/setting-error.svg"
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
        <ChartCard title="chart1">{/* <TelemetryChart /> */}</ChartCard>
        <ChartCard title="chart2">
          <div />
        </ChartCard>
        <ChartCard title="chart3">
          <div />
        </ChartCard>
      </div>
    </div>
  );
};

export default ChartPage;
