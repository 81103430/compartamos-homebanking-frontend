// src/components/layout/Header.jsx
import { NavLink, useNavigate } from 'react-router-dom'
import { Wallet, CreditCard, Send, FilePlus2, User, LogOut, Home } from 'lucide-react'
import { useHBAuth } from '../../hooks/useHBAuth.js'
import { primerNombre } from '../../utils/format.js'

export default function Header() {
  const { user, logout } = useHBAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  const initials = (user?.nombre || 'CL')
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0])
    .join('')
    .toUpperCase()

  return (
    <header className="cb-header">
      <div className="cb-header-inner">
        {/* Logo */}
        <NavLink to="/inicio" className="cb-header-logo" style={{ textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, background: 'white', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--cb-rojo)', fontWeight: 900, fontSize: 14, flexShrink: 0
          }}>CB</div>
          <div className="cb-header-logo-text">
            <span className="cb-header-logo-name">Compartamos</span>
            <span className="cb-header-logo-sub">BANCA POR INTERNET</span>
          </div>
        </NavLink>

        {/* Navegación */}
        <nav className="cb-nav">
          <NavLink to="/inicio"                    className={navClass}><Home size={15} />Inicio</NavLink>
          <NavLink to="/cuentas/ahorro"            className={navClass}><Wallet size={15} />Ahorros</NavLink>
          <NavLink to="/cuentas/credito"           className={navClass}><CreditCard size={15} />Créditos</NavLink>
          <NavLink to="/operaciones/transferencia" className={navClass}><Send size={15} />Transferir</NavLink>
          <NavLink to="/creditos/solicitar"        className={navClass}><FilePlus2 size={15} />Solicitar crédito</NavLink>
        </nav>

        {/* Usuario */}
        <div className="cb-header-user">
          <NavLink to="/perfil" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="cb-user-avatar">{initials}</div>
            <span className="cb-user-name">{primerNombre(user?.nombre)}</span>
          </NavLink>
          <button className="cb-btn-logout" onClick={handleLogout} title="Cerrar sesión">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  )
}

function navClass({ isActive }) {
  return 'cb-nav-link' + (isActive ? ' active' : '')
}
