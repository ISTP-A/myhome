import { CurrencyCode, ExchangeRateWithChange } from "./types"

type ExchangeErrorResponse = {
  error?: string
}

export async function fetchExchangeRate(
  baseCurrency: CurrencyCode,
  quoteCurrency: CurrencyCode
) {
  const searchParams = new URLSearchParams({
    base: baseCurrency,
    quote: quoteCurrency,
  })
  const res = await fetch(`/api/exchange?${searchParams.toString()}`)

  if (!res.ok) {
    const error = (await res.json()) as ExchangeErrorResponse
    throw new Error(error.error ?? "환율 정보를 불러오지 못했습니다")
  }

  return (await res.json()) as ExchangeRateWithChange
}
