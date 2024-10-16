import { TransactionTabs } from 'types'
import { create } from 'zustand'

interface State {
  tab: TransactionTabs
}

interface Action {
  setTab: (tab: TransactionTabs) => void
}

export const useTransactionsStore = create<State & Action>(set => ({
  tab: 'all',
  setTab: tab => set(() => ({ tab })),
}))
