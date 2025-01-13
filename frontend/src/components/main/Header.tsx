import { Link } from "react-router-dom";
import { SignButton } from "./SignButton";

export function Header() {
  return (
    <div className="mx-auto max-w-screen-xl">
      {/* Header Section */}
      <div className="relative z-20 mx-auto mt-[4%] flex items-end justify-between">
        <div className="ml-3 flex items-end gap-2">
          <Link to={"/"} className="flex">
            <img
              className="h-8 w-8"
              src="../public/icons/drone.svg"
              alt="Drone Icon"
            />
            <p className="text-3xl font-bold text-[#0800A1]">DronGo</p>
          </Link>
          {/* //TODO: 소개페이지 링크 연결해야함*/}
          <p className="ml-6 text-sm text-[#353740]">Introduce</p>
        </div>
        <div className="mr-3 flex gap-4">
          <SignButton text="SIGN UP" bgColor="white" />
          <SignButton text="SIGN IN" bgColor="black" />
        </div>
      </div>
    </div>
  );
}
