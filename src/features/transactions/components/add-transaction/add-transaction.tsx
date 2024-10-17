import { Button } from '@components/_shared/button'
import { Input } from '@components/_shared/input'
import { Select } from '@components/_shared/select'
import { auth } from '@components/firebase'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@constants/categories'
import { addTransaction, QUERY_KEYS } from '@features/transactions/api'
import { useTransactionsStore } from '@features/transactions/store'
import { Transaction } from '@features/transactions/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { TransactionTabs } from 'types'
import { v4 as uuidv4 } from 'uuid'

import styles from './styles.module.scss'

export const AddTransaction = () => {
  const tab = useTransactionsStore(state => state.tab)

  const [user] = useAuthState(auth)
  const [transaction, setTransaction] = useState<Transaction>({
    id: uuidv4(),
    value: 0,
    category: '',
    type: tab,
    createdAt: new Date().toISOString(),
  })

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (newTransaction: Transaction) => {
      if (user) {
        return await addTransaction(user.uid, newTransaction)
      } else {
        throw new Error('User not authenticated')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.transactions, user?.uid],
      })
      setTransaction({
        id: uuidv4(),
        value: 0,
        category: '',
        type: tab,
        createdAt: new Date().toISOString(),
      })
    },
    onError: error => {
      console.error('Error adding transaction: ', error)
    },
  })

  const handleAddTransaction = () => {
    if (transaction.value && transaction.category) {
      mutation.mutate(transaction)
    }
  }

  const handleInputChange =
    (field: keyof Transaction) => (value: string | number) => {
      setTransaction(prev => {
        const newTransaction = { ...prev, [field]: value }

        if (field === 'category') {
          newTransaction.type = INCOME_CATEGORIES.includes(value as string)
            ? 'income'
            : 'expenses'
        }

        return newTransaction
      })
    }

  return (
    <div className={styles.root}>
      <Input
        value={transaction.value === 0 ? '' : transaction.value}
        onChange={handleInputChange('value')}
        label="Value in UAH(only)"
        type="number"
        placeholder="0"
      />
      <Select
        onChange={handleInputChange('category')}
        label="Category"
        placeholder="Select category"
        options={getSelectCategoriesData(tab)}
        value={transaction.category}
      />
      <Button
        onClick={handleAddTransaction}
        disabled={
          mutation.isPending || !transaction.value || !transaction.category
        }
        text={mutation.isPending ? 'Adding...' : 'Add'}
      />
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
    </div>
  )
}

const getSelectCategoriesData = (tab: TransactionTabs) => {
  switch (tab) {
    case 'expenses':
      return EXPENSE_CATEGORIES
    case 'income':
      return INCOME_CATEGORIES
    case 'all':
      return [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]
    default:
      return []
  }
}
