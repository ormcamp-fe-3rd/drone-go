import { useContext } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "@/contexts/AuthContext";

import { SignButton } from "./SignButton";

export function HomeHeader() {
  const { isAuth, setIsAuth } = useContext(AuthContext);


  const handleSignUpClick = () => {
    alert("The SIGN UP feature is not available yet.🔧");
  };

  const handleSignInClick = () => {
    if(isAuth){ // SIGN OUT 클릭 시 로그아웃
      setIsAuth(false);
      localStorage.removeItem("token");
      alert("Successfully Signed Out")
    }else{
      handleScroll()
    }
  };

  const handleScroll = () => {
    const section = document.getElementById("unlogged-data-list");
    section?.scrollIntoView({behavior: "smooth"})
  }

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
            <p className="text-3xl font-bold text-[#0800A1]">DroneGo</p>
          </Link>
          <Link to={"/about"} className="ml-6 text-sm text-[#353740]">
            about
          </Link>
        </div>
        <div className="ml-10 flex gap-4">
          <SignButton
            text="SIGN UP"
            bgColor="white"
            onClick={handleSignUpClick}
          />
          <SignButton
            text={isAuth ? "SIGN OUT" : "SIGN IN" }
            bgColor="black"
            onClick={handleSignInClick} 
          />
        </div>
      </div>
    </div>
  );
}
