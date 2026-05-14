import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function MainLayout() {
  return (
    <div>
      <header>Header</header>

      <div style={{ display: 'flex' }}>
        <Sidebar />

        <main style={{ marginLeft: '20px' }}>
          <Outlet />
        </main>
      </div>

      <footer>Footer</footer>
    </div>
  )
}