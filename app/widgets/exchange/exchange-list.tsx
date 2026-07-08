"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatExchangeTimestamp } from "@/entities/exchange/lib/format"
import { ExchangeRateWithChange } from "@/entities/exchange/types"
import { exchangeRateQueryOptions } from "@/features/exchange/model/use-exchange-rate"
import { ExchangeInfo } from "@/features/exchange/ui/exchange-info"
import { UseQueryResult, useQueries } from "@tanstack/react-query"
import { exchangeList } from "./model/exchange-list"

type ExchangeQueryResult = UseQueryResult<ExchangeRateWithChange, Error>

export function ExchangeListCard() {
  const exchangeQueries = useQueries({
    queries: exchangeList.map((exchange) =>
      exchangeRateQueryOptions({ currency: exchange.currency })
    ),
  })
  const footerText = getExchangeListFooterText(exchangeQueries)

  return (
    <Card size="sm" className="w-full max-w-96 rounded-2xl">
      <CardHeader className="gap-1 px-5">
        <CardTitle>환율 정보</CardTitle>
        <CardDescription>{footerText}</CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        <div className="divide-y divide-border">
          {exchangeList.map((exchange) => (
            <ExchangeInfo
              key={`exchange-${exchange.currency}`}
              currency={exchange.currency}
              ratio={exchange.ratio}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="px-5">
        <span className="text-xs text-muted-foreground">원화 기준 주요 통화 환율</span>
      </CardFooter>
    </Card>
  )
}

function getExchangeListFooterText(
  queries: ExchangeQueryResult[]
): string {
  if (queries.some((query) => query.isPending)) {
    return "환율 정보 갱신 중"
  }

  const timestamps = queries
    .map((query) => query.data?.timestamp)
    .filter((timestamp): timestamp is number => Boolean(timestamp))

  if (timestamps.length === 0) {
    return queries.some((query) => query.isError)
      ? "환율 기준 시간을 불러오지 못했습니다"
      : "환율 기준 시간 없음"
  }

  const oldestTimestamp = Math.min(...timestamps)
  const suffix = queries.some((query) => query.isError) ? " 일부 데이터 제외" : ""

  return `${formatExchangeTimestamp(oldestTimestamp)} 기준${suffix}`
}
