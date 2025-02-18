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
      <FunctionChart />
      <FunctionMap />
    </div>
  );
}
