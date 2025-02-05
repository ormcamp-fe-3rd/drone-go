interface SignButtonProps {
  text?: string;
  bgColor?: string;
  onClick?: () => void;
}

export function SignButton({
  text = "SIGN UP",
  bgColor = "black",
  onClick,
}: SignButtonProps) {
  const validBgColor =
    bgColor === "white" || bgColor === "black" ? bgColor : "black";
  const textColor = validBgColor === "black" ? "text-white" : "text-[#353740]";

  return (
    <button
      className={`flex items-center rounded border-[1px] px-3 py-1 text-sm font-medium ${textColor}`}
      style={{ backgroundColor: validBgColor }}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
