// src/pages/CuentasCreditoPage.jsx
import { useNavigate } from 'react-router-dom'
import { CreditCard, Calendar } from 'lucide-react'
import { useCreditos } from '../hooks/useCreditos.js'
import { formatMoney, formatDate } from '../utils/format.js'

export default function CuentasCreditoPage() {
  const navigate = useNavigate()
  const { creditos, loading } = useCreditos()
  return (
    <div className="cb-page">
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
        <CreditCard size={22} color="var(--cb-rojo)" />
        <h2 style={{ fontSize:20, fontWeight:700 }}>Mis Préstamos</h2>
      </div>
      {loading ? <div className="cb-loader"><div className="cb-spinner"/><span>Cargando…</span></div> : (
        <div className="cb-card">
          <div className="cb-card-body">
            {creditos.length === 0 ? <p className="cb-empty">No tiene créditos vigentes.</p> : (
              <ul className="cb-prodlist">
                {creditos.map(c => (
                  <li key={c.codcuentacredito}>
                    <div className="cb-prod-info">
                      <strong>{c.codcuentacredito}</strong>
                      <small>{c.tipo_credito} · Desembolso: {formatDate(c.fechadesembolsocredito)}</small>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ fontWeight:700 }}>{formatMoney(c.pago_pendiente)}</div>
                        {c.dias_atraso > 0 && <small style={{ color:'var(--cb-rojo)', fontSize:11 }}>{c.dias_atraso} días atraso</small>}
                      </div>
                      <button className="cb-btn cb-btn-secondary" style={{ padding:'6px 12px', fontSize:12 }}
                        onClick={() => navigate(`/cuentas/credito/${c.codcuentacredito}/cuotas`)}>
                        <Calendar size={14} /> Cronograma
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
