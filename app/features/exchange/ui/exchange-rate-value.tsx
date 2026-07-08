import {
  formatExchangeChangeRate,
  formatExchangeRate,
} from "@/entities/exchange/lib/format"
import { CURRENCY_META } from "@/entities/exchange/model/currency"
import { ExchangeRateWithChange } from "@/entities/exchange/types"
import { cn } from "@/lib/utils"

export function ExchangeRateValue({
  data,
  ratio,
}: {
  data: ExchangeRateWithChange
  ratio: number
}) {
  const isPositive = data.change > 0
  const isNegative = data.change < 0

  return (
    <div className="flex min-w-24 flex-col items-end">
      <div className="text-sm font-semibold tabular-nums">
        {formatExchangeRate(data.rate * ratio)}
        <span className="ml-1 text-xs font-normal text-muted-foreground">
          {CURRENCY_META[data.quoteCurrency].label}
        </span>
      </div>
      <div
        className={cn(
          "text-xs tabular-nums text-muted-foreground",
          isPositive && "text-red-500",
          isNegative && "text-blue-500"
        )}
      >
        {formatExchangeChangeRate(data.changeRate)}
      </div>
    </div>
  )
}

export function ExchangeInfoSkeleton() {
  return (
    <div className="flex min-w-24 flex-col items-end">
      <span className="h-5 w-16 animate-pulse rounded bg-muted" />
      <span className="mt-1 h-4 w-12 animate-pulse rounded bg-muted" />
    </div>
  )
}

export function ExchangeInfoError({ message }: { message: string }) {
  return (
    <div className="flex min-w-24 flex-col items-end">
      <span className="max-w-28 text-right text-xs text-destructive">
        {message}
      </span>
    </div>
  )
}
