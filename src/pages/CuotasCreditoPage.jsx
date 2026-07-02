// src/pages/CuotasCreditoPage.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import hbApi from '../services/hbApi.js'
import { formatMoney, formatDate } from '../utils/format.js'

export default function CuotasCreditoPage() {
  const { cod } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    hbApi.get(`/cuentas/credito/${cod}/cuotas`)
      .then(r => setData(r.data))
      .finally(() => setLoading(false))
  }, [cod])

  const estadoClass = (est) => {
    if (est === 'PA') return 'cb-badge cb-badge-green'
    if (est === 'VE') return 'cb-badge cb-badge-red'
    return 'cb-badge cb-badge-gray'
  }
  const estadoLabel = (est) => ({ PA: 'Pagada', VE: 'Vencida', PE: 'Pendiente' }[est] || est)

  return (
    <div className="cb-page">
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <button className="cb-btn cb-btn-ghost" style={{ padding:'6px 12px' }} onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
        </button>
        <h2 style={{ fontSize:18, fontWeight:700 }}>Cronograma · {cod}</h2>
      </div>
      {loading ? <div className="cb-loader"><div className="cb-spinner"/><span>Cargando…</span></div> : (
        <div className="cb-card">
          <div className="cb-card-body">
            <div className="cb-table-wrap">
              <table className="cb-table">
                <thead>
                  <tr>
                    <th>N° Cuota</th><th>Vencimiento</th><th>Cuota</th>
                    <th>Capital</th><th>Interés</th><th>Saldo</th><th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.cronograma || []).map(c => (
                    <tr key={c.nrocuota} style={{ opacity: c.estado==='PA' ? 0.6 : 1 }}>
                      <td style={{ fontWeight:600 }}>{c.nrocuota}</td>
                      <td>{formatDate(c.vencimiento)}</td>
                      <td style={{ fontWeight:600 }}>{formatMoney(c.montocuota)}</td>
                      <td>{formatMoney(c.capital)}</td>
                      <td>{formatMoney(c.interes)}</td>
                      <td>{formatMoney(c.saldo)}</td>
                      <td><span className={estadoClass(c.estado)}>{estadoLabel(c.estado)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
