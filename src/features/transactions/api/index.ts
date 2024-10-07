import { db } from '@components/firebase'
import {
  arrayUnion,
  doc,
  increment,
  setDoc,
  updateDoc,
  getDoc,
} from 'firebase/firestore'

import { Transaction, TransactionsData } from '../types'

export const QUERY_KEYS = {
  transactions: 'transactions',
}

export const fetchTransactions = async (
  uid: string
): Promise<TransactionsData | null> => {
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
