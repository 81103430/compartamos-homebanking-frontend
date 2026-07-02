// src/pages/PerfilPage.jsx
import { useState, useEffect } from 'react'
import { User } from 'lucide-react'
import { useHBAuth } from '../hooks/useHBAuth.js'
import hbApi from '../services/hbApi.js'
import { formatDate } from '../utils/format.js'

export default function PerfilPage() {
  const { user } = useHBAuth()
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    hbApi.get('/auth/perfil')
      .then(r => setPerfil(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const datos = perfil || {}
  const campo = (label, val) => (
    <div className="cb-comprobante-row">
      <span className="cb-comprobante-label">{label}</span>
      <span className="cb-comprobante-val">{val || '—'}</span>
    </div>
  )

  return (
    <div className="cb-page" style={{ maxWidth: 640 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
        <User size={22} color="var(--cb-rojo)" />
        <h2 style={{ fontSize:20, fontWeight:700 }}>Mi Perfil</h2>
      </div>

      {loading ? <div className="cb-loader"><div className="cb-spinner"/><span>Cargando…</span></div> : (
        <div className="cb-card">
          <div className="cb-card-body">
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24, padding:'16px 0', borderBottom:'var(--cb-border)' }}>
              <div style={{ width:60, height:60, borderRadius:'50%', background:'var(--cb-rojo)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:800, fontSize:22 }}>
                {(user?.nombre || 'C').split(/[\s,]+/).filter(Boolean).slice(0,2).map(s=>s[0]).join('').toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize:18, fontWeight:700 }}>{datos.nomcliente || user?.nombre}</div>
                <div style={{ fontSize:13, color:'var(--cb-gris-medio)' }}>{user?.codcliente}</div>
              </div>
            </div>
            <div className="cb-comprobante">
              {campo('DNI', datos.numerodni)}
              {campo('Email', datos.email)}
              {campo('Teléfono', datos.telefono)}
              {campo('Fecha de nacimiento', formatDate(datos.fechanacimiento))}
              {campo('Actividad económica', datos.desactividadeconomica)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
