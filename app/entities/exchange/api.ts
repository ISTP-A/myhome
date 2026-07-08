import { CurrencyCode, ExchangeRateWithChange } from "./types"

type TwelveExchangeRateSuccessResponse = {
  symbol: string
  rate: number
  timestamp: number
}

type TwelveErrorResponse = {
  code: number
  message: string
  status: "error"
}

type TwelveExchangeRateResponse =
  TwelveExchangeRateSuccessResponse | TwelveErrorResponse

type TwelveTimeSeriesSuccessResponse = {
  meta: {
    symbol: string
    interval: string
    currency_base?: string
    currency_quote?: string
  }
  values: Array<{
    datetime: string
    open: string
    high: string
    low: string
    close: string
  }>
  status: "ok"
}

type TwelveTimeSeriesResponse =
  TwelveTimeSeriesSuccessResponse | TwelveErrorResponse

function isTwelveDataError(
  data: TwelveExchangeRateResponse | TwelveTimeSeriesResponse
): data is TwelveErrorResponse {
  return "status" in data && data.status === "error"
}

export async function fetchExchangeRateWithChange(
  baseCurrency: CurrencyCode = "USD",
  quoteCurrency: CurrencyCode = "KRW"
): Promise<ExchangeRateWithChange> {
  const apiKey = process.env.TWELVDATA_API_KEY ?? process.env.TWELVEDATA_API_KEY

  if (!apiKey) {
    throw new Error("TWELVDATA_API_KEY is not configured")
  }

  const symbol = `${baseCurrency}/${quoteCurrency}`

  const exchangeRateUrl = new URL("https://api.twelvedata.com/exchange_rate")
  exchangeRateUrl.searchParams.set("symbol", symbol)
  exchangeRateUrl.searchParams.set("apikey", apiKey)

  const timeSeriesUrl = new URL("https://api.twelvedata.com/time_series")
  timeSeriesUrl.searchParams.set("symbol", symbol)
  timeSeriesUrl.searchParams.set("interval", "1day")
  timeSeriesUrl.searchParams.set("outputsize", "2")
  timeSeriesUrl.searchParams.set("apikey", apiKey)

  const [exchangeRateRes, timeSeriesRes] = await Promise.all([
    fetch(exchangeRateUrl, {
      next: {
        revalidate: 3600,
        tags: [`exchange:${baseCurrency}:${quoteCurrency}`],
      },
    }),
    fetch(timeSeriesUrl, {
      next: {
        revalidate: 3600,
        tags: [`exchange:${baseCurrency}:${quoteCurrency}`],
      },
    }),
  ])

  if (!exchangeRateRes.ok) {
    throw new Error(`Exchange rate request failed: ${exchangeRateRes.status}`)
  }

  if (!timeSeriesRes.ok) {
    throw new Error(`Time series request failed: ${timeSeriesRes.status}`)
  }

  const exchangeRateData =
    (await exchangeRateRes.json()) as TwelveExchangeRateResponse

  const timeSeriesData =
    (await timeSeriesRes.json()) as TwelveTimeSeriesResponse

  if (isTwelveDataError(exchangeRateData)) {
    throw new Error(exchangeRateData.message)
  }

  if (isTwelveDataError(timeSeriesData)) {
    throw new Error(timeSeriesData.message)
  }

  const previousDailyCandle = timeSeriesData.values[1]

  if (!previousDailyCandle) {
    throw new Error("Previous close data is missing")
  }

  const rate = exchangeRateData.rate
  const previousClose = Number(previousDailyCandle.close)

  const change = rate - previousClose
  const changeRate = (change / previousClose) * 100

  return {
    baseCurrency,
    quoteCurrency,
    symbol,
    rate,
    previousClose,
    change,
    changeRate,
    timestamp: exchangeRateData.timestamp,
  }
}
