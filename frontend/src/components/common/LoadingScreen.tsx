import { useEffect, useState } from "react";

const LoadingScreen = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // 0에서 100까지 로딩 진행 상태 업데이트
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev < 100) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return 100;
        }
      });
    }, 30); // 30ms마다 1%씩 증가시킴

    return () => clearInterval(interval); // 클린업
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-900">
      <div className="text-center">
        {/* 드론 아이콘을 애니메이션으로 회전시키는 부분 */}
        <div className="mx-auto mb-4 h-20 w-20 animate-spin">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-white"
          >
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
            <path
              d="M12 2V12L17 8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {/* 로딩 텍스트 및 숫자 */}
        <p className="text-xl font-semibold text-white">
          Loading Drone Data... {loadingProgress}%
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
