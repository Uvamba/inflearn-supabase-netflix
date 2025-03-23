export function uploadDate(dateString: string): string {
  // 날짜 객체로 변환
  const date = new Date(dateString);

  // 한국 시간으로 포맷팅
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}
