import { Link } from "react-router-dom";

import { Button } from "../ui/button";

interface Props {
  is2d: boolean;
  switchMap: () => void;
}

export default function HeaderMapBtns({is2d, switchMap}: Props){
  const to2d = "/icons/to2d.svg";
  const to3d = "/icons/to3d.svg";

  return (
    <>
      <Button className="h-16 w-16 min-w-[64px] rounded-[10px] bg-white" 
        onClick={switchMap}>
        <img
          src={is2d ? to3d : to2d}
          alt={is2d ? "3d map": "2d map"}
          className="w-12 h-12"
        />
      </Button>
      <Link to="/chart">
        <Button className="h-16 w-16 min-w-[64px] rounded-[10px] bg-white">
          <img
            src="/icons/charts.svg"
            alt="Charts Icon"
            className="object-contain w-16 h-16"
          />
        </Button>
      </Link>
    </>
  );
}