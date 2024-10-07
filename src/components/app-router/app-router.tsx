import { auth } from '@components/firebase'
import { Layout } from '@components/layout'
import { ROUTES, PRIVATE_ROUTES } from '@constants/routes'
import { Overview } from '@pages/overview'
import { Transactions } from '@pages/transactions'
import { useAuthState } from 'react-firebase-hooks/auth'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

const publicRoutes = [
  {
    path: ROUTES.overview,
    element: <Overview />,
  },
]

const privateRoutes = [
  {
    path: PRIVATE_ROUTES.transactions,
    element: <Transactions />,
  },
]

export const AppRouter = () => {
  const [user, loading] = useAuthState(auth)

  if (loading) return <p>Loading...</p>

  const router = createBrowserRouter([
    {
      path: ROUTES.overview,
      element: <Layout />,
      errorElement: <p>Error</p>,
      children: [
        ...publicRoutes,
        ...(user ? privateRoutes : []),
        {
          path: '*',
          element: <Navigate to={ROUTES.overview} replace />,
        },
      ],
    },
  ])

  return <RouterProvider router={router} />
}
