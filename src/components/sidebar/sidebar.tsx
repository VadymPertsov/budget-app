import { Select } from '@components/_shared/select'
import { auth } from '@components/firebase'
import { PRIVATE_ROUTES, ROUTES } from '@constants/routes'
import { useCurrencyStore } from '@store/currency-store'
import cn from 'classnames'
import {
  useAuthState,
  useSignInWithGoogle,
  useSignOut,
} from 'react-firebase-hooks/auth'
import { Link } from 'react-router-dom'

import styles from './styles.module.scss'

export const Sidebar = () => {
  const [user, loading, error] = useAuthState(auth)
  const [signInWithGoogle] = useSignInWithGoogle(auth)
  const [signOut] = useSignOut(auth)

  const { currency, setCurrency, allCurrency } = useCurrencyStore(
    state => state
  )

  if (error) return <p>Error: {error.message}</p>

  const routesToDisplay = user ? { ...ROUTES, ...PRIVATE_ROUTES } : ROUTES

  return (
    <aside className={styles.root}>
      <div className={styles.logo}>LOGO</div>
      <ul className={styles.list}>
        {Object.entries(routesToDisplay).map(([key, value]) => (
          <li className={styles.item} key={key}>
            <Link className={styles.link} to={value}>
              {key}
            </Link>
          </li>
        ))}
        <li>
          <Select
            className={styles.link}
            onChange={setCurrency}
            label="Select currency"
            options={allCurrency}
            value={currency}
          />
        </li>
      </ul>
      <div className={styles.auth}>
        {loading ? (
          <p className={styles.button}>Loading...</p>
        ) : user ? (
          <button
            className={cn(styles.button, styles.item)}
            onClick={() => signOut()}
          >
            Logout
          </button>
        ) : (
          <button
            className={cn(styles.button, styles.item)}
            onClick={() => signInWithGoogle()}
          >
            Login with google
          </button>
        )}
      </div>
    </aside>
  )
}
