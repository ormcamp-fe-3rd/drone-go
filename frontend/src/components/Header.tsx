import { SignButton } from "./main/SignButton";

export function Header() {
  return (
    <>
      <div className="mx-auto mt-[4%] flex max-w-[1280px] items-end justify-between">
        <div className="ml-3 flex items-end gap-2">
          <img className="" src="../public/icons/drone.svg" alt="Drone Icon" />
          <p className="text-3xl font-bold text-[#0800A1]">DronGo</p>
          <p className="ml-6 text-sm text-[#353740]">Introdudce</p>
        </div>
        <div className="mr-3 flex gap-4">
          <SignButton text="SIGN UP" bgColor="white" />
          <SignButton text="SIGN IN" bgColor="black" />
        </div>
      </div>
    </>
  );
}
