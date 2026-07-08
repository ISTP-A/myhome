import { fetchExchangeRateWithChange } from "@/entities/exchange/api"
import { CurrencyCode, SUPPORTED_CURRENCIES } from "@/entities/exchange/types"
import { NextResponse } from "next/server"

function isCurrencyCode(value: string): value is CurrencyCode {
  return SUPPORTED_CURRENCIES.includes(value as CurrencyCode)
}

function getCurrencyParam(
  searchParams: URLSearchParams,
  key: string,
  fallback: CurrencyCode
): CurrencyCode | null {
  const value = searchParams.get(key)?.toUpperCase() ?? fallback

  if (!isCurrencyCode(value)) {
    return null
  }

  return value
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const baseCurrency = getCurrencyParam(searchParams, "base", "USD")
  const quoteCurrency = getCurrencyParam(searchParams, "quote", "KRW")

  if (!baseCurrency || !quoteCurrency) {
    return NextResponse.json(
      {
        error: "Unsupported currency code",
        supportedCurrencies: SUPPORTED_CURRENCIES,
      },
      { status: 400 }
    )
  }

  try {
    const exchangeRate = await fetchExchangeRateWithChange(
      baseCurrency,
      quoteCurrency
    )

    return NextResponse.json(exchangeRate)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch exchange rate"

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
