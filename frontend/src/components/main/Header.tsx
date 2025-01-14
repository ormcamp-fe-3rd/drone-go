import { useState } from "react";
import { Link } from "react-router-dom";
import { SignButton } from "./SignButton";
import { LoginModal } from "./LoginModal"; // LoginModal 컴포넌트 임포트

export function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // 로그인 모달 상태 관리

  const handleSignUpClick = () => {
    alert("The SIGN UP feature is not available yet.🔧");
  };

  const handleSignInClick = () => {
    setIsLoginModalOpen(true); // SIGN IN 클릭 시 모달을 열기
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
          <Link to={"/about"}>
            {/* //TODO: 소개페이지 링크 연결해야함*/}
            <button className="ml-6 text-sm text-[#353740]">about</button>
          </Link>
        </div>
        <div className="ml-10 flex gap-4">
          <SignButton
            text="SIGN UP"
            bgColor="white"
            onClick={handleSignUpClick}
          />
          {/* 클릭 시 알럿 */}
          <SignButton
            text="SIGN IN"
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
