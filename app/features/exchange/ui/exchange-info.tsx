"use client"

import { CURRENCY_META } from "@/entities/exchange/model/currency"
import { CurrencyCode, ExchangeRateWithChange } from "@/entities/exchange/types"
import { useExchangeRate } from "@/features/exchange/model/use-exchange-rate"
import { CurrencyIcon } from "./currency-icon"
import {
  ExchangeInfoError,
  ExchangeInfoSkeleton,
  ExchangeRateValue,
} from "./exchange-rate-value"

interface ExchangeInfoProps {
  currency: CurrencyCode
  quoteCurrency?: CurrencyCode
  ratio?: number
}

export function ExchangeInfo({
  currency,
  quoteCurrency,
  ratio = 1,
}: ExchangeInfoProps) {
  const exchangeRate = useExchangeRate({ currency, quoteCurrency })

  return (
    <div className="flex min-h-16 w-full items-center gap-3 px-3 py-2">
      <span className="rounded-full border border-white">
        <CurrencyIcon currency={currency} size={36} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <p className="text-sm font-semibold">{currency}</p>
          <span className="text-xs text-muted-foreground">
            {CURRENCY_META[currency].label}
          </span>
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {ratio.toLocaleString()} {currency} 기준
        </p>
      </div>
      <ExchangeInfoValue
        data={exchangeRate.data}
        error={exchangeRate.error}
        isError={exchangeRate.isError}
        ratio={ratio}
      />
    </div>
  )
}

function ExchangeInfoValue({
  data,
  error,
  isError,
  ratio,
}: {
  data?: ExchangeRateWithChange
  error: Error | null
  isError: boolean
  ratio: number
}) {
  if (data) {
    return <ExchangeRateValue data={data} ratio={ratio} />
  }

  if (isError) {
    return (
      <ExchangeInfoError
        message={error?.message ?? "환율 정보를 불러오지 못했습니다"}
      />
    )
  }

  return <ExchangeInfoSkeleton />
}
