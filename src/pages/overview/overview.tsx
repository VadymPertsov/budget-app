import { auth } from '@components/firebase'
import { fetchTransactions, QUERY_KEYS } from '@features/transactions/api'
import { TransactionsData } from '@features/transactions/types'
import { useQuery } from '@tanstack/react-query'
import { useAuthState } from 'react-firebase-hooks/auth'

import styles from './styles.module.scss'

export const Overview = () => {
  const [user, loading] = useAuthState(auth)

  const { data: transactionsData } = useQuery<TransactionsData | null, Error>({
    queryKey: [QUERY_KEYS.transactions, user?.uid],
    queryFn: () => (user ? fetchTransactions(user.uid) : null),
    enabled: !!user,
  })

  if (loading) return <p>Loading...</p>

  return (
    <div className={styles.root}>
      Hello,&nbsp;
      {user ? (
        <>
          {user?.displayName}. Your current balance:&nbsp;
          <b>{transactionsData?.currentBalance || 0}</b>
        </>
      ) : (
        'login please'
      )}
    </div>
  )
}
