import { Routes, Route, Navigate } from 'react-router-dom'
import { Login } from '@/pages/Login'
import PosSystem from '@/components/pos-system'
import { DashboardLayout } from '@/layout/DashboardLayout'
import Caja from '@/pages/Caja'
import { Ventas } from '@/pages/Ventas'
import ProductsPage from '@/pages/ProductsPage'
import DetailsSales from '@/components/sales/details-sales'
import Users from '@/pages/Users'
import DataUsuario from '@/pages/DataUsuario'
import { useAuth } from '@/store/auth'
export const RouterPrincipal = () => {
  const user = useAuth((state) => state.user)

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/pos" element={<PosSystem />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        {/**404 */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
        {user?.role === 'Administrador' && (
          <>
            <Route index element={<PosSystem />} />
            <Route path="productos" element={<ProductsPage />} />
            <Route path="ventas" element={<Ventas />} />
            <Route path="ventas/:id" element={<DetailsSales />} />
            <Route path="caja" element={<Caja />} />
            <Route path="usuarios" element={<Users />} />
            <Route path="datos-usuario/:id" element={<DataUsuario />} />
          </>
        )}
        {user?.role === 'Vendedor' && (
          <>
            <Route index element={<PosSystem />} />
            <Route path="productos" element={<ProductsPage />} />
            <Route path="ventas" element={<Ventas />} />
            <Route path="ventas/:id" element={<DetailsSales />} />
            <Route path="caja" element={<Caja />} />
            <Route path="datos-usuario/:id" element={<DataUsuario />} />
          </>
        )}
      </Route>
    </Routes>
  )
}
