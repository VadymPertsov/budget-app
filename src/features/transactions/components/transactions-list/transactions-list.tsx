import { Button } from '@components/_shared/button'
import { CurrentCurrency } from '@components/_shared/current-currency'
import { auth } from '@components/firebase'
import { deleteTransaction, QUERY_KEYS } from '@features/transactions/api'
import { useTransactionsStore } from '@features/transactions/store'
import { Transaction, TransactionsData } from '@features/transactions/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { normalizeDate } from '@utils/normalize-date'
import cn from 'classnames'
import { useCallback, useMemo } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { TransactionTabs } from 'types'

import styles from './styles.module.scss'

interface TransactionsListProps {
  transactions: TransactionsData | null | undefined
}

export const TransactionsList = (props: TransactionsListProps) => {
  const { transactions } = props

  const [user] = useAuthState(auth)
  const { tab, setTab } = useTransactionsStore()

  const queryClient = useQueryClient()

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

  const deleteTransactionMutation = useMutation({
    mutationFn: async (transaction: Transaction) => {
      if (user) {
        await deleteTransaction(user.uid, transaction)
      } else {
        throw new Error('User not authenticated')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.transactions, user?.uid],
      })
    },
    onError: error => {
      console.error('Error adding transaction: ', error)
    },
  })

  const handleAddTransaction = useCallback(
    (transaction: Transaction) => {
      deleteTransactionMutation.mutate(transaction)
    },
    [deleteTransactionMutation]
  )

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
              key={item.id}
              className={cn(styles.item, {
                [styles.income]: item.type === 'income',
                [styles.expenses]: item.type === 'expenses',
              })}
            >
              <div className={styles.data}>
                {normalizeDate(item.createdAt)} - {item.category}:&nbsp;
                <CurrentCurrency value={item.value} />
              </div>
              <button
                className={styles.removeBtn}
                onClick={() => handleAddTransaction(item)}
              >
                X
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
