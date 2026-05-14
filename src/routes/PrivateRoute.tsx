import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { tokenStorage } from '@/utils/tokenStorage'

export default function PrivateRoute() {
  const location = useLocation()
  const token = tokenStorage.getAccessToken()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}