export function SignButton({ text = "SIGN UP", bgColor = "black" }) {
  // bgColor에 따라 textColor를 결정
  const validBgColor =
    bgColor === "white" || bgColor === "black" ? bgColor : "black";
  const textColor = validBgColor === "black" ? "text-white" : "text-[#353740]";

  return (
    <button
      className={`flex items-center rounded-lg border-[1px] px-3 py-1 text-sm font-medium ${textColor}`}
      style={{ backgroundColor: validBgColor }}
    >
      {text}
    </button>
  );
}
