import { CURRENCY_META } from "@/entities/exchange/model/currency"
import { CurrencyCode } from "@/entities/exchange/types"
import Image from "next/image"

export function CurrencyIcon({
  currency,
  size,
}: {
  currency: CurrencyCode
  size: number
}) {
  return (
    <Image
      loading="eager"
      src={CURRENCY_META[currency].imageUrl}
      alt={`currency-${currency}`}
      width={size}
      height={size}
      quality={75}
      className="shrink-0 rounded-full"
    />
  )
}
