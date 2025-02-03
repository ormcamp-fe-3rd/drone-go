import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";

interface ProgressBarBtnProps {
  isPlaying: boolean;
  onClickPlay: () => void;
  onClickPause: () => void;
  onChangeSpeed: (value:string) => void;
  speed: number;
}
const ProgressBarBtns = ({
  isPlaying,
  onClickPlay,
  onClickPause,
  onChangeSpeed,
  speed,
}: ProgressBarBtnProps) => {

  return (
    <div className="absolute left-1/2 mt-4 -translate-x-1/2 transform">
      <div className="flex items-center justify-center rounded-xl bg-white bg-opacity-50 h-7 w-28">
        {/* TODO: 정지 기능 추가 */}
        <button className="flex w-8 justify-center">
          <img src="/images/stopBtn.svg" alt="stop" className="w-4 h-4"/>
        </button>

        {isPlaying ? (
          <button onClick={onClickPause} className="h-8 w-8">
            <img src="/images/pause.svg" alt="pause" />
          </button>
        ) : (
          <button onClick={onClickPlay} className="h-8 w-8">
            <img src="/images/play.svg" alt="play" />
          </button>
        )}

        <div>
          <Select onValueChange={onChangeSpeed}>
            <SelectTrigger className="w-8 text-center">
              <SelectValue placeholder={`${speed}x`}>{speed}x</SelectValue>
            </SelectTrigger>
            <SelectContent position="popper" className="w-10 text-center">
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
              <SelectItem value="5">5x</SelectItem>
              <SelectItem value="10">10x</SelectItem>
              <SelectItem value="20">20x</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ProgressBarBtns;