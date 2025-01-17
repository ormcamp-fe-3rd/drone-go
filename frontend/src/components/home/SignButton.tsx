interface SignButtonProps {
  text?: string; // 기본값: "SIGN UP"
  bgColor?: string; // 기본값: "black"
  onClick?: () => void; // 클릭 이벤트 추가
}

export function SignButton({
  text = "SIGN UP",
  bgColor = "black",
  onClick,
}: SignButtonProps) {
  // bgColor에 따라 textColor를 결정
  const validBgColor =
    bgColor === "white" || bgColor === "black" ? bgColor : "black";
  const textColor = validBgColor === "black" ? "text-white" : "text-[#353740]";

  return (
    <button
      className={`flex items-center rounded border-[1px] px-3 py-1 text-sm font-medium ${textColor}`}
      style={{ backgroundColor: validBgColor }}
      onClick={onClick} // onClick 이벤트 추가
    >
      {text}
    </button>
  );
}
