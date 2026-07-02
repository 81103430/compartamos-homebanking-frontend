// src/pages/HomePage.jsx
import { useNavigate } from 'react-router-dom'
import { Wallet, CreditCard, Send, FilePlus2, PiggyBank, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react'
import { useHBAuth } from '../hooks/useHBAuth.js'
import { useCuentas } from '../hooks/useCuentas.js'
import { useCreditos } from '../hooks/useCreditos.js'
import { formatMoney, simboloMoneda, toNumber, primerNombre } from '../utils/format.js'

export default function HomePage() {
  const { user } = useHBAuth()
  const navigate = useNavigate()
  const { cuentas, loading: lc } = useCuentas('ahorro')
  const { creditos, loading: lk } = useCreditos()

  const totalAhorro = cuentas.reduce((s, c) => s + toNumber(c.saldo), 0)
  const totalDeuda  = creditos.reduce((s, c) => s + toNumber(c.pago_pendiente), 0)

  const acciones = [
    { icon: Send,      label: 'Transferir',         to: '/operaciones/transferencia' },
    { icon: FilePlus2, label: 'Solicitar préstamo',  to: '/creditos/solicitar' },
    { icon: Wallet,    label: 'Ver mis ahorros',     to: '/cuentas/ahorro' },
    { icon: CreditCard,label: 'Ver mis créditos',    to: '/cuentas/credito' },
  ]

  return (
    <div className="cb-page">
      {/* Saludo */}
      <div className="cb-hello">
        <h1>Hola {primerNombre(user?.nombre)}, bienvenido a tu banca</h1>
        <p>Esta es la posición global de tus productos en Compartamos Banco.</p>
      </div>

      <div className="cb-page-grid">
        <div>
          {/* KPIs */}
          <div className="cb-kpis">
            <div className="cb-kpi">
              <div className="cb-kpi-ico" style={{ background: '#FFF0EE', color: 'var(--cb-rojo)' }}>
                <PiggyBank size={22} />
              </div>
              <div>
                <div className="cb-kpi-label"><TrendingUp size={12} /> Total en ahorros</div>
                <div className="cb-kpi-val">{formatMoney(totalAhorro)}</div>
                <small style={{ color: 'var(--cb-gris-medio)', fontSize: 12 }}>{cuentas.length} cuenta(s)</small>
              </div>
            </div>
            <div className="cb-kpi">
              <div className="cb-kpi-ico" style={{ background: '#FFF3E0', color: 'var(--cb-naranja)' }}>
                <CreditCard size={22} />
              </div>
              <div>
                <div className="cb-kpi-label"><TrendingDown size={12} /> Deuda en créditos</div>
                <div className="cb-kpi-val">{formatMoney(totalDeuda)}</div>
                <small style={{ color: 'var(--cb-gris-medio)', fontSize: 12 }}>{creditos.length} crédito(s)</small>
              </div>
            </div>
          </div>

          {/* Cuentas ahorro */}
          <div className="cb-card">
            <div className="cb-card-header">
              <div className="cb-card-title"><Wallet size={17} /> Cuentas de Ahorro</div>
              <button className="cb-link" onClick={() => navigate('/cuentas/ahorro')}>
                Ver todas <ChevronRight size={14} />
              </button>
            </div>
            <div className="cb-card-body">
              {lc ? (
                <div className="cb-loader"><div className="cb-spinner" /><span>Cargando cuentas…</span></div>
              ) : cuentas.length === 0 ? (
                <p className="cb-empty">No tiene cuentas de ahorro registradas.</p>
              ) : (
                <ul className="cb-prodlist">
                  {cuentas.map(c => (
                    <li key={c.codcuentaahorro}
                      onClick={() => navigate(`/cuentas/ahorro/${c.codcuentaahorro}/movimientos`)}>
                      <div className="cb-prod-info">
                        <strong>{c.codcuentaahorro}</strong>
                        <small>{c.tipo} · <span className={`cb-badge ${c.estado === 'Activa' ? 'cb-badge-green' : 'cb-badge-gray'}`}>{c.estado}</span></small>
                      </div>
                      <div className="cb-prod-amt">
                        {formatMoney(c.saldo, simboloMoneda(c.moneda))}
                        <ChevronRight size={15} />
                      </div>
                    </li>
                  ))}
                  <li className="cb-prodlist-total">
                    <span>Saldo disponible total</span>
                    <strong>{formatMoney(totalAhorro)}</strong>
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Créditos */}
          <div className="cb-card">
            <div className="cb-card-header">
              <div className="cb-card-title"><CreditCard size={17} /> Préstamos</div>
              <button className="cb-link" onClick={() => navigate('/cuentas/credito')}>
                Ver todos <ChevronRight size={14} />
              </button>
            </div>
            <div className="cb-card-body">
              {lk ? (
                <div className="cb-loader"><div className="cb-spinner" /><span>Cargando créditos…</span></div>
              ) : creditos.length === 0 ? (
                <p className="cb-empty">No tiene créditos vigentes.</p>
              ) : (
                <ul className="cb-prodlist">
                  {creditos.map(c => (
                    <li key={c.codcuentacredito}
                      onClick={() => navigate(`/cuentas/credito/${c.codcuentacredito}/cuotas`)}>
                      <div className="cb-prod-info">
                        <strong>{c.codcuentacredito}</strong>
                        <small>{c.tipo_credito} · <span className={`cb-badge ${c.dias_atraso > 0 ? 'cb-badge-red' : 'cb-badge-green'}`}>{c.calificacion || 'Normal'}</span></small>
                      </div>
                      <div className="cb-prod-amt">
                        {formatMoney(c.pago_pendiente)}
                        <ChevronRight size={15} />
                      </div>
                    </li>
                  ))}
                  <li className="cb-prodlist-total">
                    <span>Saldo pendiente total</span>
                    <strong>{formatMoney(totalDeuda)}</strong>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Panel de acciones */}
        <div>
          <div className="cb-action-panel">
            <h3>Operaciones frecuentes</h3>
            {acciones.map(a => {
              const Icon = a.icon
              return (
                <button key={a.to} className="cb-action-btn" onClick={() => navigate(a.to)}>
                  <Icon size={18} /> {a.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
