"use client"

import { fetchExchangeRate } from "@/entities/exchange/api-client"
import {
  createSameCurrencyExchangeRate,
  DEFAULT_QUOTE_CURRENCY,
} from "@/entities/exchange/model/currency"
import { CurrencyCode } from "@/entities/exchange/types"
import { queryOptions, useQuery } from "@tanstack/react-query"

export type ExchangeRateQueryParams = {
  currency: CurrencyCode
  quoteCurrency?: CurrencyCode
}

export function exchangeRateQueryOptions({
  currency,
  quoteCurrency = DEFAULT_QUOTE_CURRENCY,
}: ExchangeRateQueryParams) {
  return queryOptions({
    queryKey: ["exchange", currency, quoteCurrency],
    queryFn: () => fetchExchangeRate(currency, quoteCurrency),
    enabled: currency !== quoteCurrency,
  })
}

export function useExchangeRate({
  currency,
  quoteCurrency = DEFAULT_QUOTE_CURRENCY,
}: ExchangeRateQueryParams) {
  const isSameCurrency = currency === quoteCurrency
  const query = useQuery(exchangeRateQueryOptions({ currency, quoteCurrency }))

  return {
    ...query,
    data: isSameCurrency
      ? createSameCurrencyExchangeRate(currency, quoteCurrency)
      : query.data,
    isStatic: isSameCurrency,
  }
}
