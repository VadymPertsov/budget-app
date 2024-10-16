import { Button } from '@components/_shared/button'
import { useTransactionsStore } from '@features/transactions/store'
import { Transaction, TransactionsData } from '@features/transactions/types'
import { normalizeDate } from '@utils/normalize-date'
import cn from 'classnames'
import { useCallback, useMemo } from 'react'
import { TransactionTabs } from 'types'

import styles from './styles.module.scss'
import { CurrentCurrency } from '@components/_shared/current-currency'

interface TransactionsListProps {
  transactions: TransactionsData | null | undefined
}

export const TransactionsList = (props: TransactionsListProps) => {
  const { transactions } = props

  const { tab, setTab } = useTransactionsStore(state => state)

  const sortedTransactions = useMemo(() => {
    if (!transactions) return []

    const getTransactionsData = (tab: TransactionTabs) => {
      switch (tab) {
        case 'expenses':
          return transactions.expenses
        case 'income':
          return transactions.income
        case 'all':
          return [...transactions.expenses, ...transactions.income]
        default:
          return []
      }
    }

    return getTransactionsData(tab).sort(
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
          onClick={() => handleChangeTab('all')}
          text="All"
          isActive={tab === 'all'}
        />
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
              {normalizeDate(item.createdAt)} - {item.category}:&nbsp;
              <CurrentCurrency value={item.value} />
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
