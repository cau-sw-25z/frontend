import { createBrowserRouter } from 'react-router-dom'

import HomePage from '@/pages/HomePage'
import StockDetailPage from '@/pages/StockDetailPage'
import PortfolioPage from '@/pages/PortfolioPage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import MainLayout from '@/layouts/MainLayout'
import PrivateRoute from './PrivateRoute'

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/stocks/:ticker',
        element: <StockDetailPage />,
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: '/portfolio',
            element: <PortfolioPage />,
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
])

export default router