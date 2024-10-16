import { useCurrencyStore } from '@store/currency-store'
import cn from 'classnames'
import { CurrencyLabels } from 'types'

const EXCHANGE_RATE: Record<CurrencyLabels, number> = {
  UAH: 1, // 1 UAH = 1 UAH
  USD: 0.027, // 1 UAH = 0.027 USD
  EUR: 0.025, // 1 UAH = 0.025 EUR
}

interface CurrentCurrencyProps {
  className?: string
  value?: number
}

export const CurrentCurrency = (props: CurrentCurrencyProps) => {
  const { className, value = 0 } = props

  const { currency } = useCurrencyStore(state => state)

  const convertedValue = (value * (EXCHANGE_RATE[currency] || 1)).toFixed(2)

  return (
    <span className={cn(className)}>
      {convertedValue} {currency.toUpperCase()}
    </span>
  )
}
