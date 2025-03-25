
import { Login } from '@/pages/Login'
import { Routes, Route } from 'react-router-dom'
import PosSystem from '@/pages/PoSystem'
import { DashboardLayout } from '@/layout/DashboardLayout'
import Caja from '@/pages/Caja'
import { Ventas } from '@/pages/Ventas'
import ProductsPage from '@/pages/ProductsPage'
import DetailsSales  from '@/components/sales/details-sales'
export const RouterPrincipal = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/pos" element={<PosSystem />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<PosSystem />} />
        <Route path="productos" element={<ProductsPage />} />
        <Route path="ventas" element={<Ventas />} />
        <Route path="ventas/:id" element={<DetailsSales />} />
        <Route path="caja" element={<Caja />} />
      </Route>
    </Routes>
  )
}
