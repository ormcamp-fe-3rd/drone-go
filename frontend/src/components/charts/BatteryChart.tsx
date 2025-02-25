import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { ProcessedTelemetryBatteryData } from "../../types/telemetryBatteryDataTypes";
import { format } from "date-fns";

interface ChartProps {
  data: ProcessedTelemetryBatteryData[];
}

const formatBatteryValue = (
  value: number,
  type: "temperature" | "battery" | "voltage",
): string => {
  if (type === "battery") {
    const bayyeryvalue = value / 100;
    return bayyeryvalue.toFixed(2);
  }

  const scaledValue = value / 1000;

  return scaledValue.toFixed(2);
};

const BatteryChart: React.FC<ChartProps> = ({ data }) => {
  const chartSeries = [
    {
      name: "Temperature (°C)",
      data: data.map((item) => item.temperature),
      type: "line",
    },
    {
      name: "Battery Remaining (%)",
      data: data.map((item) => item.batteryRemaining),
      type: "area",
    },
    {
      name: "Voltage (V)",
      data: data.map((item) => item.voltage),
      type: "line",
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
      },
    },
    fill: {
      type: "solid",
      opacity: [1, 0.2, 1], // 각 시리즈의 투명도를 배열로 설정
    },
    grid: {
      padding: {
        top: 10, // 차트 상단 여백
        bottom: 35, // 차트 하단 여백
        left: 20, // 차트 왼쪽 여백
        right: 20, // 차트 오른쪽 여백
      },
    },
    stroke: {
      show: true,
      curve: "smooth", // 전체 라인을 부드럽게 표시
      //curve: ['straight', 'smooth', 'monotoneCubic', 'stepline']
      dashArray: 0,
    },
    title: {
      text: "Drone Battery Status", // 차트 타이틀 텍스트
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
    yaxis: [
      {
        title: {
          text: "Temperature (°C)", // 첫 번째 y축의 타이틀
          style: {
            color: "#757de8", // 타이틀 색상
          },
        },
        labels: {
          style: {
            colors: "#757de8", // 첫 번째 y축 라벨 색상
          },
          formatter: function (value: number) {
            return formatBatteryValue(value, "temperature");
          },
        },
        tickAmount: 10, // 10개의 눈금을 표시하여 촘촘하게
        min: 0,
      },
      {
        opposite: true, // 두 번째 y축은 오른쪽에 표시
        title: {
          text: "Battery Remaining (%)", // 두 번째 y축의 타이틀
          style: {
            color: "#4fc3f7", // 타이틀 색상
          },
        },
        labels: {
          style: {
            colors: "#4fc3f7", // 두 번째 y축 라벨 색상
          },
          formatter: function (value: number) {
            return formatBatteryValue(value, "battery");
          },
        },
        tickAmount: 5, // 10개의 눈금을 표시하여 촘촘하게
        min: 0,
      },
      {
        // 세 번째 y축은 왼쪽 표시
        title: {
          text: "Voltage (V)", // 세 번째 y축의 타이틀
          style: {
            color: "#66bb6a", // 타이틀 색상
          },
        },
        labels: {
          style: {
            colors: "#66bb6a", // 타이틀 색상
          },
          formatter: function (value: number) {
            return formatBatteryValue(value, "voltage");
          },
        },
        tickAmount: 10,
        min: 0,
      },
    ],
    theme: {
      palette: "palette2",
    },
    markers: {
      size: 0, // 마커를 제거
    },
    tooltip: {
      shared: true,
      intersect: false,
      x: {
        formatter: function (value: number) {
          return format(new Date(value), "yyyy-MM-dd HH:mm:ss"); // 날짜와 시간 표시
        },
      },
      y: {
        formatter: function (value: number, { seriesIndex }: any) {
          const types = ["temperature", "battery", "voltage"];
          return formatBatteryValue(value, types[seriesIndex] as any);
        },
      },
    },
  };

  return (
    <div className="mr-2 h-full">
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="line"
        height="100%"
      />
    </div>
  );
};

export default BatteryChart;
