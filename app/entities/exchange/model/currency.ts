import { CurrencyCode, ExchangeRateWithChange } from "../types"

export const DEFAULT_QUOTE_CURRENCY: CurrencyCode = "KRW"

export const CURRENCY_META: Record<
  CurrencyCode,
  {
    imageUrl: string
    label: string
  }
> = {
  CNY: {
    imageUrl: "/image/china.png",
    label: "위안",
  },
  EUR: {
    imageUrl: "/image/european-union.png",
    label: "유로",
  },
  JPY: {
    imageUrl: "/image/japan.png",
    label: "엔",
  },
  KRW: {
    imageUrl: "/image/south-korea.png",
    label: "원",
  },
  USD: {
    imageUrl: "/image/united-states.png",
    label: "달러",
  },
}

export function createSameCurrencyExchangeRate(
  currency: CurrencyCode,
  quoteCurrency: CurrencyCode
): ExchangeRateWithChange {
  return {
    baseCurrency: currency,
    quoteCurrency,
    symbol: `${currency}/${quoteCurrency}`,
    rate: 1,
    previousClose: 1,
    change: 0,
    changeRate: 0,
    timestamp: 0,
  }
}
