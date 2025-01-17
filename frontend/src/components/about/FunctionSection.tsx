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
      {/* 멘토의견: 아래 이미지들을 하나의 이미지로 만들어서 사용하는 것이 편리할수도 있음 */}
      {/* chart 기능 소개 */}
      <div className="relative aspect-[10/7] w-full lg:w-[920px]">
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
      <div className="relative aspect-[10/7] w-full lg:w-[920px]">
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
          className="absolute"
          src="/public/images/introduce/section01-map-03.png"
          alt=""
        />
      </div>
    </div>
  );
}