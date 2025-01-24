import { format } from "date-fns-tz";

export const formatTime = (time: Date): string => {
  return format(time, "HH:mm:ss", { timeZone: "Asia/Seoul" });
};
