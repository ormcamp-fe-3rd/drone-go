import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function MapSwitchButton(){
  const to2d = "/icons/to-2dmap.svg";
  const to3d = "/icons/to-3dmap.svg"

  const location = useLocation();
  // 현재 URL이 "/map"인지 확인
  const is2d = location.pathname === "/map";
  
  return(
    <div className="w-16 h-16 fixed right-9 bg-white rounded-[10px] bg-opacity-60 hover:bg-opacity-80">
      <Link to={is2d? "/map-3d": "/map"} className="w-full h-full flex justify-center items-center">
        <img src={is2d? to3d: to2d} alt="" className="w-10 h-10"/>
      </Link>
    </div>
  )
}