import { Sidebar } from '@components/sidebar'
import { Outlet } from 'react-router-dom'

import styles from './styles.module.scss'

export const Layout = () => {
  return (
    <div className={styles.root}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
