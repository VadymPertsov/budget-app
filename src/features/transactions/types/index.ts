export interface Transaction {
  type: 'all' | 'income' | 'expenses'
  value: number
  category: string
  createdAt: string
}

export interface TransactionsData {
  income: Transaction[]
  expenses: Transaction[]
  currentBalance: number
}
