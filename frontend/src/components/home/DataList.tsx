import { FlightDataCard } from "./FlightDataCard";

export function DataList() {
  // 드론 데이터 배열, 이미지 경로를 포함
  const data = [
    { name: "M1_1", img: "/images/drone-01.svg" },
    { name: "M1_2", img: "/images/drone-02.svg" },
    { name: "M1_3", img: "/images/drone-01.svg" },
  ];

  return (
    <div className="mx-auto mb-10 flex h-[1024px] flex-col items-center justify-center text-center">
      <p className="title" id="DataList">
        Select the Drone
      </p>
      <p className="subtitle mt-2">
        Select a drone and view its data visualization.
      </p>
      <div className="mt-10 flex h-auto min-h-[37.5rem] w-[75rem] flex-wrap items-center justify-center">
        {/* 데이터 배열을 map()으로 렌더링 */}
        {data.map((item, index) => (
          <FlightDataCard
            key={index} // 각 항목의 고유 키 설정
            name={item.name}
            img={item.img} // 드론 이미지 경로 전달
          />
        ))}
      </div>
    </div>
  );
}
