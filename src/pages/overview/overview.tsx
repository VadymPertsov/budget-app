import { auth } from '@components/firebase'
import { PieChart } from '@features/charts/components/pie-chart'
import { fetchTransactions, QUERY_KEYS } from '@features/transactions/api'
import { Transaction, TransactionsData } from '@features/transactions/types'
import { useQuery } from '@tanstack/react-query'
import randomColor from 'randomcolor'
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
  if (!transactionsData) return <p>Something went wrong</p>

  return (
    <div className={styles.root}>
      Hello,&nbsp;
      {user ? (
        <>
          {user?.displayName}. Your current balance:&nbsp;
          <b>{transactionsData?.currentBalance || 0}</b>
          <div className={styles.charts}>
            <PieChart
              title="Expenses"
              data={buildChartData(transactionsData.expenses)}
            />
            <PieChart
              title="Income"
              data={buildChartData(transactionsData.income)}
            />
          </div>
        </>
      ) : (
        'login please'
      )}
    </div>
  )
}

const buildChartData = (data: Transaction[]) => {
  return data.map(item => ({
    name: item.category,
    value: Number(item.value),
    color: randomColor({ luminosity: 'bright' }),
  }))
}
