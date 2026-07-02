// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CreditCard, Lock, LogIn, ArrowLeft } from 'lucide-react'
import { useHBAuth } from '../hooks/useHBAuth.js'
import { extractError } from '../utils/format.js'

export default function LoginPage() {
  const { login, isAuthenticated } = useHBAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/inicio', { replace: true })
  }, [isAuthenticated, navigate])

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!username.trim()) { setError('Ingresa tu usuario.'); return }
    if (!password)        { setError('Ingresa tu contraseña.'); return }

    setLoading(true)
    try {
      await login(username.trim(), password)
      navigate('/inicio', { replace: true })
    } catch (err) {
      setError(extractError(err, 'No se pudo iniciar sesión.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="cb-login-bg">
      <div className="cb-login-card">
        <div className="cb-login-franja" />

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 60, height: 60, background: 'var(--cb-rojo)',
            borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px', color: 'white', fontWeight: 900, fontSize: 22,
          }}>CB</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--cb-texto)', marginBottom: 2 }}>
            Compartamos Banco
          </h2>
          <p style={{ fontSize: 13, color: 'var(--cb-gris-medio)' }}>Banca por Internet</p>
        </div>

        {/* Error */}
        {error && <div className="cb-alert cb-alert-error">{error}</div>}

        {/* Formulario */}
        <form onSubmit={onSubmit}>
          <div className="cb-field">
            <label htmlFor="username">Usuario / N° de cuenta</label>
            <div style={{ position: 'relative' }}>
              <CreditCard size={17} style={iconStyle} />
              <input
                id="username"
                className="cb-input"
                style={{ paddingLeft: 40 }}
                placeholder="Ej. cli000001"
                autoComplete="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoFocus
                required
              />
            </div>
          </div>

          <div className="cb-field">
            <label htmlFor="password">Clave de Internet</label>
            <div style={{ position: 'relative' }}>
              <Lock size={17} style={iconStyle} />
              <input
                id="password"
                type="password"
                className="cb-input"
                style={{ paddingLeft: 40 }}
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="cb-btn cb-btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
            disabled={loading}
          >
            <LogIn size={17} />
            {loading ? 'Ingresando…' : 'Ingresar a mi banca'}
          </button>
        </form>

        {/* Hint de prueba */}
        <div className="cb-login-hint">
          Prueba: usuario <strong>cli000001</strong> · clave <strong>demo1234</strong>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--cb-gris-medio)', fontSize: 13 }}>
            <ArrowLeft size={14} /> Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

const iconStyle = {
  position: 'absolute', left: 12, top: '50%',
  transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none',
}
