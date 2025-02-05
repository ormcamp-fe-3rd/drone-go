import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";

interface ProgressBarBtnProps {
  isPlaying: boolean;
  onClickPlay: () => void;
  onClickPause: () => void;
  onChangeSpeed: (value: string) => void;
  onClickStop: () => void;
  speed: number;
}
const ProgressBarBtns = ({
  isPlaying,
  onClickPlay,
  onClickPause,
  onChangeSpeed,
  onClickStop,
  speed,
}: ProgressBarBtnProps) => {
  return (
    <div className="absolute left-1/2 mt-4 -translate-x-1/2 transform">
      <div className="flex h-7 w-28 items-center justify-center rounded-xl bg-white bg-opacity-50">
        <button className="flex w-8 justify-center" onClick={onClickStop}>
          <img src="/images/map/stopBtn.svg" alt="stop" className="h-4 w-4" />
        </button>

        {isPlaying ? (
          <button onClick={onClickPause} className="h-8 w-8">
            <img src="/images/map/pause.svg" alt="pause" />
          </button>
        ) : (
          <button onClick={onClickPlay} className="h-8 w-8">
            <img src="/images/map/play.svg" alt="play" />
          </button>
        )}

        <div>
          <Select onValueChange={onChangeSpeed}>
            <SelectTrigger className="w-8 text-center">
              <SelectValue placeholder={`${speed}x`}>{speed}x</SelectValue>
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="mb-1 w-10 cursor-pointer rounded-xl bg-white bg-opacity-50 text-center"
            >
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
              <SelectItem value="5">5x</SelectItem>
              <SelectItem value="10">10x</SelectItem>
              <SelectItem value="20">20x</SelectItem>
              <SelectItem value="30">30x</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ProgressBarBtns;
