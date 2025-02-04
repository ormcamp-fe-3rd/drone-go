import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { format } from "date-fns";
import { AltAndSpeedData } from "@/types/altAndspeedDataType";

interface ChartProps {
  data: AltAndSpeedData[];
}

const AltAndSpeedChart: React.FC<ChartProps> = ({ data }) => {
  const convertSpeedToKmh = (speed: number) => {
    const speedKmh = speed * 3.6; // m/s를 km/h로 변환
    return parseFloat(speedKmh.toFixed(2)); // 소수점 둘째 자리까지 반올림
  };

  const convertAltToKmh = (alt: number) => {
    const altKm = alt / 1000; // 미터를 킬로미터로 변환
    return parseFloat(altKm.toFixed(2)); // 소수점 둘째 자리까지 반올림
  };

  // timestamp를 밀리초 단위의 숫자로 변환
  const timestamps = data.map((item) => new Date(item.timestamp).getTime());

  const chartSeries = [
    {
      name: "Alt",
      data: data.map((item, index) => ({
        x: timestamps[index],
        y: convertAltToKmh(item.payload.alt || 0),
      })),
      type: "line",
    },
    {
      name: "Speed",
      data: data.map((item, index) => ({
        x: timestamps[index],
        y: convertSpeedToKmh(item.payload.groundspeed || 0),
      })),
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
      opacity: [1, 1], // 각 시리즈의 투명도를 배열로 설정
    },
    grid: {
      padding: {
        top: 10, // 차트 상단 여백
        bottom: 15, // 차트 하단 여백
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
      text: "Drone Alt and Speed", // 차트 타이틀 텍스트
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
        datetimeUTC: false,
        format: "HH:mm:ss", // 밀리초까지 표시
        formatter: function (value: string) {
          return format(new Date(value), "HH:mm:ss");
        },
      },
    },
    yaxis: [
      {
        title: {
          text: "Alt", // 첫 번째 y축의 타이틀
          style: {
            color: "#757de8", // 타이틀 색상
          },
        },
        labels: {
          style: {
            colors: "#757de8", // 첫 번째 y축 라벨 색상
          },
          formatter: function (value: number) {
            return value.toFixed(2); // 소수점 둘째 자리까지 표시
          },
        },
        tickAmount: 8, // 10개의 눈금을 표시하여 촘촘하게
      },
      {
        opposite: true, // 두 번째 y축은 오른쪽에 표시
        title: {
          text: "Speed", // 두 번째 y축의 타이틀
          style: {
            color: "#4fc3f7", // 타이틀 색상
          },
        },
        labels: {
          style: {
            colors: "#4fc3f7", // 두 번째 y축 라벨 색상
          },
          formatter: function (value: number) {
            return value.toFixed(2); // 소수점 둘째 자리까지 표시
          },
        },
        tickAmount: 5, // 10개의 눈금을 표시하여 촘촘하게
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
          return format(new Date(value), "yyyy-MM-dd HH:mm:ss");
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
export default AltAndSpeedChart;
