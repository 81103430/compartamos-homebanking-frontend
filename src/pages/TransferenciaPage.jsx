// src/pages/TransferenciaPage.jsx
import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'
import { useCuentas } from '../hooks/useCuentas.js'
import hbApi from '../services/hbApi.js'
import { formatMoney, extractError, formatDate } from '../utils/format.js'

export default function TransferenciaPage() {
  const { cuentas } = useCuentas('ahorro')
  const [origen,   setOrigen]   = useState('')
  const [destino,  setDestino]  = useState('')
  const [monto,    setMonto]    = useState('')
  const [error,    setError]    = useState(null)
  const [exito,    setExito]    = useState(null)
  const [loading,  setLoading]  = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null); setExito(null)
    if (origen === destino) { setError('Origen y destino deben ser distintos.'); return }
    if (!parseFloat(monto) || parseFloat(monto) <= 0) { setError('Monto inválido.'); return }
    setLoading(true)
    try {
      const { data } = await hbApi.post('/operaciones/transferencia', { codOrigen: origen, codDestino: destino, monto: parseFloat(monto) })
      setExito(data.comprobante)
    } catch (err) { setError(extractError(err)) }
    finally { setLoading(false) }
  }

  return (
    <div className="cb-page" style={{ maxWidth: 560 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
        <Send size={22} color="var(--cb-rojo)" />
        <h2 style={{ fontSize:20, fontWeight:700 }}>Transferencia entre mis cuentas</h2>
      </div>

      {exito ? (
        <div className="cb-card">
          <div className="cb-card-body" style={{ textAlign:'center', padding:32 }}>
            <CheckCircle size={48} color="#2E7D32" style={{ marginBottom:12 }} />
            <h3 style={{ fontSize:18, fontWeight:700, marginBottom:8 }}>¡Transferencia exitosa!</h3>
            <div className="cb-comprobante">
              <div className="cb-comprobante-row"><span className="cb-comprobante-label">Cuenta origen</span><span className="cb-comprobante-val">{exito.origen}</span></div>
              <div className="cb-comprobante-row"><span className="cb-comprobante-label">Cuenta destino</span><span className="cb-comprobante-val">{exito.destino}</span></div>
              <div className="cb-comprobante-row"><span className="cb-comprobante-label">Monto</span><span className="cb-comprobante-val">{formatMoney(exito.monto)}</span></div>
              <div className="cb-comprobante-row"><span className="cb-comprobante-label">Fecha</span><span className="cb-comprobante-val">{new Date(exito.fecha).toLocaleString('es-PE')}</span></div>
              <div className="cb-comprobante-row"><span className="cb-comprobante-label">N° operación</span><span className="cb-comprobante-val">{exito.nroOperacionDebito}</span></div>
            </div>
            <button className="cb-btn cb-btn-primary" style={{ marginTop:20 }} onClick={() => { setExito(null); setMonto(''); }}>
              Nueva transferencia
            </button>
          </div>
        </div>
      ) : (
        <div className="cb-card">
          <div className="cb-card-body">
            {error && <div className="cb-alert cb-alert-error">{error}</div>}
            <form onSubmit={onSubmit}>
              <div className="cb-field">
                <label>Cuenta origen</label>
                <select className="cb-select" value={origen} onChange={e => setOrigen(e.target.value)} required>
                  <option value="">-- Selecciona --</option>
                  {cuentas.map(c => <option key={c.codcuentaahorro} value={c.codcuentaahorro}>{c.codcuentaahorro} · {formatMoney(c.saldo)}</option>)}
                </select>
              </div>
              <div className="cb-field">
                <label>Cuenta destino</label>
                <select className="cb-select" value={destino} onChange={e => setDestino(e.target.value)} required>
                  <option value="">-- Selecciona --</option>
                  {cuentas.map(c => <option key={c.codcuentaahorro} value={c.codcuentaahorro}>{c.codcuentaahorro}</option>)}
                </select>
              </div>
              <div className="cb-field">
                <label>Monto (S/)</label>
                <input className="cb-input" type="number" min="0.01" step="0.01" placeholder="0.00"
                  value={monto} onChange={e => setMonto(e.target.value)} required />
              </div>
              <button type="submit" className="cb-btn cb-btn-primary" disabled={loading} style={{ width:'100%', justifyContent:'center' }}>
                <Send size={16} /> {loading ? 'Procesando…' : 'Transferir'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
