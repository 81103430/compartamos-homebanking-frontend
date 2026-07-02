// src/pages/CuentasAhorroPage.jsx
import { useNavigate } from 'react-router-dom'
import { Wallet, ChevronRight, Eye } from 'lucide-react'
import { useCuentas } from '../hooks/useCuentas.js'
import { formatMoney, simboloMoneda } from '../utils/format.js'

export default function CuentasAhorroPage() {
  const navigate = useNavigate()
  const { cuentas, loading } = useCuentas('ahorro')
  return (
    <div className="cb-page">
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
        <Wallet size={22} color="var(--cb-rojo)" />
        <h2 style={{ fontSize:20, fontWeight:700 }}>Mis Cuentas de Ahorro</h2>
      </div>
      {loading ? <div className="cb-loader"><div className="cb-spinner"/><span>Cargando…</span></div> : (
        <div className="cb-card">
          <div className="cb-card-body">
            {cuentas.length === 0 ? <p className="cb-empty">No tiene cuentas de ahorro.</p> : (
              <ul className="cb-prodlist">
                {cuentas.map(c => (
                  <li key={c.codcuentaahorro}>
                    <div className="cb-prod-info">
                      <strong>{c.codcuentaahorro}</strong>
                      <small>{c.tipo} · TEA {parseFloat(c.tea || 0).toFixed(2)}%</small>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <strong>{formatMoney(c.saldo, simboloMoneda(c.moneda))}</strong>
                      <button className="cb-btn cb-btn-secondary" style={{ padding:'6px 12px', fontSize:12 }}
                        onClick={() => navigate(`/cuentas/ahorro/${c.codcuentaahorro}/movimientos`)}>
                        <Eye size={14} /> Movimientos
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
