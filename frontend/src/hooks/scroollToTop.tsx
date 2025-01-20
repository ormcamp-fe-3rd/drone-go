import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // 페이지 이동 시 스크롤을 맨 위로 초기화
    window.scrollTo(0, 0);
  }, [location.pathname]); // 경로가 바뀔 때마다 실행

  return null;
}
