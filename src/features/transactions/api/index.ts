import { db } from '@components/firebase'
import {
  arrayUnion,
  doc,
  increment,
  setDoc,
  updateDoc,
  getDoc,
  arrayRemove,
} from 'firebase/firestore'

import { Transaction, TransactionsData } from '../types'

export const QUERY_KEYS = {
  transactions: 'transactions',
}

export const fetchTransactions = async (
  uid?: string
): Promise<TransactionsData | null> => {
  if (!uid) return null

  const transactionRef = doc(db, QUERY_KEYS.transactions, uid)
  const transactionSnap = await getDoc(transactionRef)

  if (!transactionSnap.exists()) {
    return null
  }

  return transactionSnap.data() as TransactionsData
}

export const addTransaction = async (uid: string, transaction: Transaction) => {
  const transactionRef = doc(db, QUERY_KEYS.transactions, uid)
  const newTransaction = {
    ...transaction,
    createdAt: new Date().toISOString(),
  }

  try {
    await updateDoc(transactionRef, {
      [transaction.type]: arrayUnion(newTransaction),
      currentBalance: increment(
        transaction.type === 'income' ? transaction.value : -transaction.value
      ),
    })
  } catch {
    await setDoc(transactionRef, {
      income: transaction.type === 'income' ? [newTransaction] : [],
      expenses: transaction.type === 'expenses' ? [newTransaction] : [],
      currentBalance:
        transaction.type === 'income' ? transaction.value : -transaction.value,
    })
  }
}

export const deleteTransaction = async (
  uid: string,
  transaction: Transaction
) => {
  const transactionRef = doc(db, QUERY_KEYS.transactions, uid)

  const transactionSnap = await getDoc(transactionRef)
  if (!transactionSnap.exists()) {
    throw new Error('Transaction data not found')
  }

  const transactionsData = transactionSnap.data()
  const transactionsArray = transactionsData[transaction.type] as Transaction[]

  const transactionToRemove = transactionsArray.find(
    t => t.id === transaction.id
  )

  if (!transactionToRemove) {
    throw new Error('Transaction not found')
  }

  await updateDoc(transactionRef, {
    [transaction.type]: arrayRemove(transactionToRemove),
    currentBalance: increment(
      transaction.type === 'income'
        ? -transactionToRemove.value
        : transactionToRemove.value
    ),
  })
}
