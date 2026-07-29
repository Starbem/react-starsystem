import { Route, Routes } from 'react-router'
import { DashboardLayout } from './layouts/DashboardLayout'
import { Overview } from './pages/Overview'
import { Employees } from './pages/Employees'
import { Benefits } from './pages/Benefits'
import { Settings } from './pages/Settings'

export function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Overview />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/benefits" element={<Benefits />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
