import { FunctionChart } from "./FunctionChart";
import { FunctionMap } from "./Functionmap";

export default function FunctionSection() {
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
      <FunctionChart />
      <FunctionMap />
    </div>
  );
}
