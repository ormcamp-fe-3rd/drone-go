import { format } from "date-fns-tz";

export const formatTime = (time?: Date | number | string): string => {
  if (!time) {
    console.warn("⚠️ formatTime: time이 없음!");
    return "시간 없음"; // 기본값
  }

  const date = time instanceof Date ? time : new Date(time);

  if (isNaN(date.getTime())) {
    console.error("❌ formatTime: Invalid Date", time);
    return "잘못된 시간"; // 기본값
  }

  return format(date, "HH:mm:ss", { timeZone: "Asia/Seoul" });
};
