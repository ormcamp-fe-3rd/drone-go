import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "@/contexts/AuthContext";

import { LoginModal } from "./LoginModal"; // LoginModal 컴포넌트 임포트
import { SignButton } from "./SignButton";

export function HomeHeader() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // 로그인 모달 상태 관리
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
      setIsLoginModalOpen(true); // SIGN IN 클릭 시 모달을 열기
    }
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false); // 로그인 모달 닫기
  };

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
          {/* 클릭 시 알럿 */}
          {/* TODO: 로그인 상태에 따라 SIGN OUT 으로 수정 */}
          <SignButton
            text={isAuth ? "SIGN OUT" : "SIGN IN" }
            bgColor="black"
            onClick={handleSignInClick} // SIGN IN 클릭 시 모달을 열기
          />
        </div>
      </div>

      {/* LoginModal이 열릴 때 렌더링 */}
      {isLoginModalOpen && <LoginModal onClose={handleCloseLoginModal} />}
    </div>
  );
}
