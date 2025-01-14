import { DataCard } from "./DataCard";

export function DataList() {
  // DataCard에 전달할 데이터 배열
  const data = [
    { day: "2024.12.20", name: "M1_1", timetotal: "40:00:00" },
    { day: "2024.12.21", name: "M1_2", timetotal: "35:00:00" },
    { day: "2024.12.22", name: "M1_1", timetotal: "30:00:00" },
    { day: "2024.12.22", name: "M1_2", timetotal: "30:00:00" },
    // 추가 데이터 항목...
  ];

  return (
    <div className="mx-auto flex h-[1024px] flex-col items-center justify-center text-center">
      <p className="title">Select the data</p>
      <p className="subtitle">
        Choose the data set you want to analyze or review. Select to proceed
      </p>
      <div className="flex h-[37.5rem] w-[75rem] flex-wrap items-center justify-center">
        {/* 데이터 배열을 map()으로 렌더링 */}
        {data.map((item, index) => (
          <DataCard
            key={index} // 각 항목의 고유 키 설정
            day={item.day}
            name={item.name}
            timetotal={item.timetotal}
          />
        ))}
      </div>
    </div>
  );
}
