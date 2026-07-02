// src/App.jsx
import { Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom'
import { useHBAuth } from './hooks/useHBAuth.js'

// Páginas
import LandingPage         from './pages/LandingPage.jsx'
import LoginPage           from './pages/LoginPage.jsx'
import HomePage            from './pages/HomePage.jsx'
import CuentasAhorroPage   from './pages/CuentasAhorroPage.jsx'
import MovimientosPage     from './pages/MovimientosPage.jsx'
import CuentasCreditoPage  from './pages/CuentasCreditoPage.jsx'
import CuotasCreditoPage   from './pages/CuotasCreditoPage.jsx'
import TransferenciaPage   from './pages/TransferenciaPage.jsx'
import SolicitarCreditoPage from './pages/SolicitarCreditoPage.jsx'
import PerfilPage          from './pages/PerfilPage.jsx'

// Componentes de layout
import Header from './components/layout/Header.jsx'

// Ruta privada: redirige a /login si no hay sesión
function PrivateRoute({ children }) {
  const { isAuthenticated } = useHBAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

// Layout autenticado: Header + contenido
function PrivateLayout({ children }) {
  return (
    <PrivateRoute>
      <Header />
      <main className="cb-main">
        <div className="cb-container">{children}</div>
      </main>
    </PrivateRoute>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/"      element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Privadas */}
      <Route path="/inicio"
        element={<PrivateLayout><HomePage /></PrivateLayout>} />

      <Route path="/cuentas/ahorro"
        element={<PrivateLayout><CuentasAhorroPage /></PrivateLayout>} />
      <Route path="/cuentas/ahorro/:cod/movimientos"
        element={<PrivateLayout><MovimientosPage /></PrivateLayout>} />

      <Route path="/cuentas/credito"
        element={<PrivateLayout><CuentasCreditoPage /></PrivateLayout>} />
      <Route path="/cuentas/credito/:cod/cuotas"
        element={<PrivateLayout><CuotasCreditoPage /></PrivateLayout>} />

      <Route path="/operaciones/transferencia"
        element={<PrivateLayout><TransferenciaPage /></PrivateLayout>} />

      <Route path="/creditos/solicitar"
        element={<PrivateLayout><SolicitarCreditoPage /></PrivateLayout>} />

      <Route path="/perfil"
        element={<PrivateLayout><PerfilPage /></PrivateLayout>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/inicio" replace />} />
    </Routes>
  )
}
