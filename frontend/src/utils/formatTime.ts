export const formatTime = (time: Date): string => {
  const hours = time.getHours().toString().padStart(2, "0"); // 시간 두 자리 처리
  const minutes = time.getMinutes().toString().padStart(2, "0"); // 분 두 자리 처리
  const seconds = time.getSeconds().toString().padStart(2, "0"); // 초 두 자리 처리
  return `${hours} : ${minutes} : ${seconds}`;
};
