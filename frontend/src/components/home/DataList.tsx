import { FlightDataCard } from "./FlightDataCard";

export function DataList() {
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
        {data.map((item, index) => (
          <FlightDataCard key={index} name={item.name} img={item.img} />
        ))}
      </div>
    </div>
  );
}
