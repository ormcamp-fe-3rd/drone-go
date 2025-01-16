import { Link } from "react-router-dom";

interface FlightDataCardProps {
  day: string;
  name: string;
  timetotal: string;
}

export function FlightDataCard({ day, name, timetotal }: FlightDataCardProps) {
  return (
    <>
      <Link to={"/chart"}>
        <div className="group relative mx-auto h-[400px] w-[300px] flex-col items-center justify-center rounded border-2 border-[#B2B7B7] bg-white py-16 hover:bg-click hover:text-white">
          <div>
            <img
              className="absolute left-9 top-10 transition-all duration-300 ease-in-out group-hover:left-4 group-hover:top-5 group-active:left-4 group-active:top-5"
              src="/images/card-left-up.svg"
              alt="카드 좌상 상세 디자인"
            />
            <img
              className="absolute right-9 top-10 transition-all duration-300 ease-in-out group-hover:right-4 group-hover:top-5 group-active:right-4 group-active:top-5"
              src="/images/card-right-up.svg"
              alt="카드 우상 상세 디자인"
            />
            <img
              className="absolute bottom-10 left-9 transition-all duration-300 ease-in-out group-hover:bottom-5 group-hover:left-4 group-active:bottom-5 group-active:left-4"
              src="/images/card-left-down.svg"
              alt="카드 좌하 상세 디자인"
            />
            <img
              className="absolute bottom-10 right-9 transition-all duration-300 ease-in-out group-hover:bottom-5 group-hover:right-4 group-active:bottom-5 group-active:right-4"
              src="/images/card-right-down.svg"
              alt="카드 우하 상세 디자인"
            />
          </div>

          <div className="mx-auto h-[134px] w-[264px] bg-black"></div>

          {/* Original Content */}

          <div className="mx-auto my-10 flex h-24 w-36 flex-col justify-center transition-opacity duration-300 ease-in-out group-hover:hidden group-active:hidden">
            <div className="flex items-start justify-start gap-3">
              <img
                src="/icons/day.svg"
                className="transition-all duration-300 ease-in-out"
              />
              <p>{day}</p>
            </div>
            <div className="mt-3 flex items-start justify-start gap-3">
              <img
                src="/icons/drone-sm.svg"
                className="transition-all duration-300 ease-in-out"
              />
              <p>{name}</p>
            </div>
            <div className="mt-3 flex items-start justify-start gap-3">
              <img
                src="/icons/clock.svg"
                className="transition-all duration-300 ease-in-out"
              />
              <p>{timetotal}</p>
            </div>
          </div>

          {/* Hover Content */}
          <div className="mx-auto my-10 hidden h-24 w-36 items-center justify-center text-center transition-opacity duration-300 ease-in-out group-hover:flex">
            <p className="text-lg">Would you like to review this data?</p>
          </div>

          {/* Active Content */}
          {/*
      <div className="mx-auto my-10 hidden h-24 w-36 items-center justify-center text-center transition-opacity duration-300 ease-in-out group-active:flex">
        <p className="text-lg text-white">Let's dive into the details!</p>
      </div>*/}
        </div>
      </Link>
    </>
  );
}
