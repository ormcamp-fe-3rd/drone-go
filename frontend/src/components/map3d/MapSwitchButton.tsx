interface Props {
  is2d: boolean;
  switchMap: () => void;
}
export default function MapSwitchButton({ is2d, switchMap }: Props) {
  const to2d = "/icons/to-2dmap.svg";
  const to3d = "/icons/to-3dmap.svg";

  return (
    <div className="h-16 w-16 rounded-[10px] bg-white bg-opacity-60 hover:bg-opacity-80">
      <button
        className="flex h-full w-full items-center justify-center"
        onClick={switchMap}
      >
        <img src={is2d ? to3d : to2d} alt="" className="h-10 w-10" />
      </button>
    </div>
  );
}
