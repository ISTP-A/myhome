import { CurrencyCode } from "@/entities/exchange/types"

export type ExchangeListItem = {
  currency: CurrencyCode
  ratio: number
}

export const exchangeList = [
  {
    currency: "USD",
    ratio: 1,
  },
  {
    currency: "JPY",
    ratio: 100,
  },
  {
    currency: "EUR",
    ratio: 1,
  },
  {
    currency: "CNY",
    ratio: 1,
  },
] satisfies ExchangeListItem[]
