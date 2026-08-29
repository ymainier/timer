export const formatTime = (timeInMs: number): string => {
  const tenthsOfSeconds = Math.round(timeInMs / 100);
  const minutes = Math.floor(tenthsOfSeconds / 600);
  const seconds = Math.floor((tenthsOfSeconds % 600) / 10);
  const tenths = tenthsOfSeconds % 10;
  return `${minutes}:${seconds.toString().padStart(2, "0")}:${tenths}`;
};
