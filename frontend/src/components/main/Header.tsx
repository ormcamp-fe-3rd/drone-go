import { Link } from "react-router-dom";
import { SignButton } from "./SignButton";

export function Header() {
  return (
    <div className="mx-auto flex max-w-screen-xl">
      {/* Header Section */}
      <div className="z-50 mx-auto mt-[4%] flex w-full items-end justify-between">
        <div className="ml-3 flex items-end justify-start gap-2">
          <Link to={"/"} className="flex">
            <img
              className="h-8 w-8"
              src="../public/icons/drone.svg"
              alt="Drone Icon"
            />
            <p className="text-3xl font-bold text-[#0800A1]">DronGo</p>
          </Link>
          <Link to={"/about"}>
            {/* //TODO: 소개페이지 링크 연결해야함*/}
            <button className="ml-6 text-sm text-[#353740]">about</button>
          </Link>
        </div>
        <div className="ml-10 flex gap-4">
          <SignButton text="SIGN UP" bgColor="white" />
          <SignButton text="SIGN IN" bgColor="black" />
        </div>
      </div>
    </div>
  );
}
