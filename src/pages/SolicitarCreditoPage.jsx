// src/pages/SolicitarCreditoPage.jsx
import { useState } from 'react'
import { FilePlus2, CheckCircle, Calculator } from 'lucide-react'
import hbApi from '../services/hbApi.js'
import { formatMoney, extractError } from '../utils/format.js'

// Calcula cuota fija (amortización francesa)
function calcularCuota(monto, plazo, tea) {
  const tem = Math.pow(1 + tea / 100, 1 / 12) - 1
  if (tem === 0) return monto / plazo
  return (monto * tem) / (1 - Math.pow(1 + tem, -plazo))
}

// Genera el cronograma completo
function generarCronograma(monto, plazo, tea, fechaDesembolso, diaPago) {
  const tem = Math.pow(1 + tea / 100, 1 / 12) - 1
  const cuota = calcularCuota(monto, plazo, tea)
  const rows = []
  let saldo = monto
  const base = new Date(fechaDesembolso)

  for (let n = 1; n <= plazo; n++) {
    const fecha = new Date(base)
    fecha.setMonth(base.getMonth() + n)
    fecha.setDate(diaPago)
    const interes  = parseFloat((saldo * tem).toFixed(2))
    const capital  = parseFloat((Math.min(cuota - interes, saldo)).toFixed(2))
    saldo = parseFloat(Math.max(saldo - capital, 0).toFixed(2))
    rows.push({ n, fecha: fecha.toLocaleDateString('es-PE'), cuota: cuota.toFixed(2), capital: capital.toFixed(2), interes: interes.toFixed(2), saldo: saldo.toFixed(2) })
  }
  return rows
}

const TIPOS = [
  { value: 'ME', label: 'Microempresa (ME) · TEA 43.92% sin seguro / 40.92% con seguro' },
  { value: 'CO', label: 'Consumo (CO) · TEA 43.92% sin seguro / 40.92% con seguro' },
]
const ACTIVIDADES = [
  { value: '011101', label: 'Comercio al por menor' },
  { value: '011102', label: 'Comercio al por mayor' },
  { value: '021101', label: 'Servicios personales' },
  { value: '031101', label: 'Producción agropecuaria' },
  { value: '041101', label: 'Manufactura' },
]
const PLAZOS = [6, 12, 18, 24, 36]

