// src/hooks/useCuentas.js
import { useState, useEffect } from 'react'
import hbApi from '../services/hbApi.js'

export function useCuentas(tipo = 'ahorro') {
  const [cuentas, setCuentas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    hbApi.get(`/cuentas/${tipo}`)
      .then(r => { if (!cancelled) setCuentas(r.data) })
      .catch(e => { if (!cancelled) setError(e?.response?.data?.detail || 'Error') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [tipo])

  return { cuentas, loading, error }
}
