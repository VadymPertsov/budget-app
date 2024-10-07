import { Input } from '@components/_shared/input'
import { Select } from '@components/_shared/select'
import { auth } from '@components/firebase'
import { expenseCategories, incomeCategories } from '@constants/categories'
import { addTransaction, QUERY_KEYS } from '@features/transactions/api'
import { Transaction } from '@features/transactions/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

import styles from './styles.module.scss'

const allCategories = [...incomeCategories, ...expenseCategories]

interface AddTransactionProps {
  onTransactionAdded: () => void
}

export const AddTransaction = (props: AddTransactionProps) => {
  const { onTransactionAdded } = props

  const [user] = useAuthState(auth)
  const [transaction, setTransaction] = useState<Transaction>({
    value: '',
    category: '',
    type: 'income',
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
        value: '',
        category: '',
        type: 'income',
        createdAt: '',
      })
      onTransactionAdded()
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
          newTransaction.type = incomeCategories.includes(value as string)
            ? 'income'
            : 'expenses'
        }

        return newTransaction
      })
    }

  return (
    <div className={styles.root}>
      <Input
        value={transaction.value}
        onChange={handleInputChange('value')}
        label="Value"
        type="number"
        placeholder="0"
      />
      <Select
        onChange={handleInputChange('category')}
        label="Category"
        placeholder="Select category"
        options={allCategories.sort()}
        value={transaction.category}
      />
      <button
        onClick={handleAddTransaction}
        className={styles.button}
        disabled={
          mutation.isPending || !transaction.value || !transaction.category
        }
      >
        {mutation.isPending ? 'Adding...' : 'Add'}
      </button>
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
    </div>
  )
}
