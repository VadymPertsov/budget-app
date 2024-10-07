import { Button } from '@components/_shared/button'
import { Transaction, TransactionsData } from '@features/transactions/types'
import { normalizeDate } from '@utils/normalize-date'
import cn from 'classnames'
import { useCallback, useMemo } from 'react'

import styles from './styles.module.scss'

interface TransactionsListProps {
  transactions: TransactionsData | null | undefined
  tab: Transaction['type']
  setTab: (tab: Transaction['type']) => void
}

export const TransactionsList = (props: TransactionsListProps) => {
  const { transactions, tab, setTab } = props

  const sortedTransactions = useMemo(() => {
    if (!transactions) return []

    const transactionsData =
      tab === 'expenses' ? transactions.expenses : transactions.income

    return transactionsData.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [tab, transactions])

  const handleChangeTab = useCallback(
    (tab: Transaction['type']) => {
      setTab(tab)
    },
    [setTab]
  )

  return (
    <div className={styles.root}>
      <div className={styles.tabs}>
        <Button
          onClick={() => handleChangeTab('expenses')}
          text="Expenses"
          isActive={tab === 'expenses'}
        />
        <Button
          onClick={() => handleChangeTab('income')}
          text="Income"
          isActive={tab === 'income'}
        />
      </div>
      <ul className={styles.list}>
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
              {normalizeDate(item.createdAt)} - {item.category}: {item.value}
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