export default function SolicitarCreditoPage() {
  const [monto,        setMonto]        = useState('')
  const [plazo,        setPlazo]        = useState('12')
  const [tipo,         setTipo]         = useState('ME')
  const [seguro,       setSeguro]       = useState(false)
  const [actividad,    setActividad]    = useState('011101')
  const [ingreso,      setIngreso]      = useState('')
  const [preview,      setPreview]      = useState(null)
  const [enviado,      setEnviado]      = useState(null)
  const [error,        setError]        = useState(null)
  const [loading,      setLoading]      = useState(false)

  const tea = seguro ? 40.92 : 43.92

  function calcularPreview() {
    setError(null)
    const m = parseFloat(monto)
    const p = parseInt(plazo)
    if (!m || m <= 0) { setError('Ingresa un monto válido.'); return }
    const cuota = calcularCuota(m, p, tea)
    const crono = generarCronograma(m, p, tea, new Date(), new Date().getDate())
    setPreview({ monto: m, plazo: p, tea, cuota, cronograma: crono })
  }

  async function enviarSolicitud() {
    setLoading(true); setError(null)
    try {
      const { data } = await hbApi.post('/creditos/solicitar', {
        monto: parseFloat(monto), plazo: parseInt(plazo),
        codtipocredito: tipo, codactividad: actividad,
        montoingresoneto: parseFloat(ingreso) || 0,
      })
      setEnviado(data)
    } catch (err) { setError(extractError(err)) }
    finally { setLoading(false) }
  }

  if (enviado) return (
    <div className="cb-page" style={{ maxWidth: 600 }}>
      <div className="cb-card">
        <div className="cb-card-body" style={{ textAlign:'center', padding:40 }}>
          <CheckCircle size={52} color="#2E7D32" style={{ marginBottom:16 }} />
          <h3 style={{ fontSize:20, fontWeight:800, marginBottom:8 }}>¡Solicitud registrada!</h3>
          <p style={{ color:'var(--cb-gris-medio)', marginBottom:20 }}>Tu solicitud ha sido enviada al equipo de evaluación.</p>
          <div className="cb-comprobante">
            <div className="cb-comprobante-row"><span className="cb-comprobante-label">N° Solicitud</span><span className="cb-comprobante-val">{enviado.codsolicitud}</span></div>
            <div className="cb-comprobante-row"><span className="cb-comprobante-label">Monto solicitado</span><span className="cb-comprobante-val">{formatMoney(enviado.monto)}</span></div>
            <div className="cb-comprobante-row"><span className="cb-comprobante-label">Plazo</span><span className="cb-comprobante-val">{enviado.plazo} meses</span></div>
            <div className="cb-comprobante-row"><span className="cb-comprobante-label">Estado</span><span className="cb-comprobante-val" style={{ color:'var(--cb-naranja)' }}>{enviado.estado}</span></div>
          </div>
          <button className="cb-btn cb-btn-primary" style={{ marginTop:20 }} onClick={() => { setEnviado(null); setPreview(null); setMonto(''); }}>
            Nueva solicitud
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="cb-page">
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
        <FilePlus2 size={22} color="var(--cb-rojo)" />
        <h2 style={{ fontSize:20, fontWeight:700 }}>Solicitar Préstamo</h2>
      </div>

      <div className="cb-page-grid">
        <div>
          <div className="cb-card">
            <div className="cb-card-header"><div className="cb-card-title">Datos del préstamo</div></div>
            <div className="cb-card-body">
              {error && <div className="cb-alert cb-alert-error">{error}</div>}

              <div className="cb-field">
                <label>Tipo de crédito</label>
                <select className="cb-select" value={tipo} onChange={e => { setTipo(e.target.value); setPreview(null) }}>
                  {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              <div className="cb-field">
                <label>Monto solicitado (S/)</label>
                <input className="cb-input" type="number" min="100" step="100" placeholder="Ej. 5000"
                  value={monto} onChange={e => { setMonto(e.target.value); setPreview(null) }} />
              </div>

              <div className="cb-field">
                <label>Plazo (meses)</label>
                <select className="cb-select" value={plazo} onChange={e => { setPlazo(e.target.value); setPreview(null) }}>
                  {PLAZOS.map(p => <option key={p} value={p}>{p} meses</option>)}
                </select>
              </div>

              <div className="cb-field">
                <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                  <input type="checkbox" checked={seguro} onChange={e => { setSeguro(e.target.checked); setPreview(null) }} />
                  Con seguro de desgravamen (TEA 40.92%)
                </label>
              </div>

              <div className="cb-field">
                <label>Actividad económica</label>
                <select className="cb-select" value={actividad} onChange={e => setActividad(e.target.value)}>
                  {ACTIVIDADES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
              </div>

              <div className="cb-field">
                <label>Ingreso neto mensual (S/)</label>
                <input className="cb-input" type="number" min="0" step="0.01" placeholder="Ej. 2000"
                  value={ingreso} onChange={e => setIngreso(e.target.value)} />
              </div>

              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                <button type="button" className="cb-btn cb-btn-secondary" onClick={calcularPreview}>
                  <Calculator size={16} /> Calcular cuota
                </button>
                {preview && (
                  <button type="button" className="cb-btn cb-btn-primary" onClick={enviarSolicitud} disabled={loading}>
                    <FilePlus2 size={16} /> {loading ? 'Enviando…' : 'Enviar solicitud'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preview cronograma */}
        {preview && (
          <div>
            <div className="cb-card">
              <div className="cb-card-header"><div className="cb-card-title">Vista previa</div></div>
              <div className="cb-card-body">
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
                  <div style={{ background:'var(--cb-gris-claro)', borderRadius:8, padding:'10px 14px' }}>
                    <div style={{ fontSize:11, color:'var(--cb-gris-medio)' }}>Monto</div>
                    <div style={{ fontWeight:700 }}>{formatMoney(preview.monto)}</div>
                  </div>
                  <div style={{ background:'#FFF0EE', borderRadius:8, padding:'10px 14px' }}>
                    <div style={{ fontSize:11, color:'var(--cb-gris-medio)' }}>Cuota mensual</div>
                    <div style={{ fontWeight:700, color:'var(--cb-rojo)' }}>{formatMoney(preview.cuota)}</div>
                  </div>
                  <div style={{ background:'var(--cb-gris-claro)', borderRadius:8, padding:'10px 14px' }}>
                    <div style={{ fontSize:11, color:'var(--cb-gris-medio)' }}>Plazo</div>
                    <div style={{ fontWeight:700 }}>{preview.plazo} meses</div>
                  </div>
                  <div style={{ background:'var(--cb-gris-claro)', borderRadius:8, padding:'10px 14px' }}>
                    <div style={{ fontSize:11, color:'var(--cb-gris-medio)' }}>TEA</div>
                    <div style={{ fontWeight:700 }}>{preview.tea}%</div>
                  </div>
                </div>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:8 }}>Cronograma (primeras 6 cuotas)</div>
                <div className="cb-table-wrap">
                  <table className="cb-table">
                    <thead><tr><th>Cuota</th><th>Capital</th><th>Interés</th><th>Saldo</th></tr></thead>
                    <tbody>
                      {preview.cronograma.slice(0, 6).map(r => (
                        <tr key={r.n}>
                          <td>{r.n}</td>
                          <td>{formatMoney(r.capital)}</td>
                          <td>{formatMoney(r.interes)}</td>
                          <td>{formatMoney(r.saldo)}</td>
                        </tr>
                      ))}
                      {preview.cronograma.length > 6 && (
                        <tr><td colSpan={4} style={{ textAlign:'center', color:'var(--cb-gris-medio)', fontSize:12 }}>… {preview.cronograma.length - 6} cuotas más</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
