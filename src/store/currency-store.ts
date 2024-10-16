import { CurrencyLabels } from 'types'
import { create } from 'zustand'

export const CURRENCY: CurrencyLabels[] = ['uah', 'usd', 'eur']

interface State {
  currency: CurrencyLabels
  allCurrency: CurrencyLabels[]
}

interface Action {
  setCurrency: (rate: CurrencyLabels) => void
}

export const useCurrencyStore = create<State & Action>(set => ({
  currency: 'uah',
  allCurrency: CURRENCY,
  setCurrency: currency => set(() => ({ currency })),
}))
