interface ProgressBarBtnProps {
    isPlaying: boolean;
    onClickPlay: () => void;
    onClickPause: () => void;
  }
  const ProgressBarBtn = ({
    isPlaying,
    onClickPlay,
    onClickPause,
  }: ProgressBarBtnProps) => {
    return (
      <div className="play-icon absolute left-1/2 mt-4 -translate-x-1/2 transform">
        {isPlaying ? (
          <button onClick={onClickPause} className="h-10 w-10">
            <img src="/images/pause.svg" alt="pause" />
          </button>
        ) : (
          <button onClick={onClickPlay} className="h-10 w-10">
            <img src="/images/play.svg" alt="play" />
          </button>
        )}
      </div>
    );
  };
  
  export default ProgressBarBtn;