// TODO: 날씨 연동
interface WeatherProps {
  icon: string;
  title: string;
  values: string[];
}
const WeatherWidget = ({ icon, title, values }: WeatherProps) => {
  return (
    <div className="relative mx-6 mt-2 hidden h-[5vh] w-[30vw] max-w-[17rem] grid-cols-[0.5fr_0.5fr_1.5fr] items-center rounded-[10px] bg-white bg-opacity-60 px-2 text-center text-sm font-bold sm:grid md:grid-cols-[1fr_0.5fr_1fr]">
      <div className="flex items-center justify-start border-r-2 border-none border-[#B2B2B7] md:border-solid">
        <img src={icon} alt={title} className="mr-2 h-6 w-6" />
        <p className="hidden h-6 pl-2 md:flex">{title}</p>
      </div>
      <div className="h-6 border-r-2 border-solid border-[#B2B2B7]">
        {values[0]}
      </div>
      <div className="h-6">{values[1]}</div>
    </div>
  );
};

export default WeatherWidget;