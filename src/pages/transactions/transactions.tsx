import { auth } from '@components/firebase'
import { fetchTransactions, QUERY_KEYS } from '@features/transactions/api'
import { AddTransaction } from '@features/transactions/components/add-transaction'
import { TransactionsList } from '@features/transactions/components/transactions-list'
import { TransactionsData } from '@features/transactions/types'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthState } from 'react-firebase-hooks/auth'

import styles from './styles.module.scss'

export const Transactions = () => {
  const [user] = useAuthState(auth)
  const queryClient = useQueryClient()

  const {
    data: transactionsData,
    isLoading,
    error,
  } = useQuery<TransactionsData | null, Error>({
    queryKey: [QUERY_KEYS.transactions, user?.uid],
    queryFn: () => (user ? fetchTransactions(user.uid) : null),
    enabled: !!user,
  })

  const handleTransactionAdded = () => {
    if (user?.uid) {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.transactions, user.uid],
      })
    }
  }

  return (
    <div className={styles.root}>
      <h2>Your current balance: {transactionsData?.currentBalance || 0}</h2>
      <AddTransaction onTransactionAdded={handleTransactionAdded} />
      {isLoading && <p>Loading transactions...</p>}
      {!isLoading && error && (
        <p>Error fetching transactions: {error.message}</p>
      )}
      {!isLoading && !error && (
        <TransactionsList transactions={transactionsData} />
      )}
    </div>
  )
}
