export const formatDateHeader = (timestamp) => {
  const date = new Date(timestamp);
  const day = date.toLocaleString("en-US", { weekday: "short" });
  const dayNum = date.getDate();
  const shortYear = date.getFullYear().toString().slice(-2);
  return `${day}-${dayNum}-${shortYear}`;
};