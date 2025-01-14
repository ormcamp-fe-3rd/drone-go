import { useState, useEffect } from "react";

interface LoginModalProps {
  onClose: () => void; // onClose는 반환 값이 없는 함수
}

export function LoginModal({ onClose }: LoginModalProps) {
  const [isOpen, setIsOpen] = useState(true); // 모달 열림/닫힘 상태

  useEffect(() => {
    // 화면 스크롤 막기
    document.body.style.overflow = "hidden";

    // 모달이 열리면 외부 요소에 대한 tab 접근 방지
    const focusableElements = "button, input, select, textarea, a[href]";
    const modal = document.getElementById("modal");

    // 포커스가 모달 밖으로 나가지 않도록
    const trapFocus = (e: KeyboardEvent) => {
      const focusableContent = modal?.querySelectorAll(focusableElements);
      if (focusableContent) {
        // focusableContent가 null이 아닐 경우에만 진행
        const firstFocusableElement = focusableContent[0] as HTMLElement; // 타입 단언
        const lastFocusableElement = focusableContent[
          focusableContent.length - 1
        ] as HTMLElement; // 타입 단언

        if (e.key === "Tab") {
          if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstFocusableElement) {
              lastFocusableElement?.focus();
              e.preventDefault();
            }
          } else {
            // Tab
            if (document.activeElement === lastFocusableElement) {
              firstFocusableElement?.focus();
              e.preventDefault();
            }
          }
        }
      }
    };

    // 키보드 이벤트 리스너 추가
    document.addEventListener("keydown", trapFocus);

    // 컴포넌트가 언마운트될 때 리스너를 제거
    return () => {
      document.removeEventListener("keydown", trapFocus);
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false); // 모달을 닫는 함수
    if (onClose) onClose(); // 부모 컴포넌트에서 전달한 onClose 호출
  };

  if (!isOpen) return null; // 모달이 닫히면 아무것도 렌더링하지 않음

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        id="modal"
        className="relative flex h-[28.75rem] w-[40.625rem] flex-col items-center justify-center rounded-[10px] bg-[#F9F9F9]"
        role="dialog"
        aria-labelledby="login-modal-title"
        aria-hidden="false"
        tabIndex={-1} // 모달 자체가 포커스를 받을 수 있도록 설정
      >
        <button
          onClick={handleClose}
          tabIndex={0}
          className="absolute right-10 top-10 h-6 w-6" // 닫기 버튼도 Tab 순서에 포함
        >
          <img
            className="cursor-pointer"
            src="../../public/icons/close.svg"
            alt="Close"
          />
        </button>

        <p id="login-modal-title" className="mb-12 text-2xl font-bold">
          Login required to continue
        </p>
        <input
          type="email"
          placeholder="ID"
          className="h-[3rem] w-[30rem] rounded-[10px] border-[1px] border-[#B2B2B7] px-4 text-xl"
          autoFocus
        />
        <input
          type="password"
          placeholder="Password"
          className="mt-7 h-[3rem] w-[30rem] rounded-[10px] border-[1px] border-[#B2B2B7] px-4 text-xl"
        />
        <button className="mt-10 h-[3rem] w-[30rem] rounded-[10px] bg-black text-white">
          SIGN IN
        </button>
      </div>
    </div>
  );
}
