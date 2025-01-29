// TODO: 날씨 연동
interface WeatherProps {
  icon: string;
  title: string;
  values: string[];
}
const WeatherWidget = ({ icon, title, values }: WeatherProps) => {
  return (
    <div className="relative mx-6 mt-2 grid h-[5vh] w-[20vw] grid-cols-[1fr_0.5fr_1fr] items-center rounded-[10px] bg-white bg-opacity-60 px-2 text-center text-sm font-bold">
      <div className="flex items-center justify-center border-r-2 border-solid border-[#B2B2B7]">
        <img src={icon} alt={title} className="mr-2 h-6 w-6" />
        <p className="h-6 pl-2">{title}</p>
      </div>
      <div className="h-6 border-r-2 border-solid border-[#B2B2B7]">
        {values[0]}
      </div>
      <div className="h-6">{values[1]}</div>
    </div>
  );
};

export default WeatherWidget;