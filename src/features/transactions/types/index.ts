export interface Transaction {
  type: 'income' | 'expenses'
  value: string
  category: string
  createdAt: string
}

export interface TransactionsData {
  income: Transaction[]
  expenses: Transaction[]
  currentBalance: number
}
