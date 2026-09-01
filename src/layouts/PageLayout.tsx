import { Outlet } from 'react-router-dom'

export function PageLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  )
}
