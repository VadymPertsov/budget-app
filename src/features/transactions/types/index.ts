import { TransactionTabs } from 'types'

export interface Transaction {
  id: string
  type: TransactionTabs
  value: number
  category: string
  createdAt: string
}

export interface TransactionsData {
  income: Transaction[]
  expenses: Transaction[]
  currentBalance: number
}
