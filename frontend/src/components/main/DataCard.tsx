interface DataCardProp {
  day: string;
  name: string;
  timetotal: string;
}

export function DataCard({ day, name, timetotal }: DataCardProp) {
  return (
    <div className="felx relative mx-auto h-[400px] w-[300px] flex-col items-center justify-center rounded border-2 border-[#B2B3B7] bg-white py-16">
      <div>
        <img
          className="absolute left-9 top-10"
          src="../public/images/card-left-up.svg"
          alt="카드 좌상 상세 디자인"
        />
        <img
          className="absolute right-9 top-10"
          src="../public/images/card-right-up.svg"
          alt="카드 우상 상세 디자인"
        />
        <img
          className="absolute bottom-10 left-9"
          src="../public/images/card-left-down.svg"
          alt="카드 좌하 상세 디자인"
        />
        <img
          className="absolute bottom-10 right-9"
          src="../public/images/card-right-down.svg"
          alt="카드 우하 상세 디자인"
        />
      </div>

      <div className="mx-auto h-[134px] w-[264px] bg-black"></div>
      <div className="mx-auto my-10 flex h-24 w-36 flex-col justify-center">
        <div className="flex items-start justify-start gap-3">
          <img src="../public/icons/day.svg" />
          <p>{day}</p>
        </div>
        <div className="mt-3 flex items-start justify-start gap-3">
          <img src="../public/icons/drone-sm.svg" />
          <p>{name}</p>
        </div>
        <div className="mt-3 flex items-start justify-start gap-3">
          <img src="../public/icons/clock.svg" />
          <p>{timetotal}</p>
        </div>
      </div>
    </div>
  );
}
