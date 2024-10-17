import { CurrentCurrency } from '@components/_shared/current-currency'
import { auth } from '@components/firebase'
import { fetchTransactions, QUERY_KEYS } from '@features/transactions/api'
import { AddTransaction } from '@features/transactions/components/add-transaction'
import { TransactionsList } from '@features/transactions/components/transactions-list'
import { TransactionsData } from '@features/transactions/types'
import { useQuery } from '@tanstack/react-query'
import { useAuthState } from 'react-firebase-hooks/auth'

import styles from './styles.module.scss'

export const Transactions = () => {
  const [user] = useAuthState(auth)

  const { data, isLoading, error } = useQuery<TransactionsData | null, Error>({
    queryKey: [QUERY_KEYS.transactions, user?.uid],
    queryFn: () => fetchTransactions(user?.uid),
  })

  return (
    <div className={styles.root}>
      <h2>
        Your current balance:&nbsp;
        <CurrentCurrency value={data?.currentBalance} />
      </h2>
      <AddTransaction />
      {isLoading && <p>Loading transactions...</p>}
      {!isLoading && error && (
        <p>Error fetching transactions: {error.message}</p>
      )}
      {!isLoading && !error && <TransactionsList transactions={data} />}
    </div>
  )
}
