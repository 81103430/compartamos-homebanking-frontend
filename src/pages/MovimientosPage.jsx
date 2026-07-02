// src/pages/MovimientosPage.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import hbApi from '../services/hbApi.js'
import { formatMoney, formatDate } from '../utils/format.js'

export default function MovimientosPage() {
  const { cod } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    hbApi.get(`/cuentas/ahorro/${cod}/movimientos`)
      .then(r => setData(r.data))
      .finally(() => setLoading(false))
  }, [cod])

  return (
    <div className="cb-page">
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <button className="cb-btn cb-btn-ghost" style={{ padding:'6px 12px' }} onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
        </button>
        <h2 style={{ fontSize:18, fontWeight:700 }}>Movimientos · {cod}</h2>
      </div>
      {loading ? <div className="cb-loader"><div className="cb-spinner"/><span>Cargando…</span></div> : (
        <div className="cb-card">
          <div className="cb-card-body">
            <div className="cb-table-wrap">
              <table className="cb-table">
                <thead><tr><th>Fecha</th><th>Concepto</th><th>Canal</th><th style={{textAlign:'right'}}>Monto</th></tr></thead>
                <tbody>
                  {(data?.movimientos || []).map((m, i) => (
                    <tr key={i}>
                      <td>{formatDate(m.fecha)}</td>
                      <td>{m.concepto}</td>
                      <td>{m.canal || '—'}</td>
                      <td style={{textAlign:'right'}}
                        className={m.signo === 'E' ? 'monto-e' : 'monto-i'}>
                        {m.signo === 'E' ? '-' : '+'}{formatMoney(m.monto)}
                      </td>
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
