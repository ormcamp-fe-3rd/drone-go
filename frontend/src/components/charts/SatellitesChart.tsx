import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { ProcessedTelemetrySatellitesData } from "../../types/telemetrySatellitesDataTypes";
import { format } from "date-fns";

interface ChartProps {
  data: ProcessedTelemetrySatellitesData[];
}

const SatellitesChart: React.FC<ChartProps> = ({ data }) => {
  const chartSeries = [
    {
      name: "Satellites_Visible",
      data: data.map((item) => item.payload.satellitesVisible),
    },
  ];
  const chartOptions: ApexOptions = {
    chart: {
      width: "100%",
      height: "100%",
      type: "line",
      background: "#ffffff",
      toolbar: {
        show: true, // 툴바 표시 여부
        tools: {
          zoom: true, // 확대 툴
          zoomin: true, // 확대 버튼
          zoomout: true, // 축소 버튼/images/chart/drone1.svg
          download: true, // 이미지 다운로드 버튼
          pan: true, // 팬 이동 가능 여부
          reset: true, // 차트 초기화 버튼
          selection: true, // 선택 도구 활성화 여부
        },
      },
    },
    grid: {
      padding: {
        left: 55, // 차트 왼쪽 여백
        right: 30, // 차트 오른쪽 여백
        bottom: 40,
      },
    },
    stroke: {
      show: true,
      curve: "smooth", // 전체 라인을 부드럽게 표시
      dashArray: 0,
    },
    title: {
      text: "Drone Satellites", // 차트 타이틀 텍스트
      align: "left", // 타이틀의 정렬 (center로 설정)
      margin: 5, // 타이틀과 차트 간 여백
      offsetX: 20, // X축 기준으로 타이틀 위치 조정
      style: {
        fontSize: "16px", // 타이틀 텍스트 크기
        color: "#000", // 타이틀 색상
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        show: true,
        formatter: function (value: string) {
          return format(new Date(Number(value)), "HH:mm:ss"); // 포맷을 "HH:mm:ss"로 설정
        },
      },
      categories: data.map((item) => item.timestamp.toString()),

      floating: true, // 플로팅 설정으로 가로 스크롤 가능
    },
    yaxis: {
      title: {
        text: "Satellites_Visible", // 첫 번째 y축의 타이틀
        offsetX: -10,
      },
      labels: {
        offsetX: 35,
        formatter: function (value: number) {
          return Math.round(value).toString();
        },
      },
      tickAmount: 10, // 10개의 눈금을 표시하여 촘촘하게
      min: 0,
      max: 20,
    },

    theme: {
      palette: "palette2",
    },
    markers: {
      size: 0, // 마커를 제거
    },
    fill: {
      type: "gradient",
      gradient: { gradientToColors: ["#0be881"], stops: [0, 100] },
    },
    legend: {
      showForSingleSeries: true,
    },
  };

  return (
    <div className="mr-2">
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="line"
        height={350}
      />
    </div>
  );
};

export default SatellitesChart;
