export function formatExchangeRate(value: number) {
  return new Intl.NumberFormat("ko-KR", {
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatExchangeChangeRate(value: number) {
  const sign = value > 0 ? "+" : ""

  return `${sign}${value.toFixed(2)}%`
}

export function formatExchangeTimestamp(timestamp: number) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(new Date(timestamp * 1000))
}
