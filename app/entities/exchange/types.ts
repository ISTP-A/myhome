export const SUPPORTED_CURRENCIES = ["USD", "KRW", "JPY", "EUR", "CNY"] as const
export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number]

export type ExchangeRate = {
  baseCurrency: CurrencyCode
  quoteCurrency: CurrencyCode
  symbol: string
  rate: number
  timestamp: number
}

export type ExchangeRateWithChange = ExchangeRate & {
  previousClose: number
  change: number
  changeRate: number
}
