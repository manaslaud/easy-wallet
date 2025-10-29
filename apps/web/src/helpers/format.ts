export function truncateMiddle(value: string, left = 6, right = 4) {
  if (!value) return "";
  if (value.length <= left + right + 3) return value;
  return `${value.slice(0, left)}…${value.slice(-right)}`;
}


