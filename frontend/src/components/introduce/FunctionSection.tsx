export default function FunctionSection(){
  return (
    <div className="flex w-full max-w-[1440px] flex-col items-center justify-center gap-10 text-center">
      <div className="title">Advanced drone flight analytics platform</div>
      <div className="subtitle">
        This powerful visualization toolkit empowers drone operators and fleet
        managers to make data-driven decisions,
        <br /> enhance operational safety, and optimize mission parameters
        through comprehensive flight data analysis.
      </div>
      {/* TODO: scroll effect 추가 */}
      {/* chart 기능 소개 */}
      <div className="relative flex h-[631px] w-[920px] justify-center">
        <img
          className="absolute drop-shadow-lg"
          src="/public/images/introduce/section01-chart-bg.png"
          alt=""
        />
        <img
          className="absolute"
          src="/public/images/introduce/section01-chart-01.png"
          alt=""
        />
        <img
          className="absolute"
          src="/public/images/introduce/section01-chart-02.png"
          alt=""
        />
      </div>
      {/* map 기능 소개 */}
      <div className="relative flex h-[631px] w-[920px] justify-center">
        <img
          className="absolute drop-shadow-lg"
          src="/public/images/introduce/section01-map-bg.png"
          alt=""
        />
        <img
          className="absolute"
          src="/public/images/introduce/section01-map-01.png"
          alt=""
        />
        <img
          className="absolute"
          src="/public/images/introduce/section01-map-02.png"
          alt=""
        />
        <img
          className="absolute z-10"
          src="/public/images/introduce/section01-map-03.png"
          alt=""
        />
      </div>
    </div>
  );
}