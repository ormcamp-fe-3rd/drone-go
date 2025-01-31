//TODO: api 데이터로 수정
interface SpeedAltitudeProps{
  icon: string;
  title: string;
  value: string;
}
const SpeedWidget = ({ icon, title, value }: SpeedAltitudeProps) => {
  return (
    <div className="relative mx-6 mt-2 hidden h-[5vh] w-[30vw] max-w-[17rem] grid-cols-2 items-center rounded-[10px] bg-white bg-opacity-60 px-2 text-center text-sm font-bold sm:grid md:grid-cols-[1fr_1.5fr]">
      <div className="flex items-center border-r-2 border-solid border-[#B2B2B7]">
        <img src={icon} alt={title} />
        <p className="pl-2">{title}</p>
      </div>
      <div className="text-right">{value}</div>
    </div>
  );
};

export default SpeedWidget;