import { Transaction, TransactionsData } from '@features/transactions/types'
import { normalizeDate } from '@utils/normalize-date'
import cn from 'classnames'
import { useMemo } from 'react'

import styles from './styles.module.scss'

interface TransactionsListProps {
  transactions: TransactionsData | null | undefined
}

export const TransactionsList = (props: TransactionsListProps) => {
  const { transactions } = props

  const sortedTransactions = useMemo(() => {
    if (!transactions) return []
    const allTransactions: Transaction[] = [
      ...transactions.income,
      ...transactions.expenses,
    ]

    return allTransactions.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [transactions])

  return (
    <ul className={styles.root}>
      {!sortedTransactions.length ? (
        <p>No transactions available.</p>
      ) : (
        sortedTransactions.map(item => (
          <li
            key={item.createdAt}
            className={cn(styles.item, {
              [styles.income]: item.type === 'income',
              [styles.expenses]: item.type === 'expenses',
            })}
          >
            {normalizeDate(item.createdAt)} - {item.category} - {item.value}
          </li>
        ))
      )}
    </ul>
  )
}
